class HarJob < StatisticsJob

  def self.schedule_next(delay, handler, page_id)
    probes = Rails.application.config.probes
    probe = probes.sample
    mutex_name = "har_#{probe['name']}"

    scheduler = Rufus::Scheduler.singleton
    scheduler.in(delay, handler, {page_id: page_id, probe: probe, mutex: mutex_name})
  end

  def call(job, _time)
    page_id = job.opts[:page_id]
    probe = job.opts[:probe]
    Rails.logger.info "Starting job #{self.class.name} for page #{page_id} on probe #{probe['name']}"
    ActiveRecord::Base.connection_pool.with_connection do
      if Page.exists?(page_id)
        page = Page.find(page_id)
        perform(page, probe)
      end
    end
    HarJob.schedule_next(Rails.configuration.x.jobs.har_interval, job.handler, page_id)
  end

  def perform(page, probe)
    if page.locked
      Rails.logger.info "Har job not done because #{page.url} is locked"
      return
    end

    if page.uptime_status.zero?
      Rails.logger.info "Har job not done because #{page.url} is down"
      return
    end

    begin
      res = launch_probe(probe, page)
      if res.is_a?(Net::HTTPSuccess)
        result = JSON.parse(res.body)
        metric = write_metrics(probe, page, result)
        metric.write_har(res.body)
        Rails.logger.info "Success har for #{page.id} : #{page.url}"
      else
        Rails.logger.error "Error har #{res.code} for #{page.id} : #{page.url}"
      end
    rescue Exception => e
      Rails.logger.error "Error for #{page.id} : #{page.url}"
      Rails.logger.error e.to_s
    end
  end

  def launch_probe(probe, page)
    uri = URI.parse("http://#{probe['host']}:#{probe['port']}/har?url=#{page.url}&emulation=#{page.device}&token=#{probe['token']}")
    send_request(uri)
  end

  def write_metrics(probe, page, result)
    resources = result['log']['entries']

    data = {}
    data['html_requests']  = 0
    data['js_requests']    = 0
    data['css_requests']   = 0
    data['image_requests'] = 0
    data['font_requests']  = 0
    data['other_requests'] = 0
    data['html_bytes']     = 0
    data['js_bytes']       = 0
    data['css_bytes']      = 0
    data['image_bytes']    = 0
    data['font_bytes']     = 0
    data['other_bytes']    = 0

    resources.each do |resource|
      content = resource['response']['content']
      mime_type = find_mime_type(resource['request']['url'], content['mimeType'])
      data[mime_type + '_requests'] += 1
      begin
        data[mime_type + '_bytes'] += resource['response']['_transferSize']
      rescue
        Rails.logger.debug "Can't process content : #{resource['request']['url']}"
      end
    end

    metric = AssetsMetrics.new page_id: page.id, probe: probe['name']
    metric.time_key = generate_time_key
    metric.html_requests  = data['html_requests']
    metric.js_requests    = data['js_requests']
    metric.css_requests   = data['css_requests']
    metric.image_requests = data['image_requests']
    metric.font_requests  = data['font_requests']
    metric.other_requests = data['other_requests']
    metric.html_bytes  = data['html_bytes']
    metric.js_bytes    = data['js_bytes']
    metric.css_bytes   = data['css_bytes']
    metric.image_bytes = data['image_bytes']
    metric.font_bytes  = data['font_bytes']
    metric.other_bytes = data['other_bytes']
    metric.write!
  end

  def find_mime_type(url, mime_type)
    return 'other' if mime_type.nil? || url.nil?
    return 'html'  if mime_type.include?('text/html')
    return 'js'    if mime_type.include?('javascript') || mime_type.include?('/ecmascript')
    return 'css'   if mime_type.include?('text/css')
    return 'image' if mime_type.include?('image/')
    return 'font'  if mime_type.include?('font-') || mime_type.include?('ms-font') || mime_type.include?('font/')
    return 'font'  if url.ends_with?('.woff') || url.ends_with?('.woff2')

    Rails.logger.debug "Other mime type : #{mime_type} for url #{url}"
    return 'other'
  end

end

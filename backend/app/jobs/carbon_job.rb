class CarbonJob < StatisticsJob
  def self.schedule_next(delay, handler, page_id)
    probes = Rails.application.config.probes
    probe = probes.sample
    mutex_name = "carbon_#{probe['name']}"

    scheduler = Rufus::Scheduler.singleton
    scheduler.in(delay, handler, { page_id: page_id, probe: probe, mutex: mutex_name })
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
    CarbonJob.schedule_next(Rails.configuration.x.jobs.carbon_interval, job.handler, page_id)
  end

  def perform(page, probe)
    if page.locked
      Rails.logger.info "Carbon job not done because #{page.url} is locked"
      return
    end

    if page.uptime_status.zero?
      Rails.logger.info "Carbon job not done because #{page.url} is down"
      return
    end

    begin
      res = launch_probe(probe, page)
      if res.is_a?(Net::HTTPSuccess)
        result = JSON.parse(res.body)
        write_metrics(probe, page, result)
        Rails.logger.info "Success carbon for #{page.id} : #{page.url}"
      else
        Rails.logger.error "Error carbon #{res.code} for #{page.id} : #{page.url}"
      end
    rescue StandardError => e
      Rails.logger.error "Error carbon for #{page.id} : #{page.url}"
      Rails.logger.error e.to_s
    end
  end

  def launch_probe(probe, page)
    uri = URI.parse("http://#{probe['host']}:#{probe['port']}/carbon?url=#{page.url}&token=#{probe['token']}")
    send_request(uri)
  end

  def write_metrics(probe, page, result)
    metric = CarbonMetrics.new page_id: page.id, probe: probe['name']
    metric.time_key = generate_time_key
    co2 = result['host']['green'] ? result['co2']['renewable'] : result['co2']['grid']
    metric.co2_first = co2['first']
    metric.co2_second = co2['second']
    metric.co2_adjusted = co2['adjusted']
    metric.ecoindex_first = result['ecoIndex']['first']
    metric.ecoindex_second = result['ecoIndex']['second']
    metric.ecoindex_adjusted = result['ecoIndex']['adjusted']
    metric.bytes_first = result['bytes']['first']
    metric.bytes_second = result['bytes']['second']
    metric.bytes_adjusted = result['bytes']['adjusted']
    metric.elements_first = result['elements']['first']
    metric.elements_second = result['elements']['second']
    metric.elements_adjusted = result['elements']['first']
    metric.requests_first = result['requests']['first']
    metric.requests_second = result['requests']['second']
    metric.requests_adjusted = result['requests']['adjusted']
    metric.green_host = result['host']['green']
    metric.write!
  end
end

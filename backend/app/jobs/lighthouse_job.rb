class LighthouseJob < StatisticsJob

  def self.schedule_next(delay, handler, page_id)
    probes = Rails.application.config.probes
    probe = probes.sample
    mutex_name = "lighthouse_#{probe['name']}"

    scheduler = Rufus::Scheduler.singleton
    scheduler.in(delay, handler, {:page_id => page_id, :probe => probe, :mutex => mutex_name})
  end

  def call(job, time)
    page_id = job.opts[:page_id]
    probe = job.opts[:probe]
    Rails.logger.info "Starting job #{self.class.name} for page #{page_id} on probe #{probe['name']}"
    ActiveRecord::Base.connection_pool.with_connection do
      if Page.exists?(page_id)
        page = Page.find(page_id)
        perform(page, probe)
      end
    end
    LighthouseJob.schedule_next(Rails.configuration.x.jobs.lighthouse_interval, job.handler, page_id)
  end

  def perform(page, probe)
    if page.locked == 0
      Rails.logger.info "Lighthouse job not done because #{page.url} is locked"
      return
    end

    if page.uptime_status == 0
      Rails.logger.info "Lighthouse job not done because #{page.url} is down"
      return
    end

    begin
      res = launch_probe(probe, page, 'html')
      if res.is_a?(Net::HTTPSuccess)
        metric = write_metrics(probe, page, res["X-Lighthouse-scores"], res["X-Lighthouse-metrics"])
        metric.write_report(res.body)

        Rails.logger.info "Success lighthouse for #{page.id} : #{page.url}"
      else
        Rails.logger.error "Error lighthouse #{res.code} for #{page.id} : #{page.url}"
      end
    rescue Exception => e
      Rails.logger.error "Error for #{page.id} : #{page.url}"
      Rails.logger.error e.to_s
    end
  end

  def launch_probe(probe, page, type)
    uri = URI.parse("http://#{probe['host']}:#{probe['port']}/lighthouse?url=#{page.url}&type=#{type}&emulation=#{page.device}&token=#{probe['token']}")
    send_request(uri)
  end

  def write_metrics(probe, page, scores, metrics)
    metric = LighthouseMetrics.new page_id: page.id, probe: probe["name"]
    metric.time_key = generate_time_key

    values = scores.split(";").map(&:to_f)
    metric.pwa            = values[0]
    metric.performance    = values[1]
    metric.accessibility  = values[2]
    metric.best_practices = values[3]
    metric.seo            = values[4]

    values = metrics.split(";").map(&:to_f)
    metric.ttfb                   = values[0]
    metric.first_meaningful_paint = values[1]
    metric.first_interactive      = values[2]
    metric.speed_index            = values[3]

    metric.write!
  end
end

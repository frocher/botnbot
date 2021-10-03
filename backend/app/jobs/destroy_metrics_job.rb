# Job to delete metrics for a page
class DestroyMetricsJob
  def call(job, _time)
    page_id = job.opts[:page_id]
    Rails.logger.info "Starting job #{self.class.name} for page #{page_id}"
    ActiveRecord::Base.connection_pool.with_connection do
      # Destroy lighthouse metrics and reports
      LighthouseMetrics.by_page(page_id).delete_all
      metric = LighthouseMetrics.new page_id: page_id
      metric.delete_reports

      # Destroy uptime metrics and reports
      UptimeMetrics.by_page(page_id).delete_all
      metric = UptimeMetrics.new page_id: page_id
      metric.delete_reports

      # Destroy assets metrics and reports
      AssetsMetrics.by_page(page_id).delete_all
      metric = AssetsMetrics.new page_id: page_id
      metric.delete_reports

      # Destroy carbon metrics and reports
      CarbonMetrics.by_page(page_id).delete_all
    end
    Rails.logger.info "Success #{self.class.name} for #{page_id}"
  end
end

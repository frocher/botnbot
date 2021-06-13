require 'zlib'

class LighthouseMetrics < Influxer::Metrics
  set_series :lighthouse
  tags :page_id, :probe, :time_key
  attributes :pwa, :performance, :accessibility, :best_practices, :seo,
             :ttfb, :largest_contentful_paint, :total_blocking_time, :speed_index

  scope :by_page, ->(id) { where(page_id: id) if id.present? }
  scope :by_time_key, ->(key) { where(time_key: key) if key.present? }

  before_write :round_data

  def self.mean_score_query
    'mean(pwa) as pwa,' \
    'mean(performance) as performance,' \
    'mean(accessibility) as accessibility,' \
    'mean(best_practices) as best_practices,' \
    'mean(seo) as seo'
  end

  def self.mean_performance_query
    'mean(ttfb) as ttfb,' \
    'mean(largest_contentful_paint) as largest_contentful_paint,' \
    'mean(total_blocking_time) as total_blocking_time,' \
    'mean(speed_index) as speed_index'
  end

  def round_data
    self.pwa = pwa.round(0)
    self.performance = performance.round(0)
    self.accessibility = accessibility.round(0)
    self.best_practices = best_practices.round(0)
    self.seo = seo.round(0)
    self.ttfb = ttfb.round(0)
    self.largest_contentful_paint = largest_contentful_paint.round(0)
    self.total_blocking_time = total_blocking_time.round(0)
    self.speed_index = speed_index.round(0)
  end

  def report_path
    File.join(Rails.root, 'reports/lighthouse', page_id.to_s)
  end

  def write_report(result)
    path = report_path
    FileUtils.mkdir_p(path) unless File.exist?(path)
    File.open(File.join(path, "#{time_key}.html.gz"), 'wb') do |f|
      gz = Zlib::GzipWriter.new(f, 9)
      gz.write result
      gz.close
    end
  end

  def read_report
    result = nil
    File.open(File.join(report_path, "#{time_key}.html.gz")) do |f|
      gz = Zlib::GzipReader.new(f)
      result = gz.read
      gz.close
    end
    result
  end

  def delete_reports
    FileUtils.rm_rf(report_path, secure: true)
  end
end

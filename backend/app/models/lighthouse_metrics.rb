require "zlib"

class LighthouseMetrics < Influxer::Metrics
  set_series :lighthouse
  tags :page_id, :probe, :time_key
  attributes :pwa, :performance, :accessibility, :best_practices, :seo,
             :ttfb, :largest_contentful_paint, :total_blocking_time, :speed_index

  scope :by_page, -> (id) { where(page_id: id) if id.present? }
  scope :by_time_key, -> (key) { where(time_key: key) if key.present? }

  before_write :round_data

  def round_data
    self.pwa = self.pwa.round(0)
    self.performance = self.performance.round(0)
    self.accessibility = self.accessibility.round(0)
    self.best_practices = self.best_practices.round(0)
    self.seo = self.seo.round(0)
    self.ttfb = self.ttfb.round(0)
    self.largest_contentful_paint = self.largest_contentful_paint.round(0)
    self.total_blocking_time = self.total_blocking_time.round(0)
    self.speed_index = self.speed_index.round(0)
  end

  def write_report(result)
    path = File.join(Rails.root, "reports/lighthouse", page_id.to_s)
    FileUtils.mkdir_p(path) unless File.exist?(path)
    File.open(File.join(path, time_key + ".html.gz"), "wb") do |f|
      gz = Zlib::GzipWriter.new(f, 9)
      gz.write result
      gz.close
    end
  end

  def read_report
    result = nil
    path = File.join(Rails.root, "reports/lighthouse", page_id.to_s)
    File.open(File.join(path, time_key + ".html.gz")) do |f|
      gz = Zlib::GzipReader.new(f)
      result = gz.read
      gz.close
    end
    result
  end
end

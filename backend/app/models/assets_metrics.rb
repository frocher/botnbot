class AssetsMetrics < Influxer::Metrics
  set_series :assets
  tags :page_id, :probe, :time_key
  attributes :html_requests, :js_requests, :css_requests, :image_requests, :font_requests, :other_requests,
             :html_bytes, :js_bytes, :css_bytes, :image_bytes, :font_bytes, :other_bytes

  scope :by_page, ->(id) { where(page_id: id) if id.present? }

  def self.mean_requests_query
    'mean(html_requests) as html,' \
    'mean(js_requests) as js,' \
    'mean(css_requests) as css,' \
    'mean(image_requests) as image,' \
    'mean(font_requests) as font,' \
    'mean(other_requests) as other'
  end

  def self.mean_bytes_query
    'mean(html_bytes) as html,' \
    'mean(js_bytes) as js,' \
    'mean(css_bytes) as css,' \
    'mean(image_bytes) as image,' \
    'mean(font_bytes) as font,' \
    'mean(other_bytes) as other'
  end

  def har_path
    File.join(Rails.root, 'reports/har', page_id.to_s)
  end

  def write_har(har)
    path = har_path
    FileUtils.mkdir_p(path) unless File.exist?(path)
    File.open(File.join(path, time_key + '.har.gz'), 'wb') do |f|
      gz = Zlib::GzipWriter.new(f, 9)
      gz.write har
      gz.close
    end
  end

  def read_har
    result = nil
    File.open(File.join(har_path, time_key + '.har.gz')) do |f|
      gz = Zlib::GzipReader.new(f)
      result = gz.read
      gz.close
    end
    result
  end

  def delete_reports
    FileUtils.rm_rf(har_path, secure: true)
  end
end

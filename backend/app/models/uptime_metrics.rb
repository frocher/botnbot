class UptimeMetrics < Influxer::Metrics
  set_series :uptime
  tags :page_id, :probe, :time_key
  attributes :value, :error_code, :error_message

  scope :by_page, ->(id) { where(page_id: id) if id.present? }

  def content_path
    File.join(Rails.root, 'reports/uptime', page_id.to_s)
  end

  def write_content(content)
    path = content_path
    FileUtils.mkdir_p(path) unless File.exist?(path)
    File.open(File.join(path, time_key + '.html.gz'), 'wb') do |f|
      gz = Zlib::GzipWriter.new(f, 9)
      gz.write content
      gz.close
    end
  end

  def read_content
    result = nil
    File.open(File.join(content_path, time_key + '.html.gz')) do |f|
      gz = Zlib::GzipReader.new(f)
      result = gz.read
      gz.close
    end
    result
  end

  def delete_reports
    FileUtils.rm_rf(content_path, secure: true)
  end
end

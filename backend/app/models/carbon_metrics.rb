class CarbonMetrics < Influxer::Metrics
  set_series :carbon
  tags :page_id, :probe, :time_key
  attributes :co2_first, :co2_second, :co2_adjusted, :ecoindex_first, :ecoindex_second, :ecoindex_adjusted,
             :bytes_first, :bytes_second, :bytes_adjusted, :elements_first, :elements_second, :elements_adjusted,
             :requests_first, :requests_second, :requests_adjusted, :green_host

  scope :by_page, ->(id) { where(page_id: id) if id.present? }

  before_write :round_data

  def self.query
    'co2_first, co2_second, co2_adjusted, ecoindex_first, ecoindex_second, ecoindex_adjusted,' \
    'bytes_first, bytes_second, bytes_adjusted, elements_first, elements_second, elements_adjusted,' \
    'requests_first, requests_second, requests_adjusted, green_host'
  end

  def self.by_page_and_date(page, start_date, end_date)
    select_value = CarbonMetrics.query
    CarbonMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
  end

  def self.mean_query
    'mean(co2_first) as co2_first,' \
    'mean(co2_second) as co2_second,' \
    'mean(co2_adjusted) as co2_adjusted,' \
    'mean(ecoindex_first) as ecoindex_first,' \
    'mean(ecoindex_second) as ecoindex_second,' \
    'mean(ecoindex_adjusted) as ecoindex_adjusted,' \
    'mean(bytes_first) as bytes_first,' \
    'mean(bytes_second) as bytes_second,' \
    'mean(bytes_adjusted) as bytes_adjusted,' \
    'mean(elements_first) as elements_first,' \
    'mean(elements_second) as elements_second,' \
    'mean(elements_adjusted) as elements_adjusted,' \
    'mean(requests_first) as requests_first,' \
    'mean(requests_second) as requests_second,' \
    'mean(requests_adjusted) as requests_adjusted'
  end

  def round_data
    self.co2_first = co2_first.round(3)
    self.co2_second = co2_second.round(3)
    self.co2_adjusted = co2_adjusted.round(3)
    self.ecoindex_first = ecoindex_first.round(0)
    self.ecoindex_second = ecoindex_second.round(0)
    self.ecoindex_adjusted = ecoindex_adjusted.round(0)
    self.bytes_first = bytes_first.round(0)
    self.bytes_second = bytes_second.round(0)
    self.bytes_adjusted = bytes_adjusted.round(0)
    self.elements_first = elements_first.round(0)
    self.elements_second = elements_second.round(0)
    self.elements_adjusted = elements_adjusted.round(0)
    self.requests_first = requests_first.round(0)
    self.requests_second = requests_second.round(0)
    self.requests_adjusted = requests_adjusted.round(0)
  end
end

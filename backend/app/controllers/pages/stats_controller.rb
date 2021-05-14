class Pages::StatsController < ApplicationController
  before_action :authenticate_user!

  def index
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_page, @page)

    @start_date = Date.parse(params[:start]).beginning_of_day
    @end_date   = Date.parse(params[:end]).end_of_day

    result = {}
    result['uptime']      = get_uptime(@page, @start_date, @end_date)
    result['lighthouse']  = get_lighthouse(@page, @start_date, @end_date)
    result['performance'] = get_performance(@page, @start_date, @end_date)
    result['requests']    = get_requests(@page, @start_date, @end_date)
    result['bytes']       = get_bytes(@page, @start_date, @end_date)
    result['carbon']      = get_carbon(@page, @start_date, @end_date)

    render json: result
  end

  def read_uptime_summary(page, start_date, end_date)
    data = UptimeMetrics.select(UptimeMetrics.mean_query).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_uptime_points(page, start_date, end_date)
    nb_days = days(start_date, end_date)
    data = UptimeMetrics.select(UptimeMetrics.mean_query)
                        .by_page(page.id)
                        .where(time: start_date..end_date).time(interval(nb_days))
                        .fill(:none)
    data.to_a
  end

  def read_lighthouse_summary(page, start_date, end_date)
    select_value = LighthouseMetrics.mean_score_query
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_lighthouse_points(page, start_date, end_date)
    select_value = LighthouseMetrics.mean_score_query
    nb_days = days(start_date, end_date)
    data = LighthouseMetrics.select(select_value)
                            .by_page(page.id)
                            .where(time: start_date..end_date)
                            .time(interval(nb_days))
                            .fill(:none)
    data.to_a
  end

  def read_performance_summary(page, start_date, end_date)
    select_value = LighthouseMetrics.mean_performance_query
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_performance_points(page, start_date, end_date)
    select_value = LighthouseMetrics.mean_performance_query
    nb_days = days(start_date, end_date)
    data = LighthouseMetrics.select(select_value)
                            .by_page(page.id)
                            .where(time: start_date..end_date)
                            .time(interval(nb_days))
                            .fill(:none)
    data.to_a
  end

  def read_requests_summary(page, start_date, end_date)
    select_value = AssetsMetrics.mean_requests_query
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_requests_points(page, start_date, end_date)
    select_value = AssetsMetrics.mean_requests_query
    nb_days = days(start_date, end_date)
    data = AssetsMetrics.select(select_value)
                        .by_page(page.id)
                        .where(time: start_date..end_date)
                        .time(interval(nb_days))
                        .fill(:none)
    data.to_a
  end

  def read_bytes_summary(page, start_date, end_date)
    select_value = AssetsMetrics.mean_bytes_query
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_bytes_points(page, start_date, end_date)
    select_value = AssetsMetrics.mean_bytes_query
    nb_days = days(start_date, end_date)
    data = AssetsMetrics.select(select_value)
                        .by_page(page.id)
                        .where(time: start_date..end_date)
                        .time(interval(nb_days)).fill(:none)
    data.to_a
  end

  def read_carbon_summary(page, start_date, end_date)
    select_value = CarbonMetrics.mean_query
    data = CarbonMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_carbon_points(page, start_date, end_date)
    select_value = CarbonMetrics.mean_query
    nb_days = days(start_date, end_date)
    data = CarbonMetrics.select(select_value)
                        .by_page(page.id)
                        .where(time: start_date..end_date)
                        .time(interval(nb_days))
                        .fill(:none)
    data.to_a
  end

  def get_uptime(page, start_date, end_date)
    result = create_empty(['uptime'])
    data = read_uptime_summary(page, start_date, end_date)
    unless data.empty?
      result[0]['summary'] = data[0]['value']
      result[0]['values'] = read_uptime_points(page, start_date, end_date)
    end
    result
  end

  def get_lighthouse(page, start_date, end_date)
    keys = ['pwa', 'performance', 'accessibility', 'best_practices', 'seo']
    result = create_empty(keys)
    data = read_lighthouse_summary(page, start_date, end_date)
    unless data.empty?
      result = create_summary(data, result, keys)
      points = read_lighthouse_points(page, start_date, end_date)
      result = create_points(points, result, keys)
    end
    result
  end

  def get_performance(page, start_date, end_date)
    result = create_empty(['first_byte', 'first_paint', 'speed_index', 'interactive'])
    data = read_performance_summary(page, start_date, end_date)
    unless data.empty?
      keys = ['ttfb', 'largest_contentful_paint', 'speed_index', 'total_blocking_time']
      result = create_summary(data, result, keys)
      points = read_performance_points(page, start_date, end_date)
      result = create_points(points, result, keys)
    end
    result
  end

  def get_requests(page, start_date, end_date)
    result = create_assets_array
    data = read_requests_summary(page, start_date, end_date)
    unless data.empty?
      init_assets_summary(result, data)
      points = read_requests_points(page, start_date, end_date)
      init_assets_points(result, points)
    end
    result
  end

  def get_bytes(page, start_date, end_date)
    result = create_assets_array
    data = read_bytes_summary(page, start_date, end_date)
    unless data.empty?
      init_assets_summary(result, data)
      points = read_bytes_points(page, start_date, end_date)
      init_assets_points(result, points)
    end
    result
  end

  def assets_keys
    ['html', 'css', 'js', 'image', 'font', 'other']
  end

  def create_assets_array
    create_empty(assets_keys)
  end

  def init_assets_summary(assets, data)
    create_summary(data, assets, assets_keys)
  end

  def init_assets_points(assets, points)
    create_points(points, assets, assets_keys)
  end

  def get_carbon(page, start_date, end_date)
    keys = [
      'co2_first', 'co2_second', 'co2_adjusted',
      'ecoindex_first', 'ecoindex_second', 'ecoindex_adjusted',
      'bytes_first', 'bytes_second', 'bytes_adjusted',
      'elements_first', 'elements_second', 'elements_adjusted',
      'requests_first', 'requests_second', 'requests_adjusted'
    ]
    result = create_empty(keys)
    data = read_carbon_summary(page, start_date, end_date)
    unless data.empty?
      result = create_summary(data, result, keys)
      points = read_carbon_points(page, start_date, end_date)
      result = create_points(points, result, keys)
    end
    result
  end

  def create_empty(keys)
    result = []
    keys.each do |key|
      result.push({ 'key' => key, 'summary' => 0, 'values' => [] })
    end
    result
  end

  def create_summary(data, result, keys)
    keys.each_with_index do |key, index|
      result[index]['summary'] = data[0][key]
    end
    result
  end

  def create_points(points, result, keys)
    points.each do |point|
      keys.each_with_index do |key, index|
        result[index]['values'].push({ 'time' => point['time'], 'value' => point[key] })
      end
    end
    result
  end

  def days(start_date, end_date)
    (end_date - start_date).to_i / 86_400
  end

  def interval(nb_days)
    nb_days < 7 ? '1h' : '1d'
  end
end

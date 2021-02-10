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

    render json: result
  end

  def read_uptime_summary(page, start_date, end_date)
    data = UptimeMetrics.select('mean(value) as value').by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_uptime_points(page, start_date, end_date)
    nb_days = (end_date - start_date).to_i / 86_400
    interval = nb_days < 7 ? '1h' : '1d'
    data = UptimeMetrics.select('mean(value) as value').by_page(page.id).where(time: start_date..end_date).time(interval).fill(:none)
    data.to_a
  end

  def read_lighthouse_summary(page, start_date, end_date)
    select_value = 'mean(pwa) as pwa,' \
                   'mean(performance) as performance,' \
                   'mean(accessibility) as accessibility,' \
                   'mean(best_practices) as best_practices,' \
                   'mean(seo) as seo'
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_lighthouse_points(page, start_date, end_date)
    select_value = 'mean(pwa) as pwa,' \
                   'mean(performance) as performance,' \
                   'mean(accessibility) as accessibility,' \
                   'mean(best_practices) as best_practices,' \
                   'mean(seo) as seo'
    nb_days = (end_date - start_date).to_i / 86_400
    interval = nb_days < 7 ? '1h' : '1d'
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date).time(interval).fill(:none)
    data.to_a
  end

  def read_performance_summary(page, start_date, end_date)
    select_value = 'mean(ttfb) as ttfb,' \
                   'mean(largest_contentful_paint) as largest_contentful_paint,' \
                   'mean(total_blocking_time) as total_blocking_time,' \
                   'mean(speed_index) as speed_index'
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_performance_points(page, start_date, end_date)
    select_value = 'mean(ttfb) as ttfb,' \
                   'mean(largest_contentful_paint) as largest_contentful_paint,' \
                   'mean(total_blocking_time) as total_blocking_time,' \
                   'mean(speed_index) as speed_index'

    nb_days = (end_date - start_date).to_i / 86_400
    interval = nb_days < 7 ? '1h' : '1d'
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date).time(interval).fill(:none)
    data.to_a
  end

  def read_requests_summary(page, start_date, end_date)
    select_value = 'mean(html_requests) as html,' \
                   'mean(js_requests) as js,' \
                   'mean(css_requests) as css,' \
                   'mean(image_requests) as image,' \
                   'mean(font_requests) as font,' \
                   'mean(other_requests) as other'
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_requests_points(page, start_date, end_date)
    select_value = 'mean(html_requests) as html,' \
                  'mean(js_requests) as js,' \
                  'mean(css_requests) as css,' \
                  'mean(image_requests) as image,' \
                  'mean(font_requests) as font,' \
                  'mean(other_requests) as other'
    nb_days = (end_date - start_date).to_i / 86_400
    interval = nb_days < 7 ? '1h' : '1d'
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date).time(interval).fill(:none)
    data.to_a
  end

  def read_bytes_summary(page, start_date, end_date)
    select_value = 'mean(html_bytes) as html,' \
                   'mean(js_bytes) as js,' \
                   'mean(css_bytes) as css,' \
                   'mean(image_bytes) as image,' \
                   'mean(font_bytes) as font,' \
                   'mean(other_bytes) as other'
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end

  def read_bytes_points(page, start_date, end_date)
    select_value = 'mean(html_bytes) as html,' \
                   'mean(js_bytes) as js,' \
                   'mean(css_bytes) as css,' \
                   'mean(image_bytes) as image,' \
                   'mean(font_bytes) as font,' \
                   'mean(other_bytes) as other'
    nb_days = (end_date - start_date).to_i / 86_400
    interval = nb_days < 7 ? '1h' : '1d'
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date).time(interval).fill(:none)
    data.to_a
  end

  def get_uptime(page, start_date, end_date)
    result = [
      { 'key' => 'uptime', 'summary' => 0, 'values' => [] }
    ]
    data = read_uptime_summary(page, start_date, end_date)
    unless data.empty?
      result[0]['summary'] = data[0]['value']
      result[0]['values'] = read_uptime_points(page, start_date, end_date)
    end
    result
  end

  def get_lighthouse(page, start_date, end_date)
    result = [
      { 'key' => 'pwa', 'summary' => 0, 'values' => [] },
      { 'key' => 'performance', 'summary' => 0, 'values' => [] },
      { 'key' => 'accessibility', 'summary' => 0, 'values' => [] },
      { 'key' => 'best_practices', 'summary' => 0, 'values' => [] },
      { 'key' => 'seo', 'summary' => 0, 'values' => [] }
    ]
    data = read_lighthouse_summary(page, start_date, end_date)
    unless data.empty?
      result[0]['summary'] = data[0]['pwa']
      result[1]['summary'] = data[0]['performance']
      result[2]['summary'] = data[0]['accessibility']
      result[3]['summary'] = data[0]['best_practices']
      result[4]['summary'] = data[0]['seo']
      points = read_lighthouse_points(page, start_date, end_date)
      points.each do |point|
        result[0]['values'].push({ 'time' => point['time'], 'value' => point['pwa'].round })
        result[1]['values'].push({ 'time' => point['time'], 'value' => point['performance'].round })
        result[2]['values'].push({ 'time' => point['time'], 'value' => point['accessibility'].round })
        result[3]['values'].push({ 'time' => point['time'], 'value' => point['best_practices'].round })
        result[4]['values'].push({ 'time' => point['time'], 'value' => point['seo'].round })
      end
    end
    result
  end

  def get_performance(page, start_date, end_date)
    result = [
      { 'key' => 'first_byte', 'summary' => 0, 'values' => [] },
      { 'key' => 'first_paint', 'summary' => 0, 'values' => [] },
      { 'key' => 'speed_index', 'summary' => 0, 'values' => [] },
      { 'key' => 'interactive', 'summary' => 0, 'values' => [] }
    ]
    data = read_performance_summary(page, start_date, end_date)
    unless data.empty?
      result[0]['summary'] = data[0]['ttfb']
      result[1]['summary'] = data[0]['largest_contentful_paint']
      result[2]['summary'] = data[0]['speed_index']
      result[3]['summary'] = data[0]['total_blocking_time']
      points = read_performance_points(page, start_date, end_date)
      points.each do |point|
        result[0]['values'].push({ 'time' => point['time'], 'value' => point['ttfb'] })
        result[1]['values'].push({ 'time' => point['time'], 'value' => point['largest_contentful_paint'] })
        result[2]['values'].push({ 'time' => point['time'], 'value' => point['speed_index'] })
        result[3]['values'].push({ 'time' => point['time'], 'value' => point['total_blocking_time'] })
      end
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

  def create_assets_array
    [{ 'key' => 'html', 'summary' => 0, 'values' => [] },
     { 'key' => 'css', 'summary' => 0, 'values' => [] },
     { 'key' => 'js', 'summary' => 0, 'values' => [] },
     { 'key' => 'image', 'summary' => 0, 'values' => [] },
     { 'key' => 'font', 'summary' => 0, 'values' => [] },
     { 'key' => 'other', 'summary' => 0, 'values' => [] }]
  end

  def init_assets_summary(assets, data)
    assets[0]['summary'] = data[0]['html']
    assets[1]['summary'] = data[0]['css']
    assets[2]['summary'] = data[0]['js']
    assets[3]['summary'] = data[0]['image']
    assets[4]['summary'] = data[0]['font']
    assets[5]['summary'] = data[0]['other']
  end

  def init_assets_points(assets, points)
    points.each do |point|
      assets[0]['values'].push({ 'time' => point['time'], 'value' => point['html'] })
      assets[1]['values'].push({ 'time' => point['time'], 'value' => point['css'] })
      assets[2]['values'].push({ 'time' => point['time'], 'value' => point['js'] })
      assets[3]['values'].push({ 'time' => point['time'], 'value' => point['image'] })
      assets[4]['values'].push({ 'time' => point['time'], 'value' => point['font'] })
      assets[5]['values'].push({ 'time' => point['time'], 'value' => point['other'] })
    end
  end
end

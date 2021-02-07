class Pages::LighthouseController < ApplicationController
  before_action :authenticate_user!, except: [:show]

  def index
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_page, @page)

    @start_date = Date.parse(params[:start]).beginning_of_day
    @end_date   = Date.parse(params[:end]).end_of_day
    render json: get_lighthouse(@page, @start_date, @end_date)
  end

  def show
    @page = Page.find(params[:page_id])
    metric = LighthouseMetrics.new page_id: @page.id, time_key: params[:id]
    render html: metric.read_report.html_safe
  end

  def get_lighthouse(page, start_date, end_date)
    select_value = 'time_key, pwa, performance, accessibility, best_practices, seo'
    select_value += ', ttfb, largest_contentful_paint, total_blocking_time, speed_index'
    data = LighthouseMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end
end

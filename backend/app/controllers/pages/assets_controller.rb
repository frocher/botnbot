class Pages::AssetsController < ApplicationController
  before_action :authenticate_user!, except: [:show]

  def index
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_page, @page)

    @start_date = Date.parse(params[:start]).beginning_of_day
    @end_date   = Date.parse(params[:end]).end_of_day
    render json: get_assets(@page, @start_date, @end_date)
  end

  def show
    @page = Page.find(params[:page_id])
    metric = AssetsMetrics.new page_id: @page.id, time_key: params[:id]
    render json: metric.read_har.to_s
  end

  def get_assets(page, start_date, end_date)
    select_value = 'time_key, html_requests, js_requests, css_requests, image_requests, font_requests, other_requests'
    select_value += ', html_bytes, js_bytes, css_bytes, image_bytes, font_bytes, other_bytes'
    data = AssetsMetrics.select(select_value).by_page(page.id).where(time: start_date..end_date)
    data.to_a
  end
end

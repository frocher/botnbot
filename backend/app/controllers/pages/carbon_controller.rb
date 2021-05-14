class Pages::CarbonController < ApplicationController
  before_action :authenticate_user!

  def index
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_page, @page)

    @start_date = Date.parse(params[:start]).beginning_of_day
    @end_date   = Date.parse(params[:end]).end_of_day
    render json: get_metrics(@page, @start_date, @end_date)
  end

  def get_metrics(page, start_date, end_date)
    data = CarbonMetrics.by_page_and_date(page, start_date, end_date)
    data.to_a
  end
end

class Pages::BudgetsController < ApplicationController
  before_action :authenticate_user!
  def index
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_budget, @page)

    render json: @page.budgets
  end

  def create
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :create_budget, @page)

    begin
      @budget = Budget.new

      @budget.category = params[:category]
      @budget.item = params[:item]
      @budget.budget = params[:budget]
      @budget.page = @page
      @budget.save!

      render json: @budget
    rescue ActiveRecord::RecordInvalid
      render json: { errors: @budget.errors }, status: 422
    end
  end

  def destroy
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :delete_budget, @page)

    begin
      @budget = Budget.find(params[:id])
      @budget.destroy!
      render json: @budget
    rescue ActiveRecord::RecordInvalid
      render json: { errors: @budget.errors }, status: 422
    end
  end
end

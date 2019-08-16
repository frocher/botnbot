require 'ostruct'

class WeeklyReportJob
  include ActionView::Helpers::NumberHelper

  def call(job, time)
    Rails.logger.info "Starting job #{self.class.name}"
    perform
  end

  def perform
    ActiveRecord::Base.connection_pool.with_connection do
      users = User.all
      users.each do |user|
        process_user(user)
      end
    end
  end

  def process_user(user)
    Rails.logger.info "Processing user : " + user.email

    pages = user.pages.sort_by { |p| p["name"] }
    unless pages.empty?
      @context = OpenStruct.new
      @context.pages = []
      @context.period_start = (Date.today - 7).at_beginning_of_week.beginning_of_day
      @context.period_end = (Date.today - 7).at_end_of_week.end_of_day

      pages.each do |page|
        @context.pages << construct_page(page, @context.period_start, @context.period_end)
      end

      send_mail(user, generate_title(@context.period_start, @context.period_end))
    end
  rescue Exception => e
    Rails.logger.error "Error processing user " + user.email
    Rails.logger.error e.to_s
  end

  def generate_title(start_date, end_date)
    "Botnbot weekly report " + start_date.strftime("%m/%d/%Y") + " to " + end_date.strftime("%m/%d/%Y")
  end

  def send_mail(user, title)
    UserMailer.weekly_summary(user, title, @context).deliver_now
  rescue Exception => e
    Rails.logger.error "Error sending mail to user " + user.email
    Rails.logger.error e.to_s
  end

  def construct_page(page, start_date, end_date)
    Rails.logger.info "Processing page : " + page.name

    stats = OpenStruct.new
    stats.name = page.name

    uptime_summary      = page.uptime_summary(start_date, end_date)
    lighthouse_summary  = page.lighthouse_summary(start_date, end_date)
    requests_summary    = page.requests_summary(start_date, end_date)
    bytes_summary       = page.bytes_summary(start_date, end_date)

    stats.empty = uptime_summary.nil? || lighthouse_summary.nil? || requests_summary.nil? || bytes_summary.nil?

    unless stats.empty
      stats.pwa             = extract_value(lighthouse_summary, "pwa", 0)
      stats.accessibility   = extract_value(lighthouse_summary, "accessibility", 0)
      stats.performance     = extract_value(lighthouse_summary, "performance", 0)
      stats.best_practices  = extract_value(lighthouse_summary, "best_practices", 0)
      stats.seo             = extract_value(lighthouse_summary, "seo", 0)
      stats.uptime          = extract_value(uptime_summary, "value", 0, :*, 100)
      stats.speed_index     = extract_value(lighthouse_summary, "speed_index", 0)
      stats.assets_count    = sum_assets(requests_summary)
      stats.assets_size     = sum_assets(bytes_summary) / 1024

      construct_previous(page, stats, start_date, end_date)
    end

    stats
  end

  def construct_previous(page, stats, start_date, end_date)
    previous_start = start_date - 1.week.to_i
    previous_end = end_date - 1.week.to_i

    previous_lighthouse = page.lighthouse_summary(previous_start, previous_end)

    stats.last_pwa = extract_value(previous_lighthouse, "pwa", 0)
    stats.pwa_delta = compute_delta(stats.pwa, stats.last_pwa)

    stats.last_accessibility = extract_value(previous_lighthouse, "accessibility", 0)
    stats.accessibility_delta = compute_delta(stats.accessibility, stats.last_accessibility)

    stats.last_performance = extract_value(previous_lighthouse, "performance", 0)
    stats.performance_delta = compute_delta(stats.performance, stats.last_performance)

    stats.last_best_practices = extract_value(previous_lighthouse, "best_practices", 0)
    stats.best_practices_delta = compute_delta(stats.best_practices, stats.last_best_practices)

    stats.last_seo = extract_value(previous_lighthouse, "seo", 0)
    stats.seo_delta = compute_delta(stats.seo, stats.last_seo)

    stats.last_speed_index = extract_value(previous_lighthouse, "speed_index", 0)
    stats.speed_index_delta = compute_delta(stats.speed_index, stats.last_speed_index)

    previous_uptime = page.uptime_summary(previous_start, previous_end)
    stats.last_uptime = extract_value(previous_uptime, "value", 0, :*, 100)
    stats.uptime_delta = stats.uptime - stats.last_uptime

    previous_req = page.requests_summary(previous_start, previous_end)
    stats.last_assets_count = sum_assets(previous_req)
    stats.assets_count_delta = compute_delta(stats.assets_count, stats.last_assets_count)

    previous_bytes = page.bytes_summary(previous_start, previous_end)
    stats.last_assets_size = sum_assets(previous_bytes) / 1024
    stats.assets_size_delta = compute_delta(stats.assets_size, stats.last_assets_size)
  end

  def sum_assets(assets)
    extract_value(assets, "html", 0) + extract_value(assets, "js", 0) + extract_value(assets, "css", 0) + extract_value(assets, "image", 0) + extract_value(assets, "font", 0) + extract_value(assets, "other", 0)
  end

  def compute_delta(new_value, last_value)
    last_value != 0 ? (new_value - last_value) * 100 / last_value : 0
  end

  def extract_value(array, column, default, operator = nil, operand = nil)
    if array.nil? || array[column].nil?
      default
    else
      if operator.nil?
        array[column].round(1)
      else
        array[column].send(operator, operand).round(1)
      end
    end
  end
end

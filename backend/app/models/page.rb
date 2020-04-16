require 'chronic_duration'
# == Schema Information
#
# Table name: pages
#
#  id                      :bigint(8)        not null, primary key
#  name                    :string(255)
#  url                     :string(255)
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  screenshot_file_name    :string(255)
#  screenshot_content_type :string(255)
#  screenshot_file_size    :integer
#  screenshot_updated_at   :datetime
#  uptime_keyword          :string(255)
#  uptime_keyword_type     :string(255)
#  slack_webhook           :string(255)
#  slack_channel           :string(255)
#  mail_notify             :boolean          default(TRUE)
#  slack_notify            :boolean          default(FALSE)
#  uptime_status           :integer          default(0)
#  push_notify             :boolean          default(TRUE)
#  device                  :integer          default("mobile")
#

class Page < ActiveRecord::Base
  after_create :init_jobs

  has_attached_file :screenshot,
    path: ":rails_root/reports/screenshots/:id/:style/:filename",
    default_url: "/images/:style/missing.png",
    styles: { thumb: ["", :jpg] },
    convert_options: {
      thumb: '-resize "360x" +repage -crop "360x270+0+0" -gravity North -quality 80 -interlace Plane'
    }

  has_many :budgets, dependent: :destroy
  has_many :page_members, dependent: :destroy

  enum device: [ :mobile, :desktop ]

  #
  # Validations
  #
  validates :name, presence: true
  validates :url, url: true
  do_not_validate_attachment_file_type :screenshot
  validates :slack_webhook, url: true, if: Proc.new { |a| a.slack_notify? }
  validates :slack_channel, presence: true, if: Proc.new { |a| a.slack_notify? }

  def as_json(options={})
    super({only: [:id, :name, :url, :device, :locked, :uptime_keyword, :uptime_keyword_type, :mail_notify, :slack_notify, :push_notify, :slack_webhook, :slack_channel, :uptime_status, :created_at, :updated_at]}.merge(options || {}))
  end

  def owner
    User.joins("INNER JOIN page_members ON page_members.user_id = users.id WHERE page_members.page_id = #{id} AND page_members.role = 3 ORDER BY page_members.created_at").take
  end

  def last_downtime_duration
    result = UptimeMetrics.select("value").by_page(id)
    records = result.load
    return 0 if records.empty?

    found_down = nil
    found_up = nil
    last_down = 0
    last_up = 0
    records.reverse_each do |record|
      if record["value"] == 1
        last_up = DateTime.parse(record["time"]).to_time

        # If we have a up and we previously found a down, we can now compute the duration
        unless found_down.nil?
          # Never had a up, so the page is currently down. We use time now for compute
          if found_up.nil?
            found_up = Time.now
          end
          interval = found_up.round(0) - last_down.round(0)
          return ChronicDuration.output(interval, :format => :long)
        end
      else
        last_down = DateTime.parse(record["time"]).to_time
        if found_down.nil?
          found_up = last_up
          found_down = last_down
        end
      end
    end
  end

  def lighthouse_summary(start_date, end_date)
    select_value = "mean(pwa) as pwa," \
                   "mean(performance) as performance," \
                   "mean(accessibility) as accessibility," \
                   "mean(best_practices) as best_practices," \
                   "mean(seo) as seo," \
                   "mean(ttfb) as ttfb," \
                   "mean(first_meaningful_paint) as first_meaningful_paint," \
                   "mean(first_interactive) as first_interactive," \
                   "mean(speed_index) as speed_index"
    data = LighthouseMetrics.select(select_value).by_page(id).where(time: start_date..end_date)
    convert_influx_result(data)
  end

  def uptime_summary(start_date, end_date)
    data = UptimeMetrics.select("mean(value) as value").by_page(id).where(time: start_date..end_date)
    convert_influx_result(data)
  end

  def requests_summary(start_date, end_date)
    select_value = "mean(html_requests) as html," \
                   "mean(js_requests) as js," \
                   "mean(css_requests) as css," \
                   "mean(image_requests) as image," \
                   "mean(font_requests) as font," \
                   "mean(other_requests) as other"
    data = AssetsMetrics.select(select_value).by_page(id).where(time: start_date..end_date)
    convert_influx_result(data)
  end

  def bytes_summary(start_date, end_date)
    select_value = "mean(html_bytes) as html," \
                   "mean(js_bytes) as js," \
                   "mean(css_bytes) as css," \
                   "mean(image_bytes) as image," \
                   "mean(font_bytes) as font," \
                   "mean(other_bytes) as other"
    data = AssetsMetrics.select(select_value).by_page(id).where(time: start_date..end_date)
    convert_influx_result(data)
  end

  def init_jobs
    scheduler = Rufus::Scheduler.singleton
    max_start = Rails.configuration.x.jobs.screenshot_start
    scheduler.every(Rails.configuration.x.jobs.screenshot_interval, ScreenshotJob.new, {:page_id => id, :mutex => "screenshot", :first_in => "#{rand(1..max_start)}m"})

    max_start = Rails.configuration.x.jobs.uptime_start
    UptimeJob.schedule_next("#{rand(1..max_start)}m", UptimeJob.new, id, false)
    max_start = Rails.configuration.x.jobs.har_start
    HarJob.schedule_next("#{rand(1..max_start)}m", HarJob.new, id)
    max_start = Rails.configuration.x.jobs.lighthouse_start
    LighthouseJob.schedule_next("#{rand(1..max_start)}m", LighthouseJob.new, id)
  end

  private

  def convert_influx_result(records)
    array = records.to_a
    array.empty? ? nil : array[0]
  end
end

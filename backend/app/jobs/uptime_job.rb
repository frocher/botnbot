class UptimeJob < StatisticsJob

  def self.schedule_next(delay, handler, page_id, second_chance)
    probes = Rails.application.config.probes
    probe = probes.sample
    mutex_name = "uptime_#{probe['name']}"

    scheduler = Rufus::Scheduler.singleton
    scheduler.in(delay, handler, {:page_id => page_id, :is_second_chance => second_chance, :probe => probe, :mutex => mutex_name})
  end

  def call(job, time)
    page_id = job.opts[:page_id]
    probe = job.opts[:probe]
    Rails.logger.info "Starting job #{self.class.name} for page #{page_id} on probe #{probe['name']}"
    second_chance = perform(page_id, job.opts[:is_second_chance] || false, probe)
    delay = second_chance ? Rails.configuration.x.jobs.second_chanche_interval : page_delay(page_id)
    UptimeJob.schedule_next(delay, job.handler, page_id, second_chance)
  end

  def perform(page_id, is_second_chance, probe)
    second_chance = false

    ActiveRecord::Base.connection_pool.with_connection do
      if Page.exists?(page_id)
        page = Page.find(page_id)

        if page.locked
          Rails.logger.info "Uptime job not done because #{page.url} is locked"
          return false
        end

        begin
          res = launch_probe(probe, page)
          result = JSON.parse(res.body)
          last = page.uptime_status
          if res.code == "200" && result["status"] == "success"
            write_metrics(probe["name"], page, 1, res.code, nil, nil)
            page.uptime_status = 1
            page.save!
            send_up_notification(page) if last == 0
            Rails.logger.info "Success uptime for #{page_id} : #{page.url}"
          else
            error_content = result["content"] || "empty"
            if is_second_chance
              write_metrics(probe["name"], page, 0, res.code, result["errorMessage"], error_content)
              page.uptime_status = 0
              page.save!
              send_down_notification(page, result["errorMessage"]) if last == 1
            else
              second_chance = true
            end
            Rails.logger.error "Error #{res.code} for url #{page.url}, second chance is #{is_second_chance}"
          end
        rescue Exception => e
          Rails.logger.error "Bot error for #{page.url}"
          Rails.logger.error e.to_s
        end
      end
    end
    second_chance
  end

  def launch_probe(probe, page)
    url = "http://#{probe['host']}:#{probe['port']}/uptime?url=#{page.url}&token=#{probe['token']}"
    if !page.uptime_keyword.nil? && page.uptime_keyword != ""
      type = page.uptime_keyword_type
      type = "presence" if type != "presence" && type != "absence"
      keyword = CGI::escape(page.uptime_keyword)
      url += "&keyword=#{keyword}&type=#{type}"
    end
    uri = URI.parse(url)
    Net::HTTP::get_response(uri)
  end

  private

  def page_delay(page_id)
    delay = Rails.configuration.x.jobs.uptime_interval

    ActiveRecord::Base.connection_pool.with_connection do
      unless ENV["STRIPE_PUBLIC_KEY"].blank?
        if Page.exists?(page_id)
          page = Page.find(page_id)
          subscription = page.owner.stripe_subscription
          delay = "#{subscription['uptime']}m"
        end
      end
    end

    delay
  end

  def write_metrics(probe, page, status, code, message, content)
    metric = UptimeMetrics.new page_id: page.id, probe: probe["name"]
    if !content.nil? && content.length < 300000
      metric.time_key = generate_time_key
      metric.write_content(content)
    end
    metric.value = status
    metric.error_code = code if !code.nil?
    metric.error_message = message if !message.nil?
    metric.write!
  end

  def send_up_notification(page)
    duration = page.last_downtime_duration
    if page.mail_notify
      send_up_mail(page, duration)
    end
    if page.push_notify
      send_push_message(page, "The page #{page.url} is up again after a downtime of #{duration}.")
    end
    if page.slack_notify
      send_slack_message(page, "The page #{page.url} is up again after a downtime of #{duration}.")
    end
  end

  def send_down_notification(page, error_message)
    if page.mail_notify
      send_down_mail(page, error_message)
    end
    if page.push_notify
      send_push_message(page, "The page #{page.url} is down : #{error_message}")
    end
    if page.slack_notify
      send_slack_message(page, "The page #{page.url} is down : #{error_message}")
    end
  end

  def send_down_mail(page, error_message)
    page.page_members.each do |member|
      user = member.user
      UserMailer.down(user, page, error_message).deliver_now
    end
  rescue Exception => e
    Rails.logger.error e.to_s
    e.backtrace.each { |line| Rails.logger.error line }
  end

  def send_up_mail(page, duration)
    page.page_members.each do |member|
      user = member.user
      UserMailer.up(user, page, duration).deliver_now
    end
  rescue Exception => e
    Rails.logger.error e.to_s
    e.backtrace.each { |line| Rails.logger.error line }
  end

  def send_push_message(page, message)
    page.page_members.each do |member|
      user = member.user
      user.subscriptions.each { |subscription| send_webpush(subscription, page.url, message) }
    end
  rescue Exception => e
    Rails.logger.error e.to_s
  end

  def send_webpush(subscription, url, text)
    message = {
      title: "Message Received from Botnbot",
      options: {
        body: text,
        data: { url: url }
      }
    }

    Webpush.payload_send(
      message: JSON.generate(message),
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
      vapid: {
        subject: ENV["PUSH_SUBJECT"],
        public_key: ENV["PUSH_PUBLIC_KEY"],
        private_key: ENV["PUSH_PRIVATE_KEY"]
      }
    )
  rescue Webpush::InvalidSubscription => e
    subscription.destroy
    Rails.logger.error e.to_s
  rescue Exception => e
    Rails.logger.error e.to_s
  end

  def send_slack_message(page, message)
    unless page.slack_webhook.nil? || page.slack_webhook.blank?
      notifier = Slack::Notifier.new page.slack_webhook, channel: page.slack_channel, username: "jeeves.thebot"
      notifier.ping message
    end
  rescue Exception => e
    Rails.logger.error e.to_s
  end
end

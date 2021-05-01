class LockJob
  def call(_job, _time)
    Rails.logger.info "Starting job #{self.class.name}"
    perform
  end

  def perform
    ActiveRecord::Base.connection_pool.with_connection do
      users = User.all
      users.each { |user| process_user(user) }
    end
  end

  def process_user(user)
    Rails.logger.info "Processing user : #{user.email}"
    user.lock_pages
  rescue StandardError => e
    Rails.logger.error "Error processing user #{user.email}"
    Rails.logger.error e.to_s
  end
end

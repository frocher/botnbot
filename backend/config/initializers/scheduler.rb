require 'rufus-scheduler'

# Let's use the rufus-scheduler singleton
#
scheduler = Rufus::Scheduler.singleton

def scheduler.on_error(job, error)
  Rails.logger.error(
    "err#{error.object_id} rufus-scheduler intercepted #{error.inspect}" +
    " in job #{job.inspect}")
  error.backtrace.each_with_index do |line, i|
    Rails.logger.error(
      "err#{error.object_id} #{i}: #{line}")
  end
end

# Run weekly report every monday at 1am
scheduler.cron('0 1 * * 1', WeeklyReportJob.new)

# Run daily budget report every day at 3am
scheduler.cron('0 3 * * *', BudgetJob.new)

# Run daily page lock every day at 2am
scheduler.cron('0 2 * * *', LockJob.new)

# Create jobs
if ActiveRecord::Base.connection.table_exists? 'pages'
  Page.all.each do |page|
    page.init_jobs
  end
end

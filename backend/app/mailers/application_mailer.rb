class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_SENDER") { "jeeves.thebot@botnbot.com" }
  layout 'mailer'
end

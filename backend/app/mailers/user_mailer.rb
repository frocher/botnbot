class UserMailer < ApplicationMailer
  def up(user, page, duration)
    @page = page
    @duration = duration
    mail(to: user.email, subject: "The page #{page.url} is up")
  end

  def down(user, page, error_message)
    @page = page
    @error_message = error_message
    mail(to: user.email, subject: "The page #{page.url} is down")
  end

  def weekly_summary(user, title, context)
    @context = context
    mail(to: user.email, subject: title)
  end

  def budget(user, title, context)
    @context = context
    mail(to: user.email, subject: title)
  end

  def account_deleted(user, title)
    mail(to: user.email, subject: title)
  end
end

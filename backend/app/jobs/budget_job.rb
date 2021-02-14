class BudgetJob

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
    pages = user.pages.sort_by { |p| p['name'] }
    unless pages.empty?
      @context = OpenStruct.new
      @context.budgets = []
      pages.each { |page| @context.budgets += construct_page(page) }
      send_mail(user, generate_title) unless @context.budgets.empty?
    end
  rescue Exception => e
    Rails.logger.error "Error processing user #{user.email}"
    Rails.logger.error e.to_s
  end

  def construct_page(page)
    Rails.logger.info "Processing page : #{page.name}"

    yesterday_start = (Date.today - 1).beginning_of_day
    yesterday_end = (Date.today - 1).end_of_day
    day_before_start = (Date.today - 2).beginning_of_day
    day_before_end = (Date.today - 2).end_of_day

    budgets = []
    page.budgets.each do |budget|
      case budget.category
      when 0
        value = check_lighthouse_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
      when 1
        value = check_performance_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
      when 2
        value = check_requests_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
      when 3
        value = check_bytes_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
      end
      budgets.push(value) unless value.nil?
    end
    budgets
  end

  def check_lighthouse_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
    yesterday_summary = page.lighthouse_summary(yesterday_start, yesterday_end)
    day_before_summary = page.lighthouse_summary(day_before_start, day_before_end)
    items = ['pwa', 'performance', 'accessibility', 'best_practices', 'seo']
    labels = ['PWA', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Average']

    if budget.item < items.count
      yesterday_value = extract_value(yesterday_summary, items[budget.item])
      day_before_value = extract_value(day_before_summary, items[budget.item])
    else
      yesterday_value = extract_average(yesterday_summary, items)
      day_before_value = extract_average(day_before_summary, items)
    end

    resu = nil
    if !yesterday_value.nil? && !day_before_value.nil?
      if yesterday_value < budget.budget && day_before_value > budget.budget
        resu = create_budget_result(page, "Lighthouse/#{labels[budget.item]}", 'bad', budget.budget, yesterday_value, day_before_value)
      elsif yesterday_value > budget.budget && day_before_value < budget.budget
        resu = create_budget_result(page, "Lighthouse/#{labels[budget.item]}", 'good', budget.budget, yesterday_value, day_before_value)
      end
    end
    resu
  end

  def check_performance_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
    yesterday_summary = page.lighthouse_summary(yesterday_start, yesterday_end)
    day_before_summary = page.lighthouse_summary(day_before_start, day_before_end)
    items = ['ttfb', 'first_meaningful_paint', 'speed_index', 'first_interactive']
    labels = ['First byte', 'First paint', 'Speed index', 'Interactive']

    yesterday_value = extract_value(yesterday_summary, items[budget.item])
    day_before_value = extract_value(day_before_summary, items[budget.item])

    resu = nil
    if !yesterday_value.nil? && !day_before_value.nil?
      if yesterday_value > budget.budget && day_before_value < budget.budget
        resu = create_budget_result(page, "Performance/#{labels[budget.item]}", 'bad', budget.budget, yesterday_value, day_before_value)
      elsif yesterday_value < budget.budget && day_before_value > budget.budget
        resu = create_budget_result(page, "Performance/#{labels[budget.item]}", 'good', budget.budget, yesterday_value, day_before_value)
      end
    end
    resu
  end

  def check_requests_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
    yesterday_summary = page.requests_summary(yesterday_start, yesterday_end)
    day_before_summary = page.requests_summary(day_before_start, day_before_end)
    items = ['html', 'css', 'js', 'image', 'font', 'other']
    labels = ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total']

    if budget.item < items.count
      yesterday_value = extract_value(yesterday_summary, items[budget.item])
      day_before_value = extract_value(day_before_summary, items[budget.item])
    else
      yesterday_value = extract_total(yesterday_summary, items)
      day_before_value = extract_total(day_before_summary, items)
    end

    resu = nil
    if !yesterday_value.nil? && !day_before_value.nil?
      if yesterday_value > budget.budget && day_before_value < budget.budget
        resu = create_budget_result(page, "Assets count/#{labels[budget.item]}", 'bad', budget.budget, yesterday_value, day_before_value)
      elsif yesterday_value < budget.budget && day_before_value > budget.budget
        resu = create_budget_result(page, "Assets count/#{labels[budget.item]}", 'good', budget.budget, yesterday_value, day_before_value)
      end
    end
    resu
  end

  def check_bytes_budget(page, budget, yesterday_start, yesterday_end, day_before_start, day_before_end)
    yesterday_summary = page.bytes_summary(yesterday_start, yesterday_end)
    day_before_summary = page.bytes_summary(day_before_start, day_before_end)
    items = ['html', 'css', 'js', 'image', 'font', 'other']
    labels = ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total']

    if budget.item < items.count
      yesterday_value = extract_value(yesterday_summary, items[budget.item])
      day_before_value = extract_value(day_before_summary, items[budget.item])
    else
      yesterday_value = extract_total(yesterday_summary, items)
      day_before_value = extract_total(day_before_summary, items)
    end

    resu = nil
    if !yesterday_value.nil? && !day_before_value.nil?
      yesterday_value /= 1024
      day_before_value /= 1024

      if yesterday_value > budget.budget && day_before_value < budget.budget
        resu = create_budget_result(page, "Assets size/#{labels[budget.item]}", 'bad', budget.budget, yesterday_value, day_before_value)
      elsif yesterday_value < budget.budget && day_before_value > budget.budget
        resu = create_budget_result(page, "Assets size/#{labels[budget.item]}", 'good', budget.budget, yesterday_value, day_before_value)
      end
    end
    resu
  end

  def create_budget_result(page, label, news, budget, yesterday_value, day_before_value)
    resu = OpenStruct.new
    resu.news = news
    resu.label = label
    resu.page = page.name
    resu.budget = budget
    resu.value = yesterday_value.round
    resu.before_value = day_before_value.round
    resu.delta = compute_delta(yesterday_value, day_before_value).round(1)
    resu
  end

  def generate_title
    "Botnbot budget report for #{Date.today.strftime('%m/%d/%Y')}"
  end

  def send_mail(user, title)
    UserMailer.budget(user, title, @context).deliver_now
  rescue Exception => e
    Rails.logger.error "Error sending mail to user #{user.email}" 
    Rails.logger.error e.to_s
  end

  def compute_delta(new_value, last_value)
    last_value != 0 ? (new_value - last_value) * 100 / last_value : 0
  end

  def extract_total(array, columns)
    if array.nil?
      nil
    else
      total = 0
      columns.each { |x| total += array[x] }
      total
    end
  end

  def extract_average(array, columns)
    total = extract_total(array, columns)
    if total.nil?
      nil
    else
      total / columns.count
    end
  end

  def extract_value(array, column, default = nil, operator = nil, operand = nil)
    if array.nil? || array[column].nil?
      default
    else
      if operator.nil?
        array[column]
      else
        array[column].send(operator, operand)
      end
    end
  end
end

# Base class for all statistics jobs
class StatisticsJob
  def generate_time_key
    Time.now.strftime('%Y%m%d%H%M%S')
  end

  def send_request(uri)
    request = Net::HTTP::Get.new(uri.request_uri)
    response = Net::HTTP.start(uri.host, uri.port) do |http|
      http.read_timeout = 120
      http.request(request)
    end
    response
  end
end


require 'sinatra.rb'

pipe = IO.popen("nohup ../ajax-cat-server/ajax-cat-server >> log 2>&1 &", "r")

get '/' do
  redirect '/index.html'
end
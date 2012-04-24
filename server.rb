

require 'sinatra.rb'

pipe = IO.popen("nohup ../ajax-cat-server/ajax-cat-server", "r")

get '/' do
  redirect '/index.html'
end


require 'sinatra.rb'

system("../ajax-cat-server/ajax-cat-server > ac_log")

get '/' do
  redirect '/index.html'
end
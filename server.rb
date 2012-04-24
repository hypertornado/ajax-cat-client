

require 'sinatra.rb'

pipe = IO.popen("../ajax-cat-server/ajax-cat-server", "r")

get '/' do
  redirect '/index.html'
end
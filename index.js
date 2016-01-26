var Proxy = require('./proxy')

var proxy = new Proxy({
  destination: 'https://google.com',
  timeoutPercentage: 50,
  lagMs: 3000
})

proxy.start()

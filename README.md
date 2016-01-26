# jank

> Proxy RESTful API calls through a janky HTTP server

Make sure your app is battle-tested against the poorest server performance. Just stand this up in front of your working RESTful API, point your app to the proxy, and let the stuttering performance begin!


## TODO

1. Scripts setup for dev environment
1. Tests & CI
1. CLI
1. Documentation
1. HTTPs support for the proxy, currently only handles HTTP incoming
1. More configurations for server jankiness
    - Error codes 500, 503, 504, etc...
		- Configure only on certain endpoints?

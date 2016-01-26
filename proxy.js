var proxy = require('express-http-proxy')
var express = require('express')
var request = require('request')
var url = require('url')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // accepts all SSL certs

module.exports = function(opts) {
	opts = opts || {}
	var proxyDestination = opts.destination || 'https://npmjs.com'
	var proxyHost = proxyDestination.replace(/.*?:\/\//g, "")
	var listeningPort = opts.listeningPort || 8080
	var timeoutPercentage = opts.timeoutPercentage || 0
	var lagMs = opts.lagMs || 0
	var app = express()

	app.get('*', handleIncomingReq)
	app.post('*', handleIncomingReq)
	app.put('*', handleIncomingReq)
	app.delete('*', handleIncomingReq)
	// TODO: more verbs? or rather app.use?

	function handleIncomingReq(req, res) {
		var shouldTimeout = Math.floor(Math.random() * 99) < timeoutPercentage;
		if(shouldTimeout) {
			timeoutRequest(req, res)
		} else if(lagMs) {
			lagRequest(req, res)
		} else {
			actualRequest(req, res)
		}
	}

	function timeoutRequest(req, res) {
		console.log('Timing out request');
		res.setTimeout(120000, function(){
			res.send(408);
		});
	}

	function lagRequest(req, res) {
		console.log('Lagging request by ' + lagMs + ' ms')
		res.setTimeout(lagMs, function() {
			actualRequest(req, res)
		})
	}

	function actualRequest(req, res) {
		var options = {}
		options.url = proxyDestination + req.originalUrl
		options.headers = req.headers
		options.headers.host = proxyHost
		options.headers['accept-encoding'] = undefined

		console.log('Proxying to ' + options.url)
		request.get(options, function (error, response, body) {
			if(error) console.error(error)
			console.log('Response body: ' + body.toString('utf8'))
			res.send(body)
		})
	}

	this.start = function(callback) {
		app.listen(listeningPort, function() {
			console.log('Server started on port ' + listeningPort)
			if(callback) callback()
		})
	}
}

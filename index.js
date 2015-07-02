#! /usr/bin/env node

'use strict'

var Hapi = require('hapi')
var xtend = require('xtend')
var minimist = require('minimist')
var auth = require('@piemme/authentication-service')()

var defaults = {
  port: 8989
}

function authService (opts) {
  opts = xtend(defaults, opts)

  var server = new Hapi.Server()

  server.connection({ port: opts.port })

  function putUser (request, reply) {
    console.log(request.payload); 
    var user = request.payload;
    auth.put(user, function(err,userChecked){
      if (err) return reply (err);
      reply(userChecked);
    })

  }

  // server.route({ method: 'GET', path: '/user', handler: getUser })
  server.route({ method: 'PUT', path: '/user', handler: putUser })
  // server.route({ method: 'PUT', path: '/user', handler: hello })

  return server
}

function start (opts) {
  var server = authService(opts)
  server.start(function (err) {
    if (err) { throw err }
    server.connections.forEach(function (conn) {
      console.log('server started on port', conn.settings.port)
    })
  })
}

module.exports = authService

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    integer: 'port',
    alias: {
      'port': 'p'
    }
  }))
}

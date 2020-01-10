'use strict'
const express = require('express');
const fs = require('fs');
const https = require('https');
const auth = require('./auth');


function init({ config, userModel }){
  const app = express();

  const params = {
    app,
    config,
    loginRoute: '/login',
    logoutRoute: '/logout',
    refreshRoute: '/refresh',
    expiryCheckRoute: '/expiry-check',
    postLoginRedirect: '/cats',
    postLogoutRedirect: '/',
    userModel
  }

  const authoriser = auth.init(params);

  const routes = require('./routes').init({ authoriser });
  app.use('/', routes);

  return {
    run(){
      const params = { app, config };
      config.HTTPS ? runHttps(params) : runHttp(params);
    }
  }
}

function runHttp({ app, config }){
  app.listen(config.PORT, () => {
    console.log(`http server starting on port : ${config.PORT}`)
  });
}

function runHttps({ app, config }){
  const key = fs.readFileSync('./selfsigned.key');
  const cert = fs.readFileSync('./selfsigned.crt');
  const options = {
    key,
    cert
  }
  const server = https.createServer(options, app);

  server.listen(3000, () => {
    console.log(`https server starting on port : ${config.PORT}`)
  });
}

module.exports = { init };
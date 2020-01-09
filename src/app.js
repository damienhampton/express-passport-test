'use strict'
const express = require('express');
const auth = require('./auth');

function init({ config, userModel }){
  const app = express();

  const params = {
    app,
    config,
    loginRoute: '/login',
    logoutRoute: '/logout',
    postLoginRedirect: '/cats',
    postLogoutRedirect: '/',
    userModel
  }

  const authoriser = auth.init(params);

  const routes = require('./routes').init({ authoriser });
  app.use('/', routes);

  return {
    run(){
      app.listen(3000);
    }
  }
}

module.exports = { init };
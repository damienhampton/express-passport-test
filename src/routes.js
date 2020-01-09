'use strict'
const express = require('express')
const permissions = require('./permissions');

function init({ authoriser }){
  const router = express.Router();

  router.get('/', (_, res) => {
    res.send('<h1>public</h1>');
  });

  router.get('/cats', authoriser(permissions.ALLOW_ALL_CATS), (_, res) => {
    res.send('<h1>cats</h1>');
  });

  router.get('/food', authoriser(permissions.ALLOW_FOOD), (_, res) => {
    res.send('<h1>food</h1>');
  });

  router.get('/treats', authoriser(permissions.ALLOW_TREATS), (_, res) => {
    res.send('<h1>treats</h1>');
  });

  return router
}

module.exports = { init };

'use strict'

const { ALLOW_FOOD, ALLOW_TREATS, ALLOW_ALL_CATS } = require('./permissions');

const roles = {
  GOOD_CAT: {
    permissions: [ ALLOW_FOOD, ALLOW_TREATS, ALLOW_ALL_CATS ]
  },
  BAD_CAT: {
    permissions: [ ALLOW_FOOD, ALLOW_ALL_CATS ]
  }
}

const createUser = (username, password, { permissions }) => ({ username, password, permissions });
const findUser = (username) => users.find(u => u.username === username);
const validatePassword = (user, password) => user.password === password;

const users = [
  createUser('buffy', 'pwd1', roles.BAD_CAT),
  createUser('daisy', 'pwd2', roles.GOOD_CAT)
];

module.exports = {
  validatePassword,
  findUser
}
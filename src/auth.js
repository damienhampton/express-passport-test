'use strict'
const passport = require('passport');
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');

function init({ app, config, loginRoute, logoutRoute, postLoginRedirect, postLogoutRedirect, userModel }){

  function AuthoriseRequest(jwt_payload, done) {
    const username = extractUsernameFromJWT(jwt_payload);
    const user = userModel.findUser(username);
    if(!user){
      return done(null, false);
    }
    return done(null, user);
  }

  function AuthenticateUser(username, password, done) {
    const user = userModel.findUser(username);
    if(!user){
      const message = { message: 'Incorrect username.' };
      return done(null, false, message);
    }
    if (!userModel.validatePassword(user, password)) {
      const message = { message: 'Incorrect password.' };
      return done(null, false, message);
    }
    return done(null, user);
  }

  const checkPermissions = requiredPermissions => (req, _, next) => {
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [ requiredPermissions ];
    if(!req || !req.user || !req.user.permissions){
      next('Not allowed');
    }

    const allowed = permissions.reduce((allowed, permission) => {
      return allowed && req.user.permissions.find(p => p === permission);
    }, true);

    if(!allowed){
      next('Not allowed');
    }

    next();
  }

  function createJWT(username){
    const data =  {
      username
    }
    return jwt.sign({ data, }, config.JWT_SIGNATURE, { expiresIn: config.TOKEN_EXPIRY });
  }

  function extractUsernameFromJWT(jwToken){
    return jwToken.data.username;
  }

  const cookieExtractor = req => {
    if(!req || !req.cookies){
      return null;
    }
    return req.cookies['token'];
  }

  var opts = {}
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = config.JWT_SIGNATURE;

  passport.use(new JwtStrategy(opts, AuthoriseRequest));
  passport.use(new LocalStrategy(AuthenticateUser));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.use(cookieParser());
  app.use(passport.initialize());

  app.get(loginRoute, passport.authenticate('local'), (req, res) => {
    const jwt = createJWT(req.user.username);

    res.cookie('token', jwt, {
      expires: new Date(Date.now() + 10000000),
      secure: false,
      httpOnly: true,
    });
    res.redirect(postLoginRedirect)
  });

  app.get(logoutRoute, (req, res) => {
    res.cookie('token', null, {
      expires: new Date(Date.now() + 10000000),
      secure: false,
      httpOnly: true,
    });
    res.redirect(postLogoutRedirect)
  });

  return requiredPermissions => [ passport.authenticate('jwt', { session: false }) , checkPermissions(requiredPermissions)]
}

module.exports = { init };
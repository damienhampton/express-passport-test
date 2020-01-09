# Passport test

## Install and run

```
npm i
node server.js
```

## Try it out

```http://localhost:3000/```

Login with Buffy:

```http://localhost:3000/login?username=buffy&password=pwd1```

Login with Daisy:

```http://localhost:3000/login?username=daisy&password=pwd2```

Cats have roles (Buffy: good cat, Daisy: bad cat)

Then try:

```http://localhost:3000/food```
```http://localhost:3000/treats```

Buffy (bad cat) is allowed food, but only Daisy is allowed treats.

## JWT

App returns signed JWT to client on login containing user details.

On each request, user details are extracted from request, user object is then loaded and used in authorisation of requests.
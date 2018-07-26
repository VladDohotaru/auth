'use strict';

const config = require('../config.js');
const cookieParser = require('cookie-parser');
const jwt            = require('./jwt.util.js');
const express        = require('express');
const bodyParser     = require('body-parser');
const cors           = require('cors');
const PROVIDER    = require('./facebook.util.js');

function findCors() {
  const domain = config.get('SERVER.CORS_DOMAINS');
  if (domain == null || domain == undefined) {
    return "*";
  }
  else {
    if (domain.startsWith("http")) {
      return domain;
    }
    else {
      return new RegExp(domain);
    }
  }
}


const app            = express();
const CORS_DOMAINS = findCors();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors({
  origin: CORS_DOMAINS
}));
app.use(cookieParser());


app.post("/auth", async (req, res) => {
  try {
    const profile = await PROVIDER.requestProfile(req);
    res.json({
      accessToken: jwt.createToken(profile.socialProfile),
      socialToken: profile.socialToken
    });
  } catch (e) {
    res.status(401).json({error: e});
  }
});

app.get("/secure", (req, res) => {
  const jwtString = req.query.jwt;
  try {
    const profile = jwt.verify(jwtString);
    res.cookie('access_token', jwtString);
    res.json({success: true});
  } catch (err) {
    res.status(401).json({error: "wrong_token"});
  }
});

app.get("/health", (req, res) => {
  res.json({status: "ok"});
});

app.listen(config.get('SERVER.PORT'), () => {
  console.log(`Authentication server running on port ${config.get('SERVER.PORT')}.`);
  console.log(`Provider registered.`);
});

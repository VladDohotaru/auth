'use strict';

const config = require('../config.js');
const {
  dummyChain: transform,
} = require('../lib');
const { getRequestInstance } = require('../lib');
const myRequest = getRequestInstance();


async function findProfile(socialToken) {
  const findProfileRequest = await transform(myRequest.getDefaultRequestObject({
    url: `${config.get('FACEBOOK.FACEBOOK_API')}/${config.get('FACEBOOK.FACEBOOK_VERSION')}/me`,
    qs: {
      access_token: socialToken,
      fields: config.get('FACEBOOK.FACEBOOK_FIELDS'),
    },
  }));
  const fullResponse = await myRequest.makeRequest(findProfileRequest);
  if(fullResponse.statusCode === 200) {
    return {
      socialProfile: {
        facebookId: fullResponse.body.id,
        name:       fullResponse.body.name,
      },
      socialToken: socialToken,
    }
  }
  return {
    fullResponse,
  };
}

// (async () => {
//   const getCookie = await transform(myRequest.getDefaultRequestObject({
//     url: 'http://localhost:3000/secure?jwt=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmYWNlYm9va0lkIjoiODU3NTAxNTk0NDU4ODk2IiwibmFtZSI6IlZsYWQgRG9ob3RhcnUiLCJpYXQiOjE1MzI1ODgyMTcsImV4cCI6MTUzMjU5MTgxNywiaXNzIjoibG9jYWxob3N0In0.cQ5vUJXBB4TfQkB4FkQPFJ9MYm6nvp75wjPzgRmBHHj3nFct5qtctmOnCMZcX5otPO63OujPyIg3XKBxQDzpMA',
//   }));
//   const fullResponse = await myRequest.makeRequest(getCookie);
//   console.log(fullResponse)
// })();


function parseAccessToken(facebookResponse) {
  return facebookResponse.access_token;
}

async function requestLongLivedToken(shortLivedToken) {
  const longLivedTokenRequest = await transform(myRequest.getDefaultRequestObject({
    url: `${config.get('FACEBOOK.FACEBOOK_API')}/${config.get('FACEBOOK.FACEBOOK_VERSION')}/oauth/access_token`,
    qs: {
      grant_type: "fb_exchange_token",
      fb_exchange_token: shortLivedToken,
      client_id: config.get('FACEBOOK.FACEBOOK_APP_ID'),
      client_secret: config.get('FACEBOOK.FACEBOOK_SECRET_KEY')
    }
  }));
  try {
    const fullResponse = await myRequest.makeRequest(longLivedTokenRequest);
    if(fullResponse.statusCode === 200) {
      return Promise.resolve(fullResponse.body);
    }
    return Promise.resolve(fullResponse);
  } catch (error) {
    return Promise.reject(error)
  }
}

function readSocialTokenIn(req) {
  return req.body.facebookToken;
}

function isEnabled() {
  return FACEBOOK_APP_ID !== null && FACEBOOK_APP_ID !== undefined;
}

async function requestProfile(req) {
  try {
  const socialToken        = readSocialTokenIn(req);
    const longLivedRequested = Boolean(req.body.longLived);
    if (longLivedRequested) {
      const longLivedResponse = await requestLongLivedToken(socialToken);
      const longLivedToken = parseAccessToken(longLivedResponse);
      return findProfile(longLivedToken);
    } else {
      return findProfile(socialToken);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  requestProfile,
}

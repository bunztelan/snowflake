module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  backend: {
    hapiRemote: true,
    hapiLocal: false,
    parseRemote: false,
    parseLocal: false
  },
  PROOFN:{
    beta:{
      url:'http://beta.proofn.com/v1/'
    },
    prod:{
      url:'http://api.proofn.com/v1/'
    }
  },
  HAPI: {
    local: {
      url: 'http://localhost:5000'
    },
    remote: {
      url: 'https://snowflakeserver-bartonhammond.rhcloud.com/'
    }
  },
  PARSE: {
    appId: 'snowflake',                              // match APP_ID in parse-server's index.js
    local: {
      url: 'http://localhost:1337/parse'             // match SERVER_URL in parse-server's index.js
    },
    remote: {
      url: 'http://snowflake-parse.herokuapp.com/parse'   // match SERVER_URL in parse-server's index.js
    }
  }
}

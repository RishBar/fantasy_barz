const express  = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const path = require('path'); 
var url = require('url');
const YahooFantasy = require('yahoo-fantasy');
const redis = require('redis');

// var redisPort = process.env.REDISPORT || 6379;
// var redisHost = process.env.REDISHOST || '127.0.0.1';
// var redisAuth = process.env.REDISPASSWORD || null;
// var redisURL = url.parse(process.env.REDIS_URL);

// process.env.NODE_ENV? 
// (async () => {
//   console.log("RIGHTTTTTTTT", process.env.REDIS_URL);
  
//   var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
//   client.auth(redisURL.auth.split(":")[1]);
//   client.on('error', (err) => console.log('Redis Client Error', err));
//   await client.connect();
// })() :
// (async () => {
//   console.log("NOT RIGHTTTTTTTT");
  
//   const client = redis.createClient(redisPort, redisHost);
//   client.on('error', (err) => console.log('Redis Client Error', err));
//   await client.connect();
//   console.log(client)
// })()



const app = express(); 
const port = process.env.PORT || 3001;
const redirectURI = process.env.REDIRECTURI || "http://localhost:3001/auth/yahoo/callback"

// app.tokenCallback = tokenCallback = function ({ access_token, refresh_token }) {
//     return new Promise((resolve, reject) => {
//       // client is redis client
//       client.set("accessToken", access_token, (err, res) => {
//         // could probably handle this with a multi... 
//         // and you know... handle the errors...
//         // good thing this is only an example!
//         client.set("accessToken", access_token, (err, res) => {
//           return resolve();
//         })
//       })
//     });
//   };

app.yf = new YahooFantasy(
    process.env.YaAPP_KEY,
    process.env.YaAPP_SECRET,
    null,
    redirectURI
);

app.use((req, res, next) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

const api = require('./routes/routes');
app.use('/api/v1/', api);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
};

app.get(
  "/auth/yahoo",
  (req, res) => {
    app.yf.auth(res);
  }
);

app.get(
  "/games",
  (req, res) => {
    try {
      app.yf.user.games((uselessParam, gamesResponse) => {
        if (typeof(gamesResponse) == "Object") {
          console.log("GOODRESPONSEGOODRESPONSEGOODRESPONSE", typeof(gamesResponse), gamesResponse);
          res.send(gamesResponse) 
        } else {
          console.log("GOODRESPONSEGOODRESPONSEGOODRESPONSE", typeof(gamesResponse), gamesResponse);
          res.send("There was a problem getting games resource, check if access token is still set")
        }        
      });
    } catch (e) {
      console.error("ERROR MESSAGE", e);
    } 
  }
);
// app.get(
//   "/scores-for-week",
//   (req, res) => {
//     try {
//       const scoreboard = await app.yf.league.scoreboard(
//         league_key,
//         week // optional
//       );
//     } catch (e) {
//       // handle error
//     }
//   }
// )


  
app.get("/auth/yahoo/callback", (req, res) => {
  console.log("callback route been hit");
  
  app.yf.authCallback(req, (err) => {
    if (err) {
      return res.redirect("/error");
    } else if (app.yf.yahooUserToken) {
      console.log("APPAPPAPAPPAPPAP", app.yf);
      console.log("TOKENENEENENENENENE",app.yf.yahooUserToken);
      var string = encodeURIComponent('successfully verified');
      return res.redirect('/?verified=' + string);
    } else {
      console.log("APPAPPAPAPPAPPAP", app.yf);
      console.log("TOKENENEENENENENENE",app.yf.yahooUserToken);
      var string = encodeURIComponent('Problem verifying, please try again');
      return res.redirect('/?verified=' + string);
    }
  });
  // client.get('framework', function(err, reply) {
  //   console.log("AYYYYYYYY FAM", reply);
  // });
});

app.get("/error", (req, res) => {
  res.send("ERROR!"); 
})
  
app.listen(port, function (){
  console.log("backend service port ", port, "Server running");
});
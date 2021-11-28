const express  = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const path = require('path'); 
const YahooFantasy = require('yahoo-fantasy');
const redis = require('redis');

(async () => {
  const client = redis.createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
})();


const app = express(); 
const port = process.env.PORT || 3001;
const redirectURI = process.env.REDIRECTURI || "http://localhost:3001/auth/yahoo/callback"

app.tokenCallback = tokenCallback = function ({ access_token, refresh_token }) {
    return new Promise((resolve, reject) => {
      // client is redis client
      client.set("accessToken", access_token, (err, res) => {
        // could probably handle this with a multi... 
        // and you know... handle the errors...
        // good thing this is only an example!
        client.set("accessToken", access_token, (err, res) => {
          return resolve();
        })
      })
    });
  };

app.yf = new YahooFantasy(
    process.env.YaAPP_KEY,
    process.env.YaAPP_SECRET,
    tokenCallback,
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

  
app.get("/auth/yahoo/callback", (req, res) => {
  console.log("callback route been hit");
  app.yf.authCallback(req, (err) => {
    if (err) {
      return res.redirect("/error");
    }
    return res.redirect("/");
  });
  client.get('framework', function(err, reply) {
    console.log("AYYYYYYYY FAM", reply);
  });
  console.log("APPAPPAPAPPAPPAP", app.yf);
  console.log("USERUSERUSERUSERUSERUSER",app.yf.user);
});

app.get("/error", (req, res) => {
  res.send("ERROR!"); 
})
  
app.listen(port, function (){
  console.log("backend service port ", port, "Server running");
});
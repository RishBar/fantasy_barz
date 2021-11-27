const express  = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const YahooFantasy = require('yahoo-fantasy');


const app = express(); 
const port = process.env.PORT || 3001;

// app.tokenCallback = function ({ access_token, refresh_token }) {
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
    "https://fantasybarz-production.up.railway.app/auth/yahoo/callback"
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

  app.get('*', function (req, res) {
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
  console.log(app.yf);
  console.log("USERUSERUSERUSERUSERUSER",app.yf.user);
});

app.get("/error", (req, res) => {
  res.send("ERROR!"); 
})
  
app.listen(port, function (){
  console.log("Server running");
});
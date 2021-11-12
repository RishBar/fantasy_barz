const express  = require("express");
const app = express(); 
const port = 3000;
require('dotenv').config()
const YahooFantasy = require('yahoo-fantasy');

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

let buddy;
app.yf = new YahooFantasy(
    process.env.YaAPP_KEY,
    process.env.YaAPP_SECRET,
    "https://fantasybarz-production.up.railway.app/auth/yahoo/callback",
    null
);

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
});

app.get("/", (req, res) => {
  console.log("homepage has been hit");
    
  res.send("Hello World!"); 
})

app.get("/error", (req, res) => {
  res.send("ERROR!"); 
})
  

app.listen(port, function (){
  console.log("Server running");
});
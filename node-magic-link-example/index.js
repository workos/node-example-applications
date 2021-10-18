const express = require("express");
const path = require("path");
const WorkOS = require('@workos-inc/node').default;
const bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
require('dotenv').config()
process.on('unhandledRejection', (reason, p) => { throw reason });

// App Variables
const app = express();
const port = "8000";
const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID;

// App Configuration
app.set("views", path.join(__dirname, "views"));
app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));



// Route Definitions

 app.get("/", async (req, res) => {
  res.render("index.ejs", {
    title: "Home",
  });
});

app.post('/passwordless-auth', async (req, res) => {
  const email = req.body.email
  const session_options = {
    email,
    type: 'MagicLink'
  };
  // API call to generate a new passwordless session.
  const session = await workos.passwordless.createSession(session_options);
  console.log(session)

  // API call to send email, passing in session ID generate above.
  await workos.passwordless.sendSession(session.id);

  res.render("confirmation.ejs", {
    email: session.email,
    link: session.link,
  })
});

app.get("/success", async (req, res) => {
  // Retrieve auth code from query parameter
  const code = req.query.code;
  
  // Exchange auth code for profile
  const profile = await workos.sso.getProfileAndToken({
    code,
    clientID,
  });

  p_profile = JSON.stringify(profile);
  
  res.render("login_successful.ejs", {
    profile: p_profile,
  });
});



// Server Activation

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

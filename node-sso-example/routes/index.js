var express = require('express');
var router = express.Router();
var app = express();
var session = require('express-session');

app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } 
}));

// Import the WorkOS package.
const WorkOS = require('@workos-inc/node').default;

// Initialize the WorkOS client with your WorkOS API Key, pulled from .env.
const client = new WorkOS(process.env.WORKOS_API_KEY);

// Use the Connection ID associated to your SSO Connection.
const connection = "conn_01FNYP9FHYPEYN268C3D0RJJ7Z";

// Set the redirect URI to whatever URL the end user should land on post-authentication.
// Ensure that the redirect URI you use is included in your allowlist inthe WorkOS Dashboard.
const redirectURI = "http://localhost:3000/callback";

const state = 'thisguysemail@gmail.com';

// Store the Client ID, pulled from .env sourced from the Configuration section
// of the WorkOS Dashboard.
const clientID = process.env.WORKOS_CLIENT_ID;


/* GET home page. */
router.get('/', function(req, res, next) {

  if (session.isloggedin){
    res.render('login_successful.ejs', {
      profile: session.profile, 
      first_name: session.first_name
    });
  }

  res.render('index.ejs', { title: 'Express' });
});

/* GET login page */
router.get('/login', (_req, res) => {
  // Make a call to getAuthorizationURL, passing the Connection ID,
  // the redirect URI (optional, otherwise it will use your default set in the Dashboard)
  // and the clientID. Store the resulting URL in a `url` variable.
  try {
    const url = client.sso.getAuthorizationURL({
      connection: connection,
      clientID: clientID,
      redirectURI: redirectURI,
      state: state,
    });
  
    // Redirect the user to the url generated above.
    res.redirect(url);
    
  } catch (error) {
    res.render('error.ejs', {error: error})
  }
});

/* GET callback page */
router.get('/callback', async (req, res) => {
  try {
    // Capture and save the `code` passed as a querystring in the Redirect URI.
  const { code } = req.query;

  // Make a call to getProfileAndToken and pass in the code (stored above) and
  // the clientID. This will return a JSON user profile, stored here in `profile`.
  
  const profile = await client.sso.getProfileAndToken({
    code,
    clientID,
  });
  const json_profile = JSON.stringify(profile)

  session.first_name = profile.profile.first_name;
  session.profile = json_profile;
  session.isloggedin = true;

  res.redirect('/');
  } catch (error) {
    res.render('error.ejs', {error: error})
  }
});

// Logout route
router.get('/logout', async (req, res) => {
  try {
    session.first_name = null;
    session.profile = null;
    session.isloggedin = null;

    res.redirect('/');
  } catch (error) {
    res.render('error.ejs', {error: error})
  }
});

module.exports = router;

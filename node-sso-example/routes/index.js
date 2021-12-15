var express = require('express');
var router = express.Router();

// Import the WorkOS package.
const WorkOS = require('@workos-inc/node').default;

// Initialize the WorkOS client with your WorkOS API Key, pulled from .env.
const client = new WorkOS(process.env.WORKOS_API_KEY);

// Use the Connection ID associated to your SSO Connection.
const connection = "conn_1234";

// Set the redirect URI to whatever URL the end user should land on post-authentication.
// Ensure that the redirect URI you use is included in your allowlist inthe WorkOS Dashboard.
const redirectURI = "http://localhost:3000/callback";

const state = 'thisguysemail@gmail.com';

// Store the Client ID, pulled from .env sourced from the Configuration section
// of the WorkOS Dashboard.
const clientID = process.env.WORKOS_CLIENT_ID;


/* GET home page. */
router.get('/', function(req, res, next) {
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


  let img;
  profile.profile.raw_attributes.picture ? img = profile.profile.raw_attributes.picture : img = '../public/images/workos_logo_new.png';
  const json_profile = JSON.stringify(profile)

  
  res.render('login_successful.ejs', {profile: json_profile, first_name: profile.profile.first_name, image: profile.profile.raw_attributes.picture})
 
  } catch (error) {
    res.render('error.ejs', {error: error})
  }
});

module.exports = router;

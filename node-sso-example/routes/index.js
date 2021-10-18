var express = require('express');
var router = express.Router();

// Import the WorkOS package.
const WorkOS = require('@workos-inc/node').default;

// Initialize the WorkOS client with your WorkOS API Key, pulled from .env.
const client = new WorkOS(process.env.WORKOS_API_KEY);

// Use domain associated to the organization in which your SSO Connection resides.
// Alternatively, if your Organization has multiple SSO Connections within it,
// you can pass the Connection ID instead of the domain.
const domain = "gmail.com";

// Set the redirect URI to whatever URL the end user should land on post-authentication.
// Ensure that the redirect URI you use is included in your allowlist inthe WorkOS Dashboard.
const redirectURI = "http://localhost:3000/callback";

// Store the Client ID, pulled from .env sourced from the Configuration section
// of the WorkOS Dashboard.
const clientID = process.env.WORKOS_CLIENT_ID;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

/* GET login page */
router.get('/login', (_req, res) => {
  // Make a call to getAuthoirzationURL, passing the domain (or Connection ID),
  // the redirect URI (optional, otherwise it will use your default set in the Dashboard)
  // and the clientID. Store the resulting URL in a `url` variable.
  try {
    const url = client.sso.getAuthorizationURL({
      domain,
      redirectURI,
      clientID,
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
  profile.profile.raw_attributes.picture ? img = profile.profile.raw_attributes.picture : img = url('../public/images/workos_logo_new.png');
  const json_profile = JSON.stringify(profile)

  
  res.render('login_successful.ejs', {profile: json_profile, first_name: profile.profile.first_name, image: profile.profile.raw_attributes.picture})
 
  } catch (error) {
    res.render('error.ejs', {error: error})
  }
});

module.exports = router;

// External Modules
const express = require("express");
const path = require("path");
const WorkOS = require('@workos-inc/node').default;
require('dotenv').config()
process.on('unhandledRejection', (reason) => { throw reason });
const bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// App Variables
const app = express();
const port = "8000";
const workos = new WorkOS(process.env.WORKOS_API_KEY);

//App Configuration
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

app.post('/provision-enterprise', async (req, res) => {
  const organizationName =  req.body.org
  const domains = req.body.domain.split(" ")
  
  // Make call to listOrganizations and filter using the domain passed in by user.
  const organizations = await workos.organizations.listOrganizations({
    domains: domains,
  });
  // If no organizations exist with that domain, create one.
  if (organizations.data.length === 0) {
    global.organization = await workos.organizations.createOrganization({
      name: organizationName,
      domains: domains,
    });
    res.render('logged_in.ejs');
  }
  // If an organization does exist with the domain, use that organization for the connection.
  else {
    global.organization = organizations.data[0];
    res.render('logged_in.ejs');
  }
});

app.get('/sso-admin-portal', async (_req, res) => {
  const organizationID =  global.organization.id;

  // Generate an SSO Adnim Portal Link using the Organization ID from above.
  const { link } = await workos.portal.generateLink({
    organization: organizationID,
    intent: 'sso',
  });

  res.redirect(link);
});

app.get('/dsync-admin-portal', async (_req, res) => {
  const organizationID =  global.organization.id;

  // Generate an SSO Adnim Portal Link using the Organization ID from above.
  const { link } = await workos.portal.generateLink({
    organization: organizationID,
    intent: 'dsync',
  });

  res.redirect(link);
});


// Server Activation
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

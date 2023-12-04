import express from "express";
import session from "express-session";
import { WorkOS } from "@workos-inc/node";
import "dotenv/config";
import morgan from "morgan";

const app = express();
const router = express.Router();
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID;
const organizationID = process.env.WORKOS_Org_ID;
const redirectURI = "http://localhost:8000/callback";
const state = "";

router.get("/", function (req, res) {
  if (session.isloggedin) {
    res.render("login_successful.ejs", {
      profile: session.profile,
      first_name: session.first_name,
    });
  } else {
    res.render("index.ejs", { title: "Home" });
  }
});

router.post("/login", (req, res) => {
  const login_type = req.body.login_method;

  const params = {
    clientID: clientID,
    redirectURI: redirectURI,
    state: state,
  };

  if (login_type === "saml") {
    params.organization = organizationID;
  } else {
    params.provider = login_type;
  }

  try {
    const url = workos.sso.getAuthorizationURL(params);

    res.redirect(url);
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const profile = await workos.sso.getProfileAndToken({
      code,
      clientID,
    });
    // Convert profile data to plain text for display
    const plainTextProfile = ` ${profile.profile.first_name} ${profile.profile.last_name}\n`;
    // Add other profile details as needed in a similar format

    session.first_name = profile.profile.first_name;
    session.last_name = profile.profile.last_name;
    session.email = profile.profile.email;
    session.profile = plainTextProfile;
    session.isloggedin = true;

    res.redirect("/");
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

app.get("/users", async (req, res) => {
  const directoryId = req.query.id;
  const users = await workos.directorySync.listUsers({
    directory: directoryId,
    limit: 100,
  });
  res.render("users.ejs", { users: users.data });
});

router.get("/logout", async (req, res) => {
  try {
    session.first_name = null;
    session.profile = null;
    session.isloggedin = null;

    res.redirect("/");
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

export default router;

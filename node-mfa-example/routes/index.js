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

const WorkOS = require('@workos-inc/node').default;
const workos = new WorkOS(process.env.WORKOS_API_KEY);
factors = session.factors = [];

router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Home' });
});

router.post('/enroll_factor', async function(req, res) {
  if (req.body.type === "sms") {
    factor_type = req.body.type;
    phone_number = '+1' + req.body.phone_number;

    new_factor = await workos.mfa.enrollFactor({
      type: factor_type,
      phoneNumber: phone_number,
    });
  } else if (req.body.type === "totp") {
    factor_type = req.body.type;
    issuer = req.body.totp_issuer;
    user = req.body.totp_user;

    new_factor = await workos.mfa.enrollFactor({
      type: factor_type,
      issuer: issuer,
      user: user,
    });
  }

  factors.push(new_factor);
  res.render('index.ejs', { factors: factors });
});

router.get('/factor_detail/:id', async (req, res) => {
   const factor = await factors.filter((factor) => {
     return factor.id == req.params.id
   })[0]

  session.current_factor = factor;
  res.render('factor_detail.ejs', { title: 'Factor Detail', factor: factor });
});

router.post('/challenge_factor', async (req, res) => {
  if (session.current_factor.type === "sms") {
    message = req.body.sms_message;
    session.sms_message = message;

    const challenge = await workos.mfa.challengeFactor({
      authenticationFactorId: session.current_factor.id,
      smsTemplate: message,
    });
    session.challenge_id = challenge.id
  }

  if (session.current_factor.type === "totp") {
    message = req.body.sms_message;
    session.sms_message = message;

    const challenge = await workos.mfa.challengeFactor({
      authenticationFactorId: session.current_factor.id,
    });
    console.log(JSON.stringify(challenge));
    session.challenge_id = challenge.id
  }

  res.render('challenge_factor.ejs', { title: 'Challenge Factor' });
});

router.post('/verify_factor', async (req, res) => {
  code = req.body.code;
  challenge_id = session.challenge_id;
  verify_factor = await workos.mfa.verifyFactor({
    authenticationChallengeId: challenge_id,
    code: code,
  });
  res.render('challenge_success.ejs', { title: 'Challenge Success', verify_factor: verify_factor });
});

router.get('/challenge_success', async (req, res) => {
  res.render('challenge_success.ejs', { title: 'Challenge Success' });
});

module.exports = router;

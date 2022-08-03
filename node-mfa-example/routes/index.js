import express from 'express'
import session from 'express-session'
import { WorkOS } from '@workos-inc/node'

const app = express()
const router = express.Router()

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
)

const workos = new WorkOS(process.env.WORKOS_API_KEY)
session.factors = []

router.get('/', function (req, res) {
    res.render('index.ejs', { title: 'Home', factors: session.factors })
})

router.get('/enroll_factor', (req, res) => {
    res.render('enroll_factor.ejs')
})

router.post('/enroll_new_factor', async function (req, res) {
    let factor_type
    let new_factor

    if (req.body.type === 'sms') {
        factor_type = req.body.type
        const phone_number = '+1' + req.body.phone_number

        new_factor = await workos.mfa.enrollFactor({
            type: factor_type,
            phoneNumber: phone_number,
        })
    } else if (req.body.type === 'totp') {
        factor_type = req.body.type
        const issuer = req.body.totp_issuer
        const user = req.body.totp_user

        new_factor = await workos.mfa.enrollFactor({
            type: factor_type,
            issuer: issuer,
            user: user,
        })
    }

    session.factors.push(new_factor)
    res.render('index.ejs', { factors: session.factors })
})

router.get('/factor_detail/:id', async (req, res) => {
    const factor = await session.factors.filter((factor) => {
        return factor.id == req.params.id
    })[0]

    session.current_factor = factor
    res.render('factor_detail.ejs', { title: 'Factor Detail', factor: factor })
})

router.post('/challenge_factor', async (req, res) => {
    let message
    if (session.current_factor.type === 'sms') {
        message = req.body.sms_message
        session.sms_message = message

        const challenge = await workos.mfa.challengeFactor({
            authenticationFactorId: session.current_factor.id,
            smsTemplate: message,
        })
        session.challenge_id = challenge.id
    }

    if (session.current_factor.type === 'totp') {
        message = req.body.sms_message
        session.sms_message = message

        const challenge = await workos.mfa.challengeFactor({
            authenticationFactorId: session.current_factor.id,
        })
        console.log(JSON.stringify(challenge))
        session.challenge_id = challenge.id
    }

    res.render('challenge_factor.ejs', { title: 'Challenge Factor' })
})

router.post('/verify_factor', async (req, res) => {
    const buildCode = (codeItems) => {
        let code = []
        for (const item in codeItems) {
            code.push(codeItems[item])
        }
        return code.join('')
    }
    const code = buildCode(req.body)
    const challenge_id = session.challenge_id

    const verify_factor = await workos.mfa.verifyFactor({
        authenticationChallengeId: challenge_id,
        code: code,
    })
    res.render('challenge_success.ejs', {
        title: 'Challenge Success',
        verify_factor: verify_factor,
    })
})

router.get('/challenge_success', async (req, res) => {
    res.render('challenge_success.ejs', { title: 'Challenge Success' })
})

router.get('/clear_session', (req, res) => {
    session.factors = []
    res.redirect('/')
})

export default router

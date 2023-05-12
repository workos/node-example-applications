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

router.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Home', factors: session.factors })
})

router.get('/enroll_factor', (req, res) => {
    res.render('enroll_factor.ejs')
})

router.post('/enroll_sms_factor', async (req, res) => {
    let new_factor
    const phone_number = '+1' + req.body.phone_number

    new_factor = await workos.mfa.enrollFactor({
        type: 'sms',
        phoneNumber: phone_number,
    })

    session.factors.push(new_factor)
    res.render('index.ejs', { factors: session.factors })
})

router.post('/enroll_totp_factor', async (req, res) => {
    const { type, issuer, user } = req.body

    const { object, id, created_at, updated_at, totp } =
        await workos.mfa.enrollFactor({
            type,
            issuer,
            user,
        })

    session.factors.push({
        object,
        id,
        created_at,
        updated_at,
        type,
    })

    res.json(totp.qr_code)
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
        verify_factor: verify_factor,
        type: session.current_factor.type,
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

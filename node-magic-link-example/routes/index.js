import express from 'express'
import { WorkOS } from '@workos-inc/node'

const router = express.Router()

const workos = new WorkOS(process.env.WORKOS_API_KEY)

const clientID =
    process.env.WORKOS_CLIENT_ID !== undefined
        ? process.env.WORKOS_CLIENT_ID
        : ''

router.get('/', async (req, res) => {
    res.render('index.ejs', {
        title: 'Home',
    })
})

router.post('/passwordless_auth', async (req, res) => {
    const email = req.body.email

    const session = await workos.passwordless.createSession({
        email: email,
        type: 'MagicLink',
    })

    await workos.passwordless.sendSession(session.id)

    res.render('confirmation.ejs', {
        email: session.email,
        link: session.link,
    })
})

router.get('/callback', async (req, res) => {
    const code = req.query.code

    const profile = await workos.sso.getProfileAndToken({
        code,
        clientID,
    })

    res.render('login_successful.ejs', {
        profile: JSON.stringify(profile, null, 4),
    })
})

export default router

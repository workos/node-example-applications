import express from 'express'
import session from 'express-session'
import 'dotenv/config'
const router = express.Router()
const app = express()

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
)

import { WorkOS } from '@workos-inc/node'

const client = new WorkOS(process.env.WORKOS_API_KEY)
const connection = 'conn_01G2TM1BYXCPFB5Y12WN7FK2DY'
const redirectURI = 'http://localhost:8000/callback'
const state = 'thisguysemail@gmail.com'
const clientID = process.env.WORKOS_CLIENT_ID

router.get('/', function (req, res) {
    if (session.isloggedin) {
        res.render('login_successful.ejs', {
            profile: session.profile,
            first_name: session.first_name,
        })
    }

    res.render('index.ejs', { title: 'Express' })
})

router.get('/login', (_req, res) => {
    try {
        const url = client.sso.getAuthorizationURL({
            connection: connection,
            clientID: clientID,
            redirectURI: redirectURI,
            state: state,
        })

        res.redirect(url)
    } catch (error) {
        res.render('error.ejs', { error: error })
    }
})

router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query

        const profile = await client.sso.getProfileAndToken({
            code,
            clientID,
        })
        const json_profile = JSON.stringify(profile)

        session.first_name = profile.profile.first_name
        session.profile = json_profile
        session.isloggedin = true

        res.redirect('/')
    } catch (error) {
        res.render('error.ejs', { error: error })
    }
})

router.get('/logout', async (req, res) => {
    try {
        session.first_name = null
        session.profile = null
        session.isloggedin = null

        res.redirect('/')
    } catch (error) {
        res.render('error.ejs', { error: error })
    }
})

export default router

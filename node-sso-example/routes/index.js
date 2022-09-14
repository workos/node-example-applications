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

const workos = new WorkOS ('sk_test_a2V5XzAxR0NCWFlEUFozNzZRTVk5S0VUU05FU1BTLGlXQ0hVVHllaUl1MHc0QXU4Z3lJNFk2S2k')
const clientID = 'client_01GCBXYDQ4D51WJHKT8AHAZ1K8'
const connection = 'conn_01GCWXM65JQR4WQ9RKRVQT2RHM'
const redirectURI = 'https://will-dersh.herokuapp.com/callback'
const state = 'thisguysemail@gmail.com'

router.get('/', function (req, res) {
    if (session.isloggedin) {
        res.render('login_successful.ejs', {
            profile: session.profile,
            first_name: session.first_name,
        })
    } else {
        res.render('index.ejs', { title: 'Express' })
    }
})

router.get('/login', (req, res) => {
    try {
        const url = workos.sso.getAuthorizationURL({
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

        const profile = await workos.sso.getProfileAndToken({
            code,
            clientID,
        })
        const json_profile = JSON.stringify(profile, null, 4)

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

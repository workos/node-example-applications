import express from 'express'
import session from 'express-session'
import { WorkOS } from '@workos-inc/node'
import { user_signed_in, user_logged_out, user_organization_set, user_organization_deleted, user_connection_deleted } from '../audit_log_events.js'

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

router.get('/', function (req, res) {
    res.render('login.ejs')
})

router.post('/set_org', (req, res) => {
    session.org = req.body.org
//get customer by org id
    res.render('send_events.ejs', {
        org: session.org
    })
})

export default router

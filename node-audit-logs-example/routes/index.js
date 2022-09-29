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

router.post('/set_org', async (req, res) => {
    const org = await workos.organizations.getOrganization(
        req.body.org
    );

    session.orgId = org.id
    session.orgName = org.name

    res.render('send_events.ejs', {
        orgName: org.name,
        orgId: org.id
    })
})

export default router

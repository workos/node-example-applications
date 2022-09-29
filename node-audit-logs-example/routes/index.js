import express from 'express'
import session from 'express-session'
import { WorkOS } from '@workos-inc/node'
import { user_signed_in, user_logged_out, user_organization_deleted, user_connection_deleted } from '../audit_log_events.js'

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

router.post('/send_event', async (req, res) => {
    const eventId = req.body.eventId
    let event;

    switch(eventId) {
        case 'user_signed_in':
            event = user_signed_in
            break
        case 'user_logged_out':
            event = user_logged_out
            break
        case 'user_organization_deleted':
            event = user_organization_deleted
            break
        case 'user_connection_deleted':
            event = user_connection_deleted
            break
    }

    await workos.auditLogs.createEvent(
        session.orgId || 'org_01G2TKRPR28XB702EF71EA8BY6',
        event
    )

    console.log(event)
})

export default router




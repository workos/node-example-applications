import express from 'express'
import session from 'express-session'
import open from 'open'
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

router.get('/', async (req, res) => {
    // try {
    //     const link = await workos.portal.generateLink({
    //         organization: "org_01GF6GSVK3QZ9RBD5QQ81WCYBN",
    //         intent: "audit_logs"
    //     })

    //     //flask
    //     // today = datetime.today()
    //     // last_month = today - timedelta(days=30)

    //     res.render('send_events.ejs', {
    //         link: link,
    //         orgId: "REPLACE",
    //         orgName: "REPLACE"
    //     })
    // } catch (error) {
    //     console.error(error);
    // }


    let before = req.query.before
    let after = req.query.after

    const organizations = await workos.organizations.listOrganizations({ limit: 2, before: before, after: after, order: null })
  
    before = organizations.listMetadata.before
    after = organizations.listMetadata.after

    console.log(organizations)

    res.render('login.ejs', {
        title: 'Home',
        organizations: organizations.data,
        before: before,
        after: after
    })
})

router.get('/set_org', async (req, res) => {
    const org = await workos.organizations.getOrganization(
        req.query.id
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

    try {
        await workos.auditLogs.createEvent(
            session.orgId || 'org_01G2TKRPR28XB702EF71EA8BY6',
            event
        )
    } catch (error) {
        console.error(error);
    }

    res.send('OK')
})

router.get('/export_events', (req, res) => {
    res.render('export_events.ejs', {
        orgName: session.orgName,
        orgId: session.orgId
    })
})

router.get('/generate_admin_portal_link', async (req, res) => {
    const { link } = await workos.portal.generateLink({
        organization: session.orgId,
        intent: "audit_logs"
    })

    res.redirect(link)
})

router.get('/generate_csv', async (req, res) => {
    const now = new Date()
    const monthAgo = now.setMonth(now.getMonth() - 1)

    const auditLogExport = await workos.auditLogs.createExport({
        organization_id: session.orgId,
        range_start: new Date(monthAgo).toISOString(),
        range_end: new Date().toISOString(),
    })

    session.exportId = auditLogExport.id
})

router.get('/access_csv', async (req, res) => {
    const auditLogExport = await workos.auditLogs.getExport(
        session.exportId,
    )

    await open(auditLogExport.url)
})

router.get('/events', async (req, res) => {
    const link = await workos.portal.generateLink({
        organization: "org_01GF6GSVK3QZ9RBD5QQ81WCYBN",
        intent: "audit_logs"
    })

    res.redirect(link.link)
})

router.get('/logout', (req, res) => {
    session.orgId = null
    session.orgName = null
    
    res.redirect("/")
})

export default router


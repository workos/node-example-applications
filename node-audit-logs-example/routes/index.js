import express from 'express'
import session from 'express-session'
import open from 'open'
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

router.get('/', async (req, res) => {
    let before = req.query.before
    let after = req.query.after

    const organizations = await workos.organizations.listOrganizations({ 
        limit: 2, 
        before: before, 
        after: after, 
        order: null 
    })
  
    before = organizations.listMetadata.before
    after = organizations.listMetadata.after

    res.render('login.ejs', {
        organizations: organizations.data,
        before: before,
        after: after,
    })
})

router.get('/set_org', async (req, res) => {
    const org = await workos.organizations.getOrganization(
        req.query.id
    );

    const link = await workos.portal.generateLink({
        organization: org.id,
        intent: "audit_logs"
    })

    session.orgId = org.id
    session.orgName = org.name
    session.orgLink = link.link

    const now = new Date()
    const monthAgo = now.setMonth(now.getMonth() - 1)

    res.render('send_events.ejs', {
        orgName: org.name,
        orgId: org.id,
        link: link.link,
        rangeStart: new Date(monthAgo).toISOString(),
        rangeEnd: new Date().toISOString()
    })
})

// FIX
router.post('/send_event', async (req, res) => {
    console.log('SEND EVENT POST ENDPOINT SUBMIT')
    // const eventId = req.body.eventId
    // let event;

    // switch(eventId) {
    //     case 'user_signed_in':
    //         event = user_signed_in
    //         break
    //     case 'user_logged_out':
    //         event = user_logged_out
    //         break
    //     case 'user_organization_deleted':
    //         event = user_organization_deleted
    //         break
    //     case 'user_connection_deleted':
    //         event = user_connection_deleted
    //         break
    // }

    // try {
    //     await workos.auditLogs.createEvent(
    //         session.orgId || 'org_01G2TKRPR28XB702EF71EA8BY6',
    //         event
    //     )
    // } catch (error) {
    //     console.error(error);
    // }

    res.send('OK')
})

router.get('/generate_admin_portal_link', async (req, res) => {
    const { link } = await workos.portal.generateLink({
        organization: session.orgId,
        intent: "audit_logs"
    })

    res.redirect(link)
})

//
router.post('/generate_csv', async (req, res) => {
    const { actions, actors, targets, rangeStart, rangeEnd } = req.body

    const exportDetails = {
        organization_id: session.orgId,
        range_start: rangeStart,
        range_end: rangeEnd,
    }

    actions.length && (exportDetails.actions = actions)
    actors.length && (exportDetails.actors = actors)
    targets.length && (exportDetails.targets = targets)

    try {
        const auditLogExport = await workos.auditLogs.createExport(exportDetails)

        session.exportId = auditLogExport.id
    } catch (error) {
        console.error(error)
    }

})

//
router.get('/access_csv', async (req, res) => {
    const auditLogExport = await workos.auditLogs.getExport(
        session.exportId,
    )

    await open(auditLogExport.url)
})

//
router.get('/events', async (req, res) => {
    const link = await workos.portal.generateLink({
        organization: "org_01GF6GSVK3QZ9RBD5QQ81WCYBN",
        intent: "audit_logs"
    })

    res.redirect(link.link)
})

//
router.get('/logout', (req, res) => {
    session.orgId = null
    session.orgName = null
    session.orgLink = null
    session.exportId = null

    res.redirect("/")
})

export default router


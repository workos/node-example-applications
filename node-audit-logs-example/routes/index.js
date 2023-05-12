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
        limit: 5,
        before: before,
        after: after,
        order: null,
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
    const org = await workos.organizations.getOrganization(req.query.id)

    session.orgId = org.id
    session.orgName = org.name

    const now = new Date()
    const monthAgo = now.setMonth(now.getMonth() - 1)

    res.render('send_events.ejs', {
        orgName: org.name,
        orgId: org.id,
        rangeStart: new Date(monthAgo).toISOString(),
        rangeEnd: new Date().toISOString(),
    })
})

router.post('/send_event', async (req, res) => {
    const {
        eventAction,
        eventVersion,
        actorName,
        actorType,
        targetName,
        targetType,
    } = req.body

    const event = {
        action: eventAction,
        version: Number(eventVersion),
        occurred_at: new Date().toISOString(),
        actor: {
            type: actorType,
            name: actorName,
            id: 'user_12345678901234567890123456',
        },
        targets: [
            {
                type: targetType,
                name: targetName,
                id: 'team_12345678901234567890123456',
            },
        ],
        context: {
            location: '123.123.123.123',
            user_agent: 'Chrome/104.0.0.0',
        },
    }

    try {
        await workos.auditLogs.createEvent(session.orgId, event)
    } catch (error) {
        console.error(error.message)
    }
})

router.post('/generate_csv', async (req, res) => {
    const { actions, actors, targets, rangeStart, rangeEnd } = req.body

    const exportDetails = {
        organization_id: session.orgId,
        range_start: rangeStart,
        range_end: rangeEnd,
    }

    actions && (exportDetails.actions = actions)
    actors && (exportDetails.actors = actors)
    targets && (exportDetails.targets = targets)

    try {
        const auditLogExport = await workos.auditLogs.createExport(
            exportDetails
        )
        session.exportId = auditLogExport.id
    } catch (error) {
        console.error(error.message)
    }
})

router.get('/access_csv', async (req, res) => {
    const auditLogExport = await workos.auditLogs.getExport(session.exportId)

    await open(auditLogExport.url)
})

router.get('/events', async (req, res) => {
    const intent = req.query.intent

    const { link } = await workos.portal.generateLink({
        organization: session.orgId,
        intent,
    })

    res.redirect(link)
})

router.get('/logout', (req, res) => {
    session.orgId = null
    session.orgName = null
    session.exportId = null

    res.redirect('/')
})

export default router

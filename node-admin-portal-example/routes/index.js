import express from 'express'
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('index.ejs', {
        title: 'Home',
    })
})

router.post('/provision_enterprise', async (req, res) => {
    const orgName = req.body.org
    const domains = req.body.domain.split(' ')

    let orgs = await workos.organizations.listOrganizations({
        domains: domains,
    })

    if (orgs.data.length > 0) {
        global.org = orgs.data[0]
    } else {
        global.org = await workos.organizations.createOrganization({
            name: orgName,
            domains: domains,
        })
    }

    res.render('logged_in.ejs')
})

router.get('/launch_admin_portal', async (req, res) => {
    const intent = req.query.intent

    const { link } = await workos.portal.generateLink({
        organization: global.org.id,
        intent: intent,
    })

    res.redirect(link)
})

export default router

import express from 'express'
const router = express.Router()
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

router.get('/', async (req, res) => {
    res.render('index.ejs', {
        title: 'Home',
    })
})

router.post('/provision-enterprise', async (req, res) => {
    const organizationName = req.body.org
    const domains = req.body.domain.split(' ')

    const organizations = await workos.organizations.listOrganizations({
        domains: domains,
    })

    if (organizations.data.length === 0) {
        global.organization = await workos.organizations.createOrganization({
            name: organizationName,
            domains: domains,
        })
        res.render('logged_in.ejs')
    } else {
        global.organization = organizations.data[0]
        res.render('logged_in.ejs')
    }
})

router.get('/sso-admin-portal', async (_req, res) => {
    const organizationID = global.organization.id

    const { link } = await workos.portal.generateLink({
        organization: organizationID,
        intent: 'sso',
    })

    res.redirect(link)
})

router.get('/dsync-admin-portal', async (_req, res) => {
    const organizationID = global.organization.id

    const { link } = await workos.portal.generateLink({
        organization: organizationID,
        intent: 'dsync',
    })

    res.redirect(link)
})

export default router

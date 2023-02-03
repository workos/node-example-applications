import express from 'express'
import { WorkOS } from '@workos-inc/node'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('index.ejs', {
        title: 'Home',
    })
})

router.post('/find-enterprise', async (req, res) => {
    const organizationID = req.body.orgID

    try {
        const organization = await workos.organizations.getOrganization(
            organizationID
        );
        global.organization = organization
        res.render('logged_in.ejs')
    } catch (error) {
        res.render('index.ejs', {
            error: error
        })
    }
})

router.post('/provision-enterprise', async (req, res) => {
    const organizationName = req.body.orgName
    const domains = req.body.domain.split(' ')

    global.organization = await workos.organizations.createOrganization({
        name: organizationName,
        domains: domains,
    })
    res.render('logged_in.ejs')
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

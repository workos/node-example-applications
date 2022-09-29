import express from 'express'
import { WorkOS } from '@workos-inc/node'

const app = express()
const router = express.Router()

const workos = new WorkOS(process.env.WORKOS_API_KEY)

router.get('/', function (req, res) {
    res.render('login.ejs')
})

router.get('/enroll_factor', (req, res) => {
    res.render('enroll_factor.ejs')
})

export default router

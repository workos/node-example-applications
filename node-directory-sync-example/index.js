import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import { WorkOS } from '@workos-inc/node'
import { Server } from 'socket.io'

const app = express()
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

const port = process.env.PORT || '8000'
const workos = new WorkOS(process.env.WORKOS_API_KEY)

const server = app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${port}`)
})

const io = new Server(server)

io.on('connection', (socket) => {
    console.log('connected')

    socket.on('disconnect', () => {
        console.log('disconnected')
    })
})

app.get('/', async (req, res) => {
    let before = req.query.before
    let after = req.query.after

    const directories = await workos.directorySync.listDirectories({
        limit: 5,
        before: before,
        after: after,
        order: null,
    })

    before = directories.listMetadata.before
    after = directories.listMetadata.after

    res.render('index.ejs', {
        title: 'Home',
        directories: directories.data,
        before: before,
        after: after,
    })
})

app.get('/directory', async (req, res) => {
    const directories = await workos.directorySync.listDirectories()
    const directory = directories.data.filter((directory) => {
        return directory.id == req.query.id
    })[0]
    res.render('directory.ejs', {
        directory: directory,
        title: 'Directory',
    })
})

app.get('/users', async (req, res) => {
    const directoryId = req.query.id
    const users = await workos.directorySync.listUsers({
        directory: directoryId,
        limit: 100,
    })
    res.render('users.ejs', { users: users.data })
})

app.get('/groups', async (req, res) => {
    const directoryId = req.query.id
    const groups = await workos.directorySync.listGroups({
        directory: directoryId,
        limit: 100,
    })
    res.render('groups.ejs', { groups: groups.data })
})

app.post('/webhooks', async (req, res) => {
    const webhook = workos.webhooks.constructEvent({
        payload: req.body,
        sigHeader: req.headers['workos-signature'],
        secret: process.env.WORKOS_WEBHOOK_SECRET,
        tolerance: 90000,
    })
    io.emit('webhook event', { webhook })

    res.sendStatus(200)
})

app.get('/webhooks', async (req, res) => {
    res.render('webhooks.ejs', {
        title: 'Webhooks',
    })
})

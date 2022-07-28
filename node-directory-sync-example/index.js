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
    const directories = await workos.directorySync.listDirectories()
    console.log(directories.data)
    res.render('index.ejs', {
        title: 'Home',
        directories: directories.data,
    })
})

app.get('/directory/:id', async (req, res) => {
    const directories = await workos.directorySync.listDirectories()
    const directory = await directories.data.filter((directory) => {
        return directory.id == req.params.id
    })[0]
    res.render('directory.ejs', {
        directory: directory,
        title: 'Directory',
    })
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

app.get('/directory/:id/usersgroups', async (req, res) => {
    const directories = await workos.directorySync.listDirectories()
    const directory = await directories.data.filter((directory) => {
        return directory.id == req.params.id
    })[0]
    const groups = await workos.directorySync.listGroups({
        directory: req.params.id,
    })
    const users = await workos.directorySync.listUsers({
        directory: req.params.id,
    })
    console.log(groups.data, users.data)

    res.render('groups.ejs', {
        groups: groups.data,
        directory: directory,
        users: users.data,
        title: 'Group & Users',
    })
})

app.get('/directory/:id/group/:groupId', async (req, res) => {
    const directories = await workos.directorySync.listDirectories()
    const directory = await directories.data.filter((directory) => {
        return directory.id == req.params.id
    })[0]
    const groups = await workos.directorySync.listGroups({
        directory: req.params.id,
    })
    const group = await groups.data.filter((group) => {
        return group.id == req.params.groupId
    })[0]
    res.render('group.ejs', {
        directory: directory,
        title: 'Directory',
        group: JSON.stringify(group),
        rawGroup: group,
    })
})

app.get('/directory/:id/user/:userId', async (req, res) => {
    const directories = await workos.directorySync.listDirectories()
    const directory = await directories.data.filter((directory) => {
        return directory.id == req.params.id
    })[0]
    const users = await workos.directorySync.listUsers({
        directory: req.params.id,
    })
    const user = await users.data.filter((user) => {
        return user.id == req.params.userId
    })[0]
    res.render('user', {
        directory: directory,
        title: 'Directory',
        user: JSON.stringify(user),
        rawUser: user,
    })
    console.log(user)
})

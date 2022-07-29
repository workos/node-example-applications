import createError from 'http-errors'
import express from 'express'
import router from './routes/index.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

const app = express()

const port = process.env.PORT || 8000

app.use('/public', express.static('public'))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(cookieParser())

app.use(morgan('dev'))

app.use('/', router)

app.use(function (req, res, next) {
    next(createError(404))
})

app.use(function (err, req, res) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error.ejs', { error: res.locals.error })
})

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${port}`)
})

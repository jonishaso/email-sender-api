import cookieParser from 'cookie-parser'
import cors from 'cors'
import createDebugger from 'debug'
import ejs from 'ejs'
import express from 'express'
import path from 'path'
import morgan from 'morgan'
import expressRequestId from 'express-request-id'

import { enableResend, loggerHttpCodeMetrics, morganLoggerFormat, port } from './config'
import emailRouter from './routes/email'
import rootRouter from './routes/root'
import resendWorker from './worker/cronWorker'

const debug = createDebugger('app')

const addRequestId = expressRequestId()

const app = express()
app.use(cors())
if (enableResend === '1') resendWorker.start()
app.use(addRequestId)

morgan.token('id', (req) => req.id)

const loggerFormat = morganLoggerFormat

app.use(
  morgan(loggerFormat, {
    skip: function (req, res) {
      return res.statusCode < loggerHttpCodeMetrics
    },
    stream: process.stderr,
  })
)

app.use(
  morgan(loggerFormat, {
    skip: function (req, res) {
      return res.statusCode >= loggerHttpCodeMetrics
    },
    stream: process.stdout,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.set('views', path.join(__dirname, 'views'))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, 'build')))

app.use('/email', emailRouter)
app.use('*', rootRouter)

const appPort = port || 3030

app.listen(appPort, () => {
  debug(`listening on ${appPort}`)
})

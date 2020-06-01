import 'dotenv/config'

export const port = process.env.PORT
export const sendGridKey = process.env.SENDGRID_KEY
export const mailGunKey = process.env.MAILGUN_KEY
export const mailGunDomain = process.env.MAILGUN_DOMAIN
export const mongoAtlasLink = process.env.MONGO_LINK
export const emailRegex = /.+@.+\..+/gi
export const enableResend = process.env.ENABLE_CRON
export const cronJobSchedule = '* */10 * * * *'
export const morganLoggerFormat = ':id [:date[web]] ":method :url" :status :response-time'
export const loggerHttpCodeMetrics = 400

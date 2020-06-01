import { CronJob } from 'cron'
import createDebugger from 'debug'

import { cronJobSchedule } from '#root/config'
import mongoInterface from '#root/db/interface'
import MailSender from '#root/models/MailSender'

const debug = createDebugger('express:cronjob')

const sendPendingEmailCronJob = async () => {
  const { result } = await mongoInterface.performFindAll(false)
  if (!(result instanceof Array)) {
    throw new Error('wrong db results return')
  }
  if (result.length === 0) {
    debug('db is empty')
    return
  }
  let promiseList = result.map((record) => {
    const { _id, bcc, cc, subject, text, to } = record
    return new Promise(async (resolve) => {
      if (await MailSender.sendEmail({ bcc, cc, subject, text, to })) {
        try {
          await mongoInterface.performDeleteOne(_id, false)
          resolve({ id: _id, isSuccess: true })
        } catch (error) {
          debug('email : %s, re-sent successfully, but can not be delete from database, err: %o', _id, error)
          resolve({ id: _id, isSuccess: true })
        }
      } else resolve({ id: _id, isSuccess: false })
    })
  })
  Promise.all(promiseList)
    .then(async (data) => {
      debug(`there are ${data.length} email be re-sent`)
      const { result } = await mongoInterface.performFindAll(false)
      debug(`there are ${result.length} records in db`)
    })
    .catch((err) => debug('cron job err: %o', err))
}

const job = new CronJob(cronJobSchedule, sendPendingEmailCronJob)
module.exports = job

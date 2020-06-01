import createDebugger from 'debug'

import mongoInterface from '#root/db/interface'

import MailGun from './MailGun'
import SendGrid from './SendGrid'

const debug = createDebugger('express:mail')

export default class MailSender {
  static async sendEmail(mailDetails) {
    try {
      const mailGunRes = await MailGun.sendEmail(mailDetails)
      debug('MailGun send successfully: status %s, statusText: %s', mailGunRes.status, mailGunRes.statusText)
    } catch (mailGunError) {
      debug('MailGun failed to send: %o', mailGunError.response.statusText)

      try {
        const sendGridRes = await SendGrid.sendEmail(mailDetails)
        debug('SendGrid send successfully: status %s, statusText: %s', sendGridRes.status, sendGridRes.statusText)
      } catch (sendGridError) {
        debug('SendGrid failed to send: %o', sendGridError.response.statusText)

        try {
          await mongoInterface.performInsert(mailDetails, true)
        } catch (dbError) {
          debug('Save mail to db with err: %o', dbError)
        }

        return false
      }
    }

    return true
  }
}

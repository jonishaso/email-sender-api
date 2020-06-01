import axios from 'axios'
import querystring from 'querystring'

import { mailGunDomain, mailGunKey } from '#root/config'

export default class MailGun {
  static async sendEmail({ bcc, cc, subject, text, to }) {
    const body = { from: 'infoFromMailGun <info@tengg.info>', subject, text, to }
    if (bcc) body.bcc = bcc
    if (cc) body.cc = cc

    return await axios.post(`https://api.mailgun.net/v3/${mailGunDomain}/messages`, querystring.stringify(body), {
      auth: {
        username: 'api',
        password: mailGunKey,
      },
    })
  }
}

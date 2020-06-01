import axios from 'axios'

import { sendGridKey } from '#root/config'

export default class SendGrid {
  static async sendEmail({ bcc, cc, subject, text, to }) {
    return await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        content: [
          {
            type: 'text/plain',
            value: text,
          },
        ],
        from: {
          email: 'info@tengg.info',
          name: 'infoFromGrid',
        },
        personalizations: [
          {
            bcc: bcc ? [{ email: bcc }] : null,
            cc: cc ? [{ email: cc }] : null,
            subject,
            to: [
              {
                email: to,
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${sendGridKey}`,
        },
      }
    )
  }
}

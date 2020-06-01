import express from 'express'

import MailSender from '#root/models/MailSender'

const router = express.Router()

router.post('/', async (req, res) => {
  const { bcc, cc, subject, text, to } = req.body
  const sentSuccessfully = await MailSender.sendEmail({ bcc, cc, subject, text, to })

  return res.status(sentSuccessfully ? 200 : 500).end()
})

export default router

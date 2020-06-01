describe('MailSender', () => {
  test('falls back properly', async () => {
    const mailGunSendEmailMock = jest.fn().mockRejectedValue({
      response: { statusText: 'TEST' },
    }) // failing this causes SendGrid to run
    const sendGridSendEmailMock = jest.fn().mockResolvedValue({
      status: 'TEST',
      statusText: 'TEST',
    })

    jest.doMock('./MailGun', () => {
      return {
        default: {
          sendEmail: mailGunSendEmailMock,
        },
        __esModule: true,
      }
    })

    jest.doMock('./SendGrid', () => {
      return {
        default: {
          sendEmail: sendGridSendEmailMock,
        },
        __esModule: true,
      }
    })

    jest.doMock('#root/db/interface', () => {
      return {}
    })

    const MailSender = require('./MailSender').default

    await MailSender.sendEmail('TEST')

    expect(mailGunSendEmailMock).toHaveBeenCalledTimes(1)
    expect(mailGunSendEmailMock).toHaveBeenCalledWith('TEST')
    expect(sendGridSendEmailMock).toHaveBeenCalledTimes(1)
    expect(sendGridSendEmailMock).toHaveBeenCalledWith('TEST')
  })
})

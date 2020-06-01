# api-email

### Description

this server receive front-end form request, and send email to the destination email address.The HTTP request body accept 5 fields: to, subject, cc, bcc, message

### main functionalities

1. Each time, the server receive a post request with email info in json format. The app will construct a Email Class instance for validation. If it was invalid, the server will response with statusCode of 400 and of error message of ‘invalid request’. the email will be send by SendGrid first. If failed to send out, the function will try to send through MailGun. After two tries, if the email should be stored into Mongodb Altas database.

2. There is a crontab worker for resend emails which are stored in database. This worker will fetch emails at once, then resend. If email is sent successfully, this email will be deleted from database.

### Quick Start

1. copy file .env.example to .env under the root directory(`cp ./env.example ./env`);
2. Install dependencies: `yarn install`
3. run server `yarn start`
4. visit, the port is set in .env file, the default port is 3030. View the website at: http://localhost:3030
5. testing: run test `yarn test`
6. setting: change api key, email valid RegEx, enable CronJob, port NO. in .evn or config.js files

### Deployment

#### Use Docker: run commands below under Linux

```bash
cd <project folder>
docker build -t api-email ./
docker run -p 3030:3030 -d api-email
```

Once you do this, it will be accessible at [http://localhost:3030].

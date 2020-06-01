# Email API

## Introduction

This is an email API that acts as an abstraction between two different email service providers. Not only will it failover automatically if one of them fails, but if both fail then it will insert the messages into a Mongo database, with a CRON job scheduled to automatically attempt re-sends.

## Quick Start

1. Copy file `.env.example` to `.env` under the root directory, like so: `cp ./env.example ./env`. Please use the provided credentials for the `.env` file to ensure it works properly.
2. Install dependencies like so: `yarn install`.
3. Start the server `yarn start`, or alternatively `yarn watch` for development mode.
4. View the demo site at [http://localhost:3030](http://localhost:3030).

## Testing

```sh
yarn test
```

## Main Features

1. The server will first attempt to send the email using MailGun; if that fails, it will then try to send the email using SendGrid. If that also fails, then it will store the email inside MongoDB Atlas.
2. There is a CRON worker for resending the emails which are stored inside the MongoDB Atlas database. This worker will fetch all the emails at once, and then attempt to resend. If that email is sent successfully, it will be deleted from database.

## Using Docker

The entire project can be run inside Docker. Please first follow the installation instructions under **Quick Start** above, and then do:

```sh
cd <project folder>
docker build -t api-email ./
docker run -p 3030:3030 -d api-email
```

Once you do this, it will be accessible at [http://localhost:3030](http://localhost:3030).

## Assumptions/Improvements

1. I assumed that not only MailGun and SendGrid will be used, but that other ones can be implemented in the future as well. As such, the code is designed in such a way as to allow more email providers to be integrated easily.
2. I chose MongoDB because it does not have a rigid schema, and as such is easy to use for storing "loose" email data as required by this project.
3. Given more time on this project, I would have added even more thorough testing to the codebase.

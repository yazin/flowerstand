# Virtual Flower Stand

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K72GPJM)

## Development setup (Docker)

### Requirements

Just Docker. Tested on Docker Desktop for Mac 2.4.0.0.

### Database

Rename `mysql/mysql.env.example` to `mysql.env` and specify parameters. See reference below.

### Server-side

Rename `app/.env.example` to `.env` and specify parameters. See reference below.

### Front-end

Noting to do.

### Environmet Variables Reference for Development Environment on Docker

#### mysql.env

- MYSQL_ROOT_HOST
  - Fix to `%`.
- MYSQL_ROOT_PASSWORD
  - You may choose any password for root.
- MYSQL_USER
  - You may choose any username.
- MYSQL_PASSWORD
  - You may choose any password for user.
- MYSQL_DATABASE
  - You may choose any database name.

#### app/.env

- MYSQL_SERVER
  - Fix to `mysql`.
- MYSQL_PORT
  - Fix to `3306`.
- MYSQL_USER
  - Same as `mysql.env`.
- MYSQL_PASSWORD
  - Same as `mysql.env`.
- MYSQL_DATABASE
  - Same as `mysql.env`.
- AWS_ACCESS_KEY_ID
  - Your AWS access key.
- AWS_SECRET_ACCESS_KEY
  - Your aws secret access key.
- AWS_REGION
  - Region of S3 bucket and Rekognition.
- S3_BUCKET
  - S3 bucket name to store flower stand images.
- REKOGNITION_MIN_CONFIDENCE
  - Sensitive image detection level. Read https://docs.aws.amazon.com/rekognition/latest/dg/procedure-moderate-images.html for more information.
- NODE_ENV
  - Fix to `development`.

#### frontend/app/.env.development

- NODE_ENV
  - Fix to 'development'.
- VUE_APP_API_URL
  - Server-side API root URL. No trailing slash.
- VUE_APP_ROOT_URL
  - Front-end root URL. No trailing slash.

### Install packages and initialize Database

```
$ docker-compose run --rm --no-deps app npm install
$ docker-compose run --rm --no-deps web npm install
$ docker-compose up -d
```

Database is automatically synchronized with entities in app/entity on boot app container.

Make sure run `npm install` in containers, not host. Some required modules such as `node-sass` or `fibers` will be natively compiled for platform.

That's all. Access `http://localhost:8080` for test.

## Tech Stacks

### Database

- MySQL
- [TypeORM](https://typeorm.io/)

### Server-side

- [OvernightJs](https://github.com/seanpmaxwell/overnight)
- Express
- Node
- TypeScript

### Front-end

- Vue.js
- Vuetify
- TypeScript

Front-end may not working correctly on some old browsers. I have no plan to support them. For Windows user, let's uninstall IE11 and upgrade Edge to Chromium edition for better world.

### Image Processing

- [Sharp](https://sharp.pixelplumbing.com/)
- AWS Rekognition

## API Spec

[available on SwaggerHub](https://app.swaggerhub.com/apis/yazin/flowerstand/)

## Batch

Use `batch/lambda/clean-preview.js` to cleanup preview images. This code is for AWS Lambda with Node12. Policy `AmazonS3FullAccess` and environment variable `S3_BUCKET` is required.

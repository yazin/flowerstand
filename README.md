# Virtual Flower Stand

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K72GPJM)

## Development setup (Docker)

### Requirements

Just Docker. Tested on Docker Desktop for Mac 2.4.0.0.

### Database

Rename `mysql/mysql.env.example` to `mysql.env` and specify parameters. You may choose any names and passwords.

### Server-side

Rename `app/.env.example` to `.env` and specify parameters. Database related parameters have to match with `mysql.env` created above.

Specify `NODE_ENV=development` for development environment.

### Front-end

Noting to do.

### Install packages and initialize Database

```
$ docker-compose run --rm --no-deps app npm install
$ docker-compose run --rm --no-deps web npm install
$ docker-compose up -d
```

Database is automatically synchronized with entities in app/entity on boot app container.

Make sure run `npm install` in containers, not host. Some required modules such as `node-sass` or `node-gyp` will be natively compiled for platform.

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

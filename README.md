# Virtual Flower Stand

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K72GPJM)

## Document for user

[https://docs.schoolidol.club/flowerstand/](https://docs.schoolidol.club/flowerstand/)

## Development Setup (Docker)

### Requirements

- Docker
- AWS account
- At least 2GB memory for Docker

### Database

Rename `mysql/mysql.env.example` to `mysql.env` and specify parameters. See reference below.

### Serverside

Rename `app/.env.example` to `.env` and specify parameters. See reference below.

### Frontend

Noting to do.

### Environmet Variables Reference for Development Environment on Docker

#### mysql/mysql.env

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
  - Your AWS secret access key.
- AWS_REGION
  - Region of S3 bucket and Rekognition, e.g. `ap-northeast-1`. Both must be in same region.
- S3_BUCKET
  - S3 bucket name to store flower stand images.
- REKOGNITION_MIN_CONFIDENCE
  - Sensitive image detection level. Read https://docs.aws.amazon.com/rekognition/latest/dg/procedure-moderate-images.html for more information.
- NODE_ENV
  - Fix to `development`.

#### frontend/app/.env.development

- VUE_APP_API_URL
  - Serverside API root URL. No trailing slash.
- VUE_APP_ROOT_URL
  - Frontend root URL. No trailing slash.

### S3 Bucket Setup

Public access is needed for S3 bucket. Set Block Public Access to off and use Bucket Policy below:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": [
                "arn:aws:s3:::(PLACE YOUR BUCKET NAME HERE)",
                "arn:aws:s3:::(PLACE YOUR BUCKET NAME HERE)/*"
            ]
        }
    ]
}
```

Then create 2 folders in bucket, `preview` and `public`.

### Install packages and initialize Database

```
$ docker-compose run --rm --no-deps app npm install
$ docker-compose run --rm --no-deps web npm install
$ docker-compose up -d
```

Database is automatically synchronized with entities in app/entity on boot app container.

Make sure run `npm install` in containers, not host. Some required modules such as `node-sass` or `fibers` will be natively compiled for platform.

Now system is running development mode. Access `http://localhost:8080` to test it.

`nginx` container is not needed at this phase. You can comment-out `nginx` service from `docker-compose.yml`.

## Ready for Production

### Configuration

Change `NODE_ENV` in `app/.env` to `production`.

Create `frontend/app/.env.production` and specify URLs like:

```
VUE_APP_API_URL=http://localhost/api
VUE_APP_ROOT_URL=http://localhost
```

### Build

```
$ docker-compose run --rm --no-deps app npm run build
$ docker-compose run --rm --no-deps web npm run build:prod
```

### Run

Change `app` container's `command` in `docker-compose.yml` from

```
    command: npm run dev:watch
```

to

```
    command: npm run start
```

then

```
$ docker-compose up -d
```

Now system is running on production mode. Access `http://localhost` to test it.

`web` container is not needed at this phase. You can comment-out `web` service from `docker-compose.yml`.

## Tech Stacks

### Database

- MySQL
- [TypeORM](https://typeorm.io/)

### Serverside

- [OvernightJs](https://github.com/seanpmaxwell/overnight)
- Express
- Node
- TypeScript

### Frontend

- Vue.js
- Vuetify
- TypeScript

Frontend may not working correctly on some old browsers. I have no plan to support them. For Windows user, let's uninstall IE11 and upgrade Edge to Chromium edition for better world.

### Image Processing

- [Sharp](https://sharp.pixelplumbing.com/)
- Amazon Rekognition

## API Spec

[available on SwaggerHub](https://app.swaggerhub.com/apis/yazin/flowerstand/)

## Batch

Use `batch/lambda/clean-preview.js` to cleanup preview images. This code is for AWS Lambda with Node12. Policy `AmazonS3FullAccess` and environment variable `S3_BUCKET` is required.

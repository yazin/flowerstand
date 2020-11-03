# Virtual Flower Stand

## Development setup (Docker)

### Requirements

Just Docker. Tested on Docker Desktop for Mac 2.4.0.0.

### Database

Rename `mysql/mysql.env.example` to `mysql.env` and specify parameters. You may choose any names and passwords.

### Server-side

Rename `app/app.env.example` to `app.env` and specify parameters. Database related parameters have to match with `mysql.env` created above.

Specify `NODE_ENV=development` for development environnment.

### Front-end

Nothing to do for development.

### Install packages and initialize Database

```
$ docker-compose run --rm app npm install
$ docker-compose run --rm web npm install
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

## API

[available on SwaggerHub](https://app.swaggerhub.com/apis/uranohoshi-se/flowerstand/1.0.0)

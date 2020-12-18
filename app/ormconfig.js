const commonConfig = {
  name: 'default',
  type: 'mysql',
  host: process.env.MYSQL_SERVER,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false
};

const tsConfig = {
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts']
};

const jsConfig = {
  entities: ['dist/entity/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js']
}

if (process.env.TS_NODE) {
  module.exports = [{...commonConfig, ...tsConfig}];
} else {
  module.exports = [{...commonConfig, ...jsConfig}];
}

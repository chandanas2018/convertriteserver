'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')

const config = require("../config/Configuration");

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be good choice under development
  | environment.
  |
  | npm i --save sqlite3
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
    },
    useNullAsDefault: true
  },

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    }
  },

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
    client: 'pg',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    }
  },

  oracledb: {
    client: 'oracledb',
    connection: {
      host: config.getConfigValueByKey("StagingConn").host,//Env.get('DB_HOST', 'localhost'),
     // port: config.getConfigValueByKey("StagingConn").port,//Env.get('DB_PORT', ''),
      user: config.getConfigValueByKey("StagingConn").user,//Env.get('DB_USER', ''),
      password: config.getConfigValueByKey("StagingConn").password,//Env.get('DB_PASSWORD', ''),
      database: config.getConfigValueByKey("StagingConn").database//Env.get('DB_DATABASE', 'adonis')
      
    }
  },

  ebsoracledb: {
    client: 'oracledb',
    Connection: {
      host: config.getConfigValueByKey("ebsDbConn").host,
      //port:config.getConfigValueByKey("ebsDbConn").port,
      user: config.getConfigValueByKey("ebsDbConn").user,
      password: config.getConfigValueByKey("ebsDbConn").password,
      database: config.getConfigValueByKey("ebsDbConn").database
      
    }
  }
}

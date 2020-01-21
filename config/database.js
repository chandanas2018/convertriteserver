'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
 const Env = use('Env')
const config = require('../app/Models/Configuration')


/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')

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

  //connection:config.getConfigurationValueByKey( 'key','stagingDbConnection'),

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

  // oracledb: {
  //   client: 'oracledb',
  //   connection: {
  //     host: Env.get('DB_HOST', 'localhost'),
  //     port: Env.get('DB_PORT', ''),
  //     user: Env.get('DB_USER', ''),
  //     password: Env.get('DB_PASSWORD', ''),
  //     database: Env.get('DB_DATABASE', 'adonis')
      
  //   }
  // },


  oracledb: {
    client: 'oracledb',
    connection: {
      host: config.getConfigurationValueByKey('host', 'stagingDbConnection'),
      user: config.getConfigurationValueByKey('user', 'stagingDbConnection'),
      password: config.getConfigurationValueByKey('password', 'stagingDbConnection'),
      database: config.getConfigurationValueByKey('database', 'stagingDbConnection')
      
    }
  }
  
  
  
  // oracledb: {
  //   client: 'oracledb',
  //   connection: {
  //     host: '172.16.0.55',
  //     port: '1523',
  //     user: 'CONVERSION_TOOL_TEST_DB',
  //     password: 'inlightdata123',
  //     database: 'EBSFSD'
      
  //   }
  // }
}

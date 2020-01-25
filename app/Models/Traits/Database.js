'use strict'

class Database {
  // register (Model, customOptions = {}) {
  //   const defaultOptions = {}
  //   const options = Object.assign(defaultOptions, customOptions)
  // }
  register(Model){
    Object.defineProperty(Model, 'connection',{
     get: () =>{
     return this.connection
     },
     set: connection =>{
     this.connection = connection;
     }
    })

    Model.addHook()
  }
}

module.exports = Database

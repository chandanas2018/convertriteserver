'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

 
class Error  {
    constructor(){
       this.errorArray = [
            {errorCode : 1, errorNum : "12170", errMsg : "TNS No Listner Connect Timeout Occured"},
            {errorCode : 2, errorNum  : "904", errMsg : "Invalid Identifier"},
            {errorCode : 3, errorNum  : "14101", errMsg : "Inserted value to large for column"},
            {errorCode : 4, errorNum  : "1418", errMsg: "Specified Index does not exists"}
        
        ]
    }
     
    
     errorsList(){
     return this.errorArray;
    }
           
    
}

module.exports = Error

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ErrorManager  {


    //static em = new Errormanager();

    constructor() {
    
        console.log("In constructor")
        this.reset();


    }
    addError(message, ruleinfo, ruleid){
       console.log('error1')
       this.errors.push({date: new Date().toUTCString(), message: message, rule: ruleinfo, id:ruleid})
    }
    addWarnings(message, ruleinfo, ruleid){
        console.log('warn1')
        this.warnings.push({date: new Date().toUTCString(), message: message, rule: ruleinfo, id:ruleid})
    }
    addInfo(message, ruleinfo, ruleid){
        console.log('info1')
        this.info.push({date: new Date().toUTCString(), message: message, rule: ruleinfo, id:ruleid})
    }
    reset(){
        console.log('hello')
        this.errors = [];
        this.warnings = [];
        this.info = [];
    }
    getStatus(){
        console.log('status')
        return {errors: this.errors, warnings: this.warnings, info: this.info }
    }
}


module.exports = ErrorManager

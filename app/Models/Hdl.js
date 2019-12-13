'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Hdl extends Model {
    
    
    static formatDates (field, value) {
        if (field === formats) {
          return value.format('YYYY-MM-DD')
        }
        return super.formatDates(field, value)
    }
    static get dates () {
        return super.dates.concat([formats])
      }
}


module.exports = Hdl

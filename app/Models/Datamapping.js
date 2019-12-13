'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Datamapping extends Model {
    static formatDates (field, value) {
        if (field === 'TRANSACTION_DATE') {
          return value.format('DD-MMM-YYYY')
        }
        return super.formatDates(field, value)
    }
    static get dates () {
        return super.dates.concat(['TRANSACTION_DATE'])
      }
}

module.exports = Datamapping

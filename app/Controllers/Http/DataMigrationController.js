'use strict'
const Database = use('Database')

class DataMigrationController {

    async Bloodgroup({ request, response, error }) {
        try {
            
            let bloodgroup = await Database.select('*').from('BLOOD_TYPE');
            console.log(bloodgroup);
            return response.status(200).send({ success: true, data: bloodgroup, msg: 'Successfully get the list', error: null });

        }
        catch (error) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the list', error: error });
        }
    }

}

module.exports = DataMigrationController

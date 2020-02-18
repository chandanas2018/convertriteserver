'use strict'

const Database = use('Database');

const date = new Date();

class EntitymappingController {

    //get service to display source entity names (Table names)

    async sourceEntities({ request, response, error }) {
        try {
            var sourcentities = await Database.connection('oracledb').select('*').from('PROJECT_SOURCE_ENTITY_LIST');
            console.log(sourcentities);
            return response.status(200).send({ success: true, data: sourcentities, msg: 'Successfully get the entity list', err: null });
            //return response.json(entities)
        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the details', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);

        // }
    }

    //get service to display source entity field names

    async sourceEntityFields({ request, response, error }) {
        try {
            var data = request.body;
            //select the source fields which having identification status is checked and column status is true
            let qry = await Database.connection('oracledb').select('COLUMN_ID', 'COLUMN_NAME', 'DISPLAY_NAME', 'IS_MANDATORY')
                .from('PROJ_ENTITY_IDENTIFICATION').where({ 'ENTITY_ID': data.id, 'IDENTIFICATION_STATUS': 'CHECKED', 'COLUMN_STATUS': 'TRUE' });
            console.log(qry);
            return response.status(200).send({ success: true, data: qry, msg: 'Successfully get the entity  column list', err: null });

        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the details', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);

        // }
    }

    //get service to display destination entity names
    async destEntities({ request, response, error }) {
        try {
            var destentities = await Database.connection('oracledb').select('*').from('PROJ_DATATYPE_ENTITY_LIST');
            console.log(destentities);
            return response.status(200).send({ success: true, data: destentities, msg: 'Successfully get the list', error: null });
        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the details', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);
        // }
    }


    //get service to display destination entity column list
    async destEntityFields({ request, response, error }) {
        try {
            var data = request.body;
            let qry = await Database.connection('oracledb').select('COLUMN_ID', 'COLUMN_NAME')
                .from('PROJ_DATATYPE_ENTITY_COLUMNS').where('DEST_ENTITY_ID', data.id);
            console.log(qry);
            return response.status(200).send({ success: true, data: qry, msg: 'Successfully get the entity  column list', err: null });

        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the details', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);
        // }
    }


    //to save the field mappings
    async mappingFields({ request, response, error }) {
        try {
            var data = request.body;

            let qry = await Database.connection('oracledb').insert({
                PROJECT_ID: data.projectid,
                SOURCE_ENTITY_ID: data.sourceentityid,
                SOURCE_ENTITY_NAME: data.sourceentityname,
                SOURCE_COLUMN_ID: data.sourcecolumnid,
                SOURCE_COLUMN_NAME: data.sourcecolumnnameoriginal,
                DISPLAY_NAME: data.sourcecolumnname,
                DESTINATION_ENTITY_ID: data.destinationentityid,
                DESTINATION_ENTITY_NAME: data.destinationentityname,
                DESTINATION_COLUMN_ID: data.destinationcolumnid,
                DESTINATION_COLUMN_NAME: data.destinationcolumnname
            }).into('PROJ_COLUMN_MAPPING');
            console.log(qry);

            //for maintaining  user log
            let qry2 = await Database.connection('oracledb').select('PROJECT_CREATED_BY').from('LIST_OF_PROJECTS').where('PROJECT_ID', data.projectid);
            console.log(qry2);
            let qry3 = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST').where('ENTITY_ID', data.sourceentityid);
            console.log(qry3);
            let transactions = await Database.connection('oracledb').insert({
                PROJECT_ID: data.projectid,
                TRANSACTION_DATE: date,
                ENTITIY_ACCESSED: qry3[0].ENTITY_NAME,
                TRANSACTION_STATUS: 'Entity mapping fields',
                TRANSACTION_PERFORMED_BY: qry2[0].PROJECT_CREATED_BY
            }).into('PROJECT_TRANSACTIONS');
            console.log(transactions);
            return response.status(200).send({ success: true, data: qry, msg: 'succesful mapping fields', err: null });
        }
        catch (error) {
            console.log(error);
            return response.status(400).send({ success: false, data: null, msg: 'Error while getting the mapping fields', err: error });
        }
        // finally {
        //     Database.close(['oracledb']);
        // }
    }

    //to get the list of map fields
    async listofMapfeilds({ request, response, error }) {
        try {
            var data = request.body;
            let mapfields = await Database.connection('oracledb').select('*').from('PROJ_COLUMN_MAPPING')
                .where('SOURCE_ENTITY_ID', data.sourceentityid);
            console.log(mapfields);
            return response.status(200).send({ success: true, data: mapfields, msg: 'Successfully get the fields', err: null });
        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while getting the fields', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);
        // }
    }

    //to delete all  mapped fields using source entity id
    async removeMappedFields({ request, response, error }) {
        try {
            var data = request.body;
            let deletedfields = await Database.connection('oracledb').table('PROJ_COLUMN_MAPPING')
                .where('SOURCE_ENTITY_ID', data.sourceentityid).delete();
            console.log(deletedfields);

            let deleteddatamappings = await Database.connection('oracledb').table('PROJ_DATA_MAPPINGS')
                .where('SOURCE_ENTITY_ID', data.sourceentityid).delete();
            console.log(deleteddatamappings);

            //for maintaining  user log -->(projectid hard code)
            let qry2 = await Database.connection('oracledb').select('PROJECT_CREATED_BY').from('LIST_OF_PROJECTS').where('PROJECT_ID', 2);
            console.log(qry2);
            let qry3 = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST').where('ENTITY_ID', data.sourceentityid);
            console.log(qry3);
            let transactions = await Database.insert({
                PROJECT_ID: 2,
                TRANSACTION_DATE: date,
                ENTITIY_ACCESSED: qry3[0].ENTITY_NAME,
                TRANSACTION_STATUS: 'Removing entity mapping fields ',
                TRANSACTION_PERFORMED_BY: qry2[0].PROJECT_CREATED_BY
            }).into('PROJECT_TRANSACTIONS');
            console.log(transactions);
            return response.status(200).send({ success: true, data: deletedfields, msg: 'Successfully delete the fields', err: null });
        }
        catch (err) {
            console.log(err);
            return response.status(400).send({ success: false, data: null, msg: 'Error while deleting the fields', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);
        // }
    }

    //to delete individual mapped field
    async deleteIndividualMappedField({ request, response, error }) {
        try {
            var data = request.body;
            let deletedfield = await Database.connection('oracledb').table('PROJ_COLUMN_MAPPING')
                .where({
                    'SOURCE_ENTITY_ID': data.sourceentityid,
                    'DISPLAY_NAME': data.sourcecolumnname,
                    'DESTINATION_COLUMN_NAME': data.destinationcolumnname
                })
                .delete();
            console.log(deletedfield);
            return response.status(200).send({ success: true, data: deletedfield, msg: 'Successfully delete the fields', err: null });
        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while deleting the fields', error: err });
        }
        // finally {
        //     Database.close(['oracledb']);
        // // }
    }



}

module.exports = EntitymappingController

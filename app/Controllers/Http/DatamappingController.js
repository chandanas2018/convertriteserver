'use strict'

const Database = use('Database');

const date = new Date();

class DatamappingController {
    //for entity column identification screen
    async identificationColumnList({ request, response, error }) {
        try {
            var data = request.body;
            let identifications = await Database.connection('oracledb').select('IDENTIFICATION_STATUS', 'COLUMN_ID', 'COLUMN_NAME', 'DISPLAY_NAME').from('PROJ_ENTITY_IDENTIFICATION')
                .where('ENTITY_ID', data.entityid);
            console.log(identifications);
            Database.close(['oracledb']);
            return response.status(200).send({ success: true, data: identifications, msg: 'Successfully get the list', error: null });

        }
        catch (error) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the list', error: error });
        }
        // finally{
        //     Database.close(['oracledb']);
        //   }
    }


    // //to update the display names for identification entity column name
    async updateIdentificationColumnList({ request, response, error }) {
        try {
            var data1 = request.body;
            var checked = [];
            var unchecked = [];
            for (var i = 0; i < data1.data.length; i++) {
                let qry = await Database.connection('oracledb').table('PROJ_ENTITY_IDENTIFICATION').where({ 'COLUMN_ID': data1.data[i].COLUMN_ID })
                    .update({ 'DISPLAY_NAME': data1.data[i].DISPLAY_NAME, 'IDENTIFICATION_STATUS': data1.data[i].IDENTIFICATION_STATUS });
                console.log(qry);
                checked.push(qry);
            }
            for (var i = 0; i < data1.unchecked.length; i++) {
                let qry = await Database.connection('oracledb').table('PROJ_ENTITY_IDENTIFICATION').where({ 'COLUMN_ID': data1.unchecked[i].COLUMN_ID })
                    .update({ 'DISPLAY_NAME': data1.unchecked[i].COLUMN_NAME, 'IDENTIFICATION_STATUS': data1.unchecked[i].IDENTIFICATION_STATUS });
                console.log(qry);
                unchecked.push(qry);
            }
            //to delete the unchecked mapping 
            let fieldmappings = await Database.connection('oracledb').select('*').from('PROJ_COLUMN_MAPPING');
            console.log(fieldmappings);

            for (var i = 0; i < data1.unchecked.length; i++) {
                for (var j = 0; j < fieldmappings.length; j++) {
                    if (data1.unchecked[i].COLUMN_NAME == fieldmappings[j].SOURCE_COLUMN_NAME) {

                        let deletemapping = await Database.connection('oracledb').table('PROJ_COLUMN_MAPPING')
                            .where('SOURCE_COLUMN_ID', fieldmappings[j].SOURCE_COLUMN_ID).delete();
                        console.log(deletemapping);
                    }
                    else {
                        console.log(error);
                    }
                }


            }
          
            return response.status(200).send({ success: true, data: checked, msg: 'Successfully update the data', err: null });
        }
        catch (error) {
            console.log(error);
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the data', err: error });
        }
        // finally{
        //     Database.close(['oracledb']);
        //   }
    }



    /*1. destination and master data for selected column mappings
    2.To display the destination data based on column name in 
    proj_datatype_entity_columns(destination column)
     */
    async masterdataList({ request, response, error }) {
        try {
            var data1 = request.body;
           
            //first to get the entity name from entityid 
            // let entityname = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST')
            //     .where('ENTITY_ID', data1.data.SOURCE_ENTITY_ID);
            // console.log(entityname);
            // let sourcedata = await Database.connection('oracledb').raw('SELECT DISTINCT ' + data1.data.SOURCE_COLUMN_NAME + ' AS SOURCE_DATA_NAME  from ' + entityname[0].ENTITY_NAME +  ' where ' +  data1.data.SOURCE_COLUMN_NAME + ' IS NOT NULL ');
            // console.log(sourcedata);


             //to get the source data for source column mapped value
             let sourcedata = await Database.connection('oracledb').raw("SELECT DISTINCT flv.lookup_code as lookupcode, flv.lookup_type as lookuptype, flv.meaning as lookupmeaning " 
             + " FROM APPS.fnd_lookup_values flv, APPS.fnd_lookup_types flt " + ' WHERE flt.LOOKUP_TYPE = ' + "'" + data1.data.SOURCE_COLUMN_NAME + "'"
             +  " and flt.lookup_type = flv.lookup_type and flv.language ='US'")
              console.log(sourcedata);



            //to get the destination mapping data for dest mapped column
            let destinationdata = await Database.connection('oracledb').select('*').from(data1.data.DESTINATION_COLUMN_NAME)
            console.log(destinationdata);
    
            response.status(200).send({ success: true, data: { destdata: destinationdata, srcdata: sourcedata }, msg: 'Successfully get the list', error: null });
        }
        catch (error) {
            console.log(error)
            response.status(400).send({ success: false, data: null, msg: 'Successfully get the list', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        //   }
    }


    //to save datamappings 
    async saveDataMappings({ request, response, error }) {
        try {
            var data = request.body;
            let datamappings = await Database.connection('oracledb').insert({
                PROJECT_ID: data.projectid,
                SOURCE_ENTITY_ID: data.sourceentityid,
                SOURCE_COLUMN_ID: data.remainingdata.SOURCE_COLUMN_ID,
                SOURCE_COLUMN_NAME: data.remainingdata.SOURCE_COLUMN_NAME,
                DESTINATION_COLUMN_ID: data.remainingdata.DESTINATION_COLUMN_ID,
                DESTINATION_COLUMN_NAME: data.remainingdata.DESTINATION_COLUMN_NAME,
                SOURCE_DATA: data.sourcedataname,
                DESTINATION_DATA: data.destinationdataname
            }).into('PROJ_DATA_MAPPINGS');
            console.log(datamappings);

            //for maintaining  user log
            let qry2 = await Database.connection('oracledb').select('PROJECT_CREATED_BY').from('LIST_OF_PROJECTS').where('PROJECT_ID', data.projectid);
            console.log(qry2);
            let qry3 = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST').where('ENTITY_ID', data.sourceentityid);
            console.log(qry3);
            let transactions = await Database.insert({
                PROJECT_ID: data.projectid,
                TRANSACTION_DATE: date,
                ENTITIY_ACCESSED: qry3[0].ENTITY_NAME,
                TRANSACTION_STATUS: 'Data mapping fields',
                TRANSACTION_PERFORMED_BY: qry2[0].PROJECT_CREATED_BY
            }).into('PROJECT_TRANSACTIONS');
            console.log(transactions);
            
            return response.status(200).send({ success: true, data: datamappings, msg: 'Successfully inserted ', error: null });
        }
        catch (error) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while inserting the data', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        // }
    }


    //to get list of mappings
    async listofDataMappings({ request, response, error }) {
        try {
            var data = request.body;
            let datafields = await Database.connection('oracledb').select('*').from('PROJ_DATA_MAPPINGS')
                .where('SOURCE_ENTITY_ID', data.sourceentityid);
            console.log(datafields);  
            return response.status(200).send({ success: true, data: datafields, msg: 'Successfully get the fields', err: null });
        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while getting the fields', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        // }
    }

    //to delete individual data mappings
    async deleteIndividualDataMapping({ request, response, error }) {
        try {
            var data = request.body;
            let deleteddatafield = await Database.connection('oracledb').table('PROJ_DATA_MAPPINGS')
                .where({
                    'SOURCE_ENTITY_ID': data.sourceentityid,
                    'SOURCE_DATA': data.sourcedataname,
                    'DESTINATION_DATA': data.destinationdataname
                })
                .delete();
            console.log(deleteddatafield);          
            return response.status(200).send({ success: true, data: deleteddatafield, msg: 'Successfully delete the fields', err: null });
        }
        catch (err) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while deleting the fields', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        // }
    }


    //to delete all  mapped fields using source entity id
    async removeDataMappings({ request, response, error }) {
        try {
            var data = request.body;

            let deleteddatamappings = await Database.connection('oracledb').table('PROJ_DATA_MAPPINGS')
                .where('SOURCE_ENTITY_ID', data.sourceentityid).delete();
            console.log(deleteddatamappings);

            //for maintaining user log
            let qry2 = await Database.select('PROJECT_CREATED_BY').from('LIST_OF_PROJECTS').where('PROJECT_ID', 2);
            console.log(qry2);
            let qry3 = await Database.select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST').where('ENTITY_ID', data.sourceentityid);
            console.log(qry3);
            let transactions = await Database.insert({
                PROJECT_ID: 2,
                TRANSACTION_DATE: date,
                ENTITIY_ACCESSED: qry3[0].ENTITY_NAME,
                TRANSACTION_STATUS: ' Remove data mapping fields',
                TRANSACTION_PERFORMED_BY: qry2[0].PROJECT_CREATED_BY
            }).into('PROJECT_TRANSACTIONS');

            console.log(transactions);
           

            return response.status(200).send({ success: true, data: deleteddatamappings, msg: 'Successfully delete the fields', err: null });
        }
        catch (err) {
            console.log(err);
            return response.status(400).send({ success: false, data: null, msg: 'Error while deleting the fields', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        // }
    }


    //format to download excel template  in data mapping screen 
    async excelDownloadTemplate({ request, response, error }) {
        try {
            var data1 = [];
            var data = request.body;
            let mappings = await Database.connection('oracledb').select('DISPLAY_NAME', 'SOURCE_COLUMN_NAME', 'DESTINATION_COLUMN_NAME').from('PROJ_COLUMN_MAPPING')
                            .where('SOURCE_ENTITY_ID', data.entityid);
            console.log(mappings);
            let qry1 = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST').where('ENTITY_ID', data.entityid);
            console.log(qry1);

            for (var i = 0; i < mappings.length; i++) {
                let qry2 = await Database.connection('oracledb').select('DEST_DATA_NAME').from(mappings[i].DESTINATION_COLUMN_NAME);
                console.log(qry2);
                let qry3 = await Database.connection('oracledb').raw('SELECT DISTINCT ' + mappings[i].SOURCE_COLUMN_NAME + ' AS SOURCE_DATA_NAME from ' + qry1[0].ENTITY_NAME);
                console.log(qry3); 

                var mappeddata = {
                    sourcecolumnname: mappings[i].SOURCE_COLUMN_NAME,
                    destinationcolumnname: mappings[i].DESTINATION_COLUMN_NAME,
                    displayname: mappings[i].DISPLAY_NAME,
                    sourcedata: qry3,
                    destinationdata: qry2
                }
                data1.push(mappeddata);
            }
            console.log(data1);      
            return response.status(200).send({ success: true, data: data1, msg: 'Successfully get the list', error: null });
        }
        catch (err) {
            console.log(err);
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the list', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        // }
    }


    //format to upload excel template in data mapping screen
    async excelUploadTemplate({ request, response, error }) {
        try {

            var data = request.body;

            for (let i = 0; i < data.mappings.length; i++) {

                var sourceColumnName = request.body.mappings[1].sheetName.split('-')[0];
                var desColumnName = request.body.mappings[1].sheetName.split('-')[1];

                for (let j = 0; j < data.mappings[i].data.length; j++) {

                    // for(let k=0; k<data.mappings[i].data[j].length; k++){
                    if (data.mappings[i].data[j].sourceData !== "" && data.mappings[i].data[j].desData !== "") {

                        let datamappings = await Database.connection('oracledb').insert({
                            PROJECT_ID: 2,
                            SOURCE_ENTITY_ID: 1,
                            SOURCE_COLUMN_NAME: sourceColumnName,
                            DESTINATION_COLUMN_NAME: desColumnName,
                            SOURCE_DATA: data.mappings[i].data[j].sourceData,
                            DESTINATION_DATA: data.mappings[i].data[j].desData
                        }).into('PROJ_DATA_MAPPINGS');
                        console.log(datamappings);
                       
                    } else {

                        console.log('not found');

                    }
                    // }

                }

            }


            console.log(data);
            return response.status(200).send({ success: true, data: 'datamappings', msg: 'Successfully get the list', error: null });
        }
        catch (err) {
            console.log(err);
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the list', error: err });
        }
        // finally{
        //     Database.close(['oracledb']);
        // }
    }



    //to display the source data based on the source column name
    // async sourcedata({ request, response, error }) {
    //     try {
    //to get column name from proj_datatype_entity_columns
    // var name = await Database.select('COLUMN_NAME').from('PROJ_DATATYPE_ENTITY_COLUMNS')
    // .where('COLUMN_NAME' , data1.data.DESTINATION_COLUMN_NAME);
    // console.log(name);
    //to get the destination data for selected dest column mapped value
    // var table =  'DEST' + '_' + data1.data.DESTINATION_ENTITY_NAME;
    // console.log(table);
    //         var data = request.body;
    //         //select source column id from project_source_entity_column_list table
    //         let sourcecolumnid = await Database.select('COLUMN_ID').from('PROJ_SOURCE_ENTITY_COLUMN_LIST')
    //             .where('COLUMN_NAME', data.sourcecolumnname);
    //         console.log(sourcecolumnid);
    //         let sourcedata = await Database.select('*').from('SOURCE_MASTER_DATA')
    //             .where('COLUMN_ID', sourcecolumnid);
    //         console.log(sourcedata);
    //         return response.status(200).send({success:true, data:sourcedata, msg:"Successfully get the data", err:null})
    //     }
    //     catch (error) {
    //         return response.status(400).send({success:false, data:null, msg:"Error while get the data", err:error})
    //     }
    // }



}

module.exports = DatamappingController

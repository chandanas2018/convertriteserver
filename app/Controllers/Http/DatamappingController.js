'use strict'

const Database = use('Database');

const date = new Date();

class DatamappingController {
    //for entity column identification screen
    async identificationColumnList({ request, response, error }) {
        try {
            var data = request.body;
            var project_id = request.header('Project_Id');
            let identifications = await Database.connection('oracledb').select('IDENTIFICATION_STATUS', 'COLUMN_ID', 'COLUMN_NAME', 'DISPLAY_NAME', 'IS_MANDATORY', 'IS_MULTISELECT').from('PROJ_ENTITY_IDENTIFICATION')
                .where('ENTITY_ID', data.entityid).where('PROJECT_ID',project_id).orderBy('IS_MANDATORY', 'desc');
            console.log(identifications);
            Database.close(['oracledb']);
            return response.status(200).send({ success: true, data: identifications, msg: 'Successfully get the list', error: null });

        }
        catch (error) {
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the list', error: error });
        }
        //    finally {
        //         Database.close(['oracledb']);
        //       }
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
            var SourceData = [];
            var DestinationData = [];

            //first to get the entity name from entityid 
            // let entityname = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST')
            //     .where('ENTITY_ID', data1.data.SOURCE_ENTITY_ID);
            // console.log(entityname);
            // let sourcedata = await Database.connection('oracledb').raw('SELECT DISTINCT ' + data1.data.SOURCE_COLUMN_NAME + ' AS SOURCE_DATA_NAME  from ' + entityname[0].ENTITY_NAME +  ' where ' +  data1.data.SOURCE_COLUMN_NAME + ' IS NOT NULL ');
            // console.log(sourcedata);

            //TODO REFACTOR AFTER THE DEMO
            if (data1.data.SOURCE_COLUMN_NAME == "LOCATIONCODE") {
                var sourcedata = await Database.connection('oracledb').raw("SELECT DISTINCT hlat.location_id as source_data_id, hlat.location_code as source_data_code,"
                    + " hlat.description as source_data_name FROM apps.hr_locations_all_tl hlat, apps.hr_locations_all hla, apps.hr_location_info_types hlit, apps.HR_LOCATION_EXTRA_INFO hlei"
                    + " WHERE hlat.description IS NOT NULL " + "AND hla.location_id = hlei.location_id " + " AND hlat.location_id = hla.location_id " + " AND hla.country = 'US' " + "and hlei.information_type = hlit.information_type");
                console.log(sourcedata);
                SourceData = sourcedata;
            }
            else if (data1.data.SOURCE_COLUMN_NAME == "JOBCODE") {
                var sourcedata = await Database.connection('oracledb').raw("SELECT DISTINCT b.job_id as source_data_code, TO_CHAR(b.date_from,'YYYY/MM/DD') as EffectiveStartDate,"
                    + " t.name as source_data_name FROM apps.per_jobs b, apps.per_jobs_tl t " + " WHERE t.job_id = b.job_id  AND t.language = 'US' AND b.business_group_id = 202");
                console.log(sourcedata);
                SourceData = sourcedata;
            }
            else if (data1.data.SOURCE_COLUMN_NAME == "DEPARTMENT_NAME") {
                var sourcedata = await Database.connection('oracledb').raw("SELECT TO_CHAR(o.DATE_FROM,'YYYY/MM/DD') as EffectiveStartDate, otl.organization_id as source_data_code, otl.name as source_data_name "
                    + " FROM apps.hr_all_organization_units o, apps.hr_all_organization_units_tl otl " + "WHERE 1=1  AND o.organization_id = otl.organization_id " + " AND otl.language = 'US' AND TYPE ='DEP' "
                    + " and o.business_group_id = 202 ");
                console.log(sourcedata);
                SourceData = sourcedata;

            }
            else if(data1.data.SOURCE_COLUMN_NAME == "GRADECODE"){
                var sourcedata = await Database.connection('oracledb').raw("SELECT TO_CHAR(pg.date_from,'YYYY/MM/DD') as datefrom,pg.grade_id as source_data_code, gdt.name as source_data_name "
                + " FROM per_grades_tl gdt, per_grades pg " + " WHERE gdt.grade_id  = pg.grade_id AND  gdt.language (+) = 'US' " + "And  pg.business_group_id = 202 ");
            console.log(sourcedata);
            SourceData = sourcedata;
            }
            else if(data1.data.SOURCE_COLUMN_NAME == "SALARY_BASIS_NAME"){
                var sourcedata = await Database.connection('oracledb').raw("SELECT DISTINCT salary_basis_name as source_data_name from source_salary");
            console.log(sourcedata);
            SourceData = sourcedata;
            }
            else {
                var sourcedata = await Database.connection('oracledb').raw("SELECT DISTINCT flv.lookup_code as source_data_id, flv.lookup_type as source_data_code, flv.meaning as source_data_name "
                    + " FROM APPS.fnd_lookup_values flv,APPS.fnd_lookup_types flt" + " WHERE flt.LOOKUP_TYPE ='" + data1.data.SOURCE_COLUMN_NAME + "'and flt.lookup_type = flv.lookup_type and flv.language ='US'");
                console.log(sourcedata);
                SourceData = sourcedata;
            }

            //to get the destination mapping data for dest mapped column
            //  TODO REFACTOR AFTER THE DEMO
            if (data1.data.DESTINATION_COLUMN_NAME == "LOCATIONCODE") {
                data1.data.DESTINATION_COLUMN = 'Locations'
                var destinationdata = await Database.connection('oracledb').raw("select  location_id , location_code as DEST_DATA_ID , location_name as DEST_DATA_NAME from "
                    + data1.data.DESTINATION_COLUMN + " where country = 'US'");
                console.log(destinationdata);
                DestinationData = destinationdata;
            }
            else if (data1.data.DESTINATION_COLUMN_NAME == "JOBCODE") {
                data1.data.DESTINATION_COLUMN = 'jobs'
                var destinationdata = await Database.connection('oracledb').raw("select  jobid , jobcode as DEST_DATA_ID , job_name as DEST_DATA_NAME from "
                    + data1.data.DESTINATION_COLUMN);
                console.log(destinationdata);
                DestinationData = destinationdata;
            }
            else if (data1.data.DESTINATION_COLUMN_NAME == "DEPARTMENT_NAME") {
                data1.data.DESTINATION_COLUMN = 'departments'
                var destinationdata = await Database.connection('oracledb').raw("select name as DEST_DATA_NAME, organizationid as DEST_DATA_ID from  " + data1.data.DESTINATION_COLUMN  + 
                " d inner join  locations l on d.locationid = l.location_id where l.country = 'US' ")
                console.log(destinationdata);
                DestinationData = destinationdata;

            }
            else if (data1.data.DESTINATION_COLUMN_NAME == "GRADECODE") {
                data1.data.DESTINATION_COLUMN = 'grades'
                var destinationdata = await Database.connection('oracledb').raw("select gradeid, grade_code as DEST_DATA_ID, gradename as DEST_DATA_NAME from "
                 + data1.data.DESTINATION_COLUMN );
                console.log(destinationdata);
                DestinationData = destinationdata;

            }
            else if (data1.data.DESTINATION_COLUMN_NAME == "SALARY_BASIS_NAME") {
                data1.data.DESTINATION_COLUMN = 'salarybasis'
                var destinationdata = await Database.connection('oracledb').raw("select salarybasisname as DEST_DATA_NAME from "
                 + data1.data.DESTINATION_COLUMN );
                console.log(destinationdata);
                DestinationData = destinationdata;

            }
            else {
                var destinationdata = await Database.connection('oracledb').select('*').from(data1.data.DESTINATION_COLUMN_NAME)
                console.log(destinationdata);
                DestinationData = destinationdata;
            }


            response.status(200).send({ success: true, data: { destdata: DestinationData, srcdata: SourceData }, msg: 'Successfully get the list', error: null });
        }
        catch (error) {
            console.log(error)
            response.status(400).send({ success: false, data: null, msg: 'Successfully get the list', error: error });
        }
        // finally{
        //     Database.close(['oracledb']);
        //   }
    }


    //to save datamappings 
    async saveDataMappings({ request, response, error }) {
        try {
            var data = request.body;

            var dataMappings = [];
            //Todo refactor after the demo
            if (data.remainingdata.SOURCE_COLUMN_NAME === "LOCATIONCODE" || 
                data.remainingdata.SOURCE_COLUMN_NAME === "JOBCODE"||
                data.remainingdata.SOURCE_COLUMN_NAME === "GRADECODE" ||
                data.remainingdata.SOURCE_COLUMN_NAME === "DEPARTMENT_NAME") {
                let datamappings = await Database.connection('oracledb').insert({
                    PROJECT_ID: data.projectid,
                    SOURCE_ENTITY_ID: data.sourceentityid,
                    SOURCE_COLUMN_ID: data.remainingdata.SOURCE_COLUMN_ID,
                    SOURCE_COLUMN_NAME: data.remainingdata.SOURCE_COLUMN_NAME,
                    DESTINATION_COLUMN_ID: data.remainingdata.DESTINATION_COLUMN_ID,
                    DESTINATION_COLUMN_NAME: data.remainingdata.DESTINATION_COLUMN_NAME,
                    SOURCE_DATA: data.sourcedatacode,
                    SOURCE_DISPLAY_NAME: data.sourcedisplayname,
                    DESTINATION_DATA: data.destinationdataid,
                    DESTINATION_DISPLAY_NAME: data.destinationdataname
                }).into('PROJ_DATA_MAPPINGS');
                console.log(datamappings);
                dataMappings = datamappings;

            }
            else if (data.remainingdata.SOURCE_COLUMN_NAME === "SALARY_BASIS_NAME"){
                let datamappings = await Database.connection('oracledb').insert({
                    PROJECT_ID: data.projectid,
                    SOURCE_ENTITY_ID: data.sourceentityid,
                    SOURCE_COLUMN_ID: data.remainingdata.SOURCE_COLUMN_ID,
                    SOURCE_COLUMN_NAME: data.remainingdata.SOURCE_COLUMN_NAME,
                    DESTINATION_COLUMN_ID: data.remainingdata.DESTINATION_COLUMN_ID,
                    DESTINATION_COLUMN_NAME: data.remainingdata.DESTINATION_COLUMN_NAME,
                    SOURCE_DATA: data.sourcedisplayname,
                    SOURCE_DISPLAY_NAME: data.sourcedisplayname,
                    DESTINATION_DATA: data.destinationdataname,
                    DESTINATION_DISPLAY_NAME: data.destinationdataname
                }).into('PROJ_DATA_MAPPINGS');
                console.log(datamappings);
                dataMappings = datamappings;
            }
            else {
                let datamappings = await Database.connection('oracledb').insert({
                    PROJECT_ID: data.projectid,
                    SOURCE_ENTITY_ID: data.sourceentityid,
                    SOURCE_COLUMN_ID: data.remainingdata.SOURCE_COLUMN_ID,
                    SOURCE_COLUMN_NAME: data.remainingdata.SOURCE_COLUMN_NAME,
                    DESTINATION_COLUMN_ID: data.remainingdata.DESTINATION_COLUMN_ID,
                    DESTINATION_COLUMN_NAME: data.remainingdata.DESTINATION_COLUMN_NAME,
                    SOURCE_DATA: data.sourcedataname,
                    SOURCE_DISPLAY_NAME: data.sourcedisplayname,
                    DESTINATION_DATA: data.destinationdataname,
                    DESTINATION_DISPLAY_NAME: data.destinationdataname
                }).into('PROJ_DATA_MAPPINGS');
                console.log(datamappings);

                dataMappings = datamappings;
            }
            


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

            return response.status(200).send({ success: true, data: dataMappings, msg: 'Successfully inserted ', error: null });
        }
        catch (error) {
            console.log(error);
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
              //  console.log(data.sourceentityid);
            //console.log('sdsddsf',datafields);
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

    //format to download excel data mapping template  in data mapping screen 
    async excelDownloadDataMappingTemplate({ request, response, error }) {
        try {
            var data1 = [];
            var data = request.body;

            let mappings = await Database.connection('oracledb').raw('SELECT PROJECT_ID, SOURCE_COLUMN_ID,  SOURCE_COLUMN_NAME, SOURCE_ENTITY_ID, SOURCE_ENTITY_NAME, DESTINATION_COLUMN_ID, DESTINATION_ENTITY_NAME, DESTINATION_COLUMN_NAME, DISPLAY_NAME FROM PROJ_COLUMN_MAPPING WHERE SOURCE_ENTITY_ID = '+data.entityid+" and SOURCE_COLUMN_NAME = '"+data.columnname+"'");
            
            for (var i = 0; i < mappings.length; i++) {
                let qry1 = await Database.connection('oracledb').select('ENTITY_NAME').from('PROJECT_SOURCE_ENTITY_LIST').where('ENTITY_ID', mappings[i].SOURCE_ENTITY_ID);
                //console.log(qry1);
                let qry2 = await Database.connection('oracledb').select('PROJECT_NAME').from('LIST_OF_PROJECTS').where('PROJECT_ID', mappings[i].PROJECT_ID);
                //console.log(qry2);
                let qry3 = await Database.connection('oracledb').select('DEST_ENTITY_ID', 'COLUMN_ID').from('PROJ_DATATYPE_ENTITY_COLUMNS').where('COLUMN_ID', mappings[i].DESTINATION_COLUMN_ID);
                //console.log(qry3);
                let qry4 = await Database.connection('oracledb').select('DEST_ENTITY_NAME').from('PROJ_DATATYPE_ENTITY_LIST').where('DEST_ENTITY_ID', qry3[0].DEST_ENTITY_ID);
                //console.log(qry4);
                var source_table_name = 'SOURCE_'+ qry4[0].DEST_ENTITY_NAME;
                let qry5 = '',qry6 = '';
                if(qry4[0].DEST_ENTITY_NAME == 'LOOKUPS') {
                    source_table_name = qry1[0].ENTITY_NAME;
                    qry5 = await Database.connection('oracledb').raw('SELECT DISTINCT ' + mappings[i].SOURCE_COLUMN_NAME + ' AS SOURCE_DATA_NAME from ' + source_table_name);
                    qry6 = await Database.connection('oracledb').raw('SELECT DISTINCT ' + mappings[i].DESTINATION_COLUMN_NAME + ' AS DEST_DATA_NAME from ' +source_table_name);
                }
                else {
                    var source_column = mappings[i].SOURCE_COLUMN_NAME;
                    if(mappings[i].SOURCE_COLUMN_NAME == 'GRADECODE'){
                        source_column = 'GRADEID';
                    }
                    if(mappings[i].SOURCE_COLUMN_NAME == 'DEPARTMENT_NAME'){
                        source_column = 'DEPARTMENTID';
                    }
                    var destination_column = mappings[i].DESTINATION_COLUMN_NAME;
                    if(mappings[i].DESTINATION_COLUMN_NAME == 'GRADECODE'){
                        destination_column = 'GRADE_CODE'
                    }
                    if(mappings[i].DESTINATION_COLUMN_NAME == 'LOCATIONCODE'){
                        destination_column = 'LOCATION_CODE'
                    }
                    if (mappings[i].DESTINATION_COLUMN_NAME == 'DEPARTMENT_NAME') {
                        destination_column = 'ORGANIZATIONID'
                    }

                    qry5 = await Database.connection('oracledb').raw('SELECT DISTINCT ' + source_column + ' AS SOURCE_DATA_NAME from ' + source_table_name);
                    qry6 = await Database.connection('oracledb').raw('SELECT DISTINCT ' + destination_column + ' AS DEST_DATA_NAME from ' +qry4[0].DEST_ENTITY_NAME);
                }    
                var mappeddata = {
                    projectname: qry2[0].PROJECT_NAME,
                    sourceentityname: qry1[0].ENTITY_NAME,
                    sourcecolumnname: mappings[i].SOURCE_COLUMN_NAME,
                    sourcedata: qry5,
                    destinationentity: qry4[0].DEST_ENTITY_NAME,
                    destinationcolumnname: mappings[i].DESTINATION_COLUMN_NAME,
                    destinationdata: qry6
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


   
    //To get all data store in PROJ_DATA_MAPPINGS from Upload Data Mappings excel. 
    async uploadDataMappingFromExcel({request, response, error}) {
        try {
            var data = request.body;
            // let sql = await Database.connection('oracledb').raw('delete from PROJ_DATA_MAPPINGS where SOURCE_ENTITY_ID='+data.entityid);
            for (let i in data.mappings) {

                    let source_table_name = 'SOURCE_'+data.mappings[i].DestinationEntity;
                    let alias_column_name = data.mappings[i].DestinationEntity;
                    alias_column_name = alias_column_name.substr(0, alias_column_name.length - 1);

                    let projectQry = await Database.connection('oracledb').select('PROJECT_ID').from('LIST_OF_PROJECTS').where('PROJECT_NAME', data.mappings[i].ProjectName);

                    let qry2 = await Database.connection('oracledb').select('ENTITY_ID', 'COLUMN_ID', 'DISPLAY_NAME').from('PROJ_ENTITY_IDENTIFICATION').where('COLUMN_NAME', data.mappings[i].SourceColumnName);

                    let qry3 = await Database.connection('oracledb').select('DEST_ENTITY_ID', 'COLUMN_ID').from('PROJ_DATATYPE_ENTITY_COLUMNS').where('COLUMN_NAME', data.mappings[i].DestinationColumnName);
                    console.log('sourcedata--->',data.mappings[i].SourceData);
                    if (data.mappings[i].SourceData !== "" && data.mappings[i].DestinationData !== "") {
                        var source_column = data.mappings[i].SourceColumnName;
                        if(data.mappings[i].SourceColumnName == 'GRADECODE'){
                            source_column = 'GRADEID';
                        }
                        if(data.mappings[i].SourceColumnName == 'DEPARTMENT_NAME'){
                            source_column = 'DEPARTMENTID';
                        }
                        var destination_column = data.mappings[i].DestinationColumnName;
                        if(data.mappings[i].DestinationColumnName == 'GRADECODE'){
                        destination_column = 'GRADE_CODE'
                    }
                    if (data.mappings[i].DestinationColumnName == 'LOCATIONCODE') {
                        destination_column = 'LOCATION_CODE'
                    }
                    if(data.mappings[i].DestinationColumnName == 'DEPARTMENT_NAME')
                    {
                        destination_column = 'ORGANIZATIONID';
                    }
                    alias_column_name = alias_column_name + '_NAME';
                    if (alias_column_name == 'GRADE_NAME') {
                        alias_column_name = 'GRADENAME';
                    }

                    
                    let qry4 = await Database.connection('oracledb').raw('SELECT ' + alias_column_name + ' as source_display_name FROM ' + source_table_name + ' WHERE ' + source_column + "='" + data.mappings[i].SourceData + "'");
                    if(alias_column_name == 'DEPARTMENT_NAME'){
                        alias_column_name = 'NAME';
                    }
                    let qry5 = await Database.connection('oracledb').raw('SELECT ' + alias_column_name + ' as dest_display_name FROM ' + data.mappings[i].DestinationEntity + ' WHERE ' + destination_column + "='" + data.mappings[i].DestinationData + "'");
                    console.log(qry4[0].SOURCE_DISPLAY_NAME);
                    console.log(qry5[0].DEST_DISPLAY_NAME);
                    let qry6 = await Database.connection('oracledb').raw("SELECT count(*) as COUNT_MAPPINGS from PROJ_DATA_MAPPINGS WHERE SOURCE_DATA='" + data.mappings[i].SourceData + "' AND DESTINATION_DATA='" + data.mappings[i].DestinationData + "'");
                    if (qry6[0].COUNT_MAPPINGS == 0) {
                        let datamappings = await Database.connection('oracledb').insert({
                            PROJECT_ID: projectQry[0].PROJECT_ID,
                            SOURCE_ENTITY_ID: qry2[0].ENTITY_ID,
                            SOURCE_COLUMN_ID: qry2[0].COLUMN_ID,
                            SOURCE_COLUMN_NAME: data.mappings[i].SourceColumnName,
                            SOURCE_DISPLAY_NAME: qry4[0].SOURCE_DISPLAY_NAME,
                            DESTINATION_COLUMN_ID: qry3[0].COLUMN_ID,
                            DESTINATION_COLUMN_NAME: data.mappings[i].DestinationColumnName,
                            SOURCE_DATA: data.mappings[i].SourceData,
                            DESTINATION_DATA: data.mappings[i].DestinationData,
                            DESTINATION_DISPLAY_NAME: qry5[0].DEST_DISPLAY_NAME
                        }).into('PROJ_DATA_MAPPINGS');
                    }
                    else {
                        let validations = await Database.connection('oracledb').insert({
                            PROJECTID: projectQry[0].PROJECT_ID,
                            TYPE: 'Warning',
                            SOURCE_ENTITY: source_table_name,
                            SOURCE_FIELD: data.mappings[i].SourceColumnName,
                            DESTINATION_ENTITY: alias_column_name,
                            DESTINATION_FIELD: data.mappings[i].DestinationColumnName,
                            MESSAGE: 'SourceData and DestinationData is already exists it will not insert.'
                        }).into('VALIDATIONS');
                        console.log('already record exists.');
                    }
                }
                else {
                    let validations = await Database.connection('oracledb').insert({
                        PROJECTID: projectQry[0].PROJECT_ID,
                        TYPE: 'Error',
                        SOURCE_ENTITY: source_table_name,
                        SOURCE_FIELD: data.mappings[i].SourceColumnName,
                        DESTINATION_ENTITY: alias_column_name,
                        DESTINATION_FIELD: data.mappings[i].DestinationColumnName,
                        MESSAGE: 'Either SourceData or DestinationData is null then it will not insert.'
                    }).into('VALIDATIONS');
                    console.log('not found');
                }

            }


            //console.log(data);
            return response.status(200).send({ success: true, data: 'datamappings', msg: 'Successfully get the list', error: null });
        }
        catch (error) {
            console.log(error);
            return response.status(400).send({ success: false, data: null, msg: 'Error while get the list', error: error });
        }
    }


}

module.exports = DatamappingController
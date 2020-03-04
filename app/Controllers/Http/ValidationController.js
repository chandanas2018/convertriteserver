'use strict'

const ErrorManager = use('App/Models/ErrorManager');
const Database = use('Database');

const HdlController = require('./HdlController');


let Errormanager = new ErrorManager();

class ValidationController extends HdlController {


    async getstatus({ request, response, error }) {

        response.send({ status: Errormanager.getStatus() })
    }

    async  validations({ request, response, error }) {

        try {
            Errormanager.reset();
            //await this.rule1();
            await this.rule2();
            await this.rule3();
            //await this.rule4();

            return response.status(200).send(({ success: true, data: Errormanager.getStatus(), msg: 'validation status', error: null }));
        }

        catch (err) {
            console.log(err);
            return response.status(400).send(({ success: false, data: null, msg: 'errors', error: err }));
        }

    }



    async rule1() {
        try {
            var data = [];
            var r1 = await Database.connection('oracledb').raw('select * from proj_column_mapping where destination_column_id in (select  '

                + 'destination_column_id from proj_column_mapping group by destination_column_id having count(*) > 1)');

            console.log(r1);

            if (r1.length == 0) {
                Errormanager.addInfo({ data: null, msg: ' Multiple source fileds are not mapped to single destination field rule is failed ', err: null }, { ruleinfo: 'DataRule:N to one data mapping check' }, { ruleid: 1 })
            } else {
                for (var i = 0; i < r1.length; i++) {
                    var object1 = {
                        sourcecolumn: r1[i].SOURCE_COLUMN_NAME,
                        destinationcolumn: r1[i].DESTINATION_COLUMN_NAME,
                        sourceentityid: r1[i].SOURCE_ENTITY_ID
                    }
                    data.push(object1)
                }
                Errormanager.addError({ data: data, msg: 'Multiple source fileds cannot be mapped to a single destination field', err: null }, { ruleinfo: 'DataRule:N to one field mapping check' }, { ruleid: 1 })
            }


        }
        catch (error) {
            // Errormanager.addError({ ruleinfo: 'rule1', data: null, msg: 'Error while excuting rule1', err: error })
            console.log(error);
        }
        // finally {
        //     Database.close(['oracledb']);
        // }
    }


    async  rule3() {
        try {
            var repetedfields = await Database.connection('oracledb').raw("SELECT SOURCE_DATA,  SOURCE_COLUMN_NAME, destination_column_name, SOURCE_ENTITY_ID, LISTAGG(DESTINATION_DATA, ',') WITHIN GROUP (ORDER BY DESTINATION_DATA) DESTINATION_DATA , COUNT(*) occurrences FROM PROJ_DATA_MAPPINGS GROUP BY SOURCE_DATA,  source_column_name, destination_column_name, SOURCE_ENTITY_ID HAVING COUNT(*) > 1");
            console.log(repetedfields);

            if (repetedfields.length == 0) {
                Errormanager.addInfo({ data: null, msg: 'No Repeated source data mappings', err: null }, { ruleinfo: 'DataRule: One to N data mapping check' }, { ruleid: 2 })
            }
            else {
                var data = [];
                for (var i = 0; i < repetedfields.length; i++) {

                    if (repetedfields[i].OCCURRENCES > 1) {
                        var object2 = {
                            sourceentityid: repetedfields[i].SOURCE_ENTITY_ID,
                            sourcecolumn: repetedfields[i].SOURCE_COLUMN_NAME,
                            destinationcolumn: repetedfields[i].DESTINATION_COLUMN_NAME,
                            sourcedata: repetedfields[i].SOURCE_DATA,
                            destinationdata: repetedfields[i].DESTINATION_DATA
                        }
                        data.push(object2);
                    }


                }
                Errormanager.addError({ data: data, msg: 'Repeated source data mappings with destination data found', err: null }, { ruleinfo: 'DataRule:N to one data mapping check' }, { ruleid: 2 });
            }

        }

        catch (err) {
            console.log(err);
        }
        // finally {
        //     Database.close(['oracledb']);
        // }

    }

    async  rule4() {
        try {
            var error4 = await Database.connection('oracledb').select('SOURCE_DATA', 'DESTINATION_DATA', 'SOURCE_ENTITY_ID')
                .from('PROJ_DATA_MAPPINGS').where(destination_data, 'undefined');
            console.log(error4);

        }
        catch (err) {
            console.log(err);
        }
        // finally {
        //     Database.close(['oracledb']);
        // }

    }

    async rule2() {
        try {

            var array = [];
            var finalArray = [];
            var entity_column_mappings = {};
            var data = await Database.connection('oracledb').raw('select entity_id, entity_name, source_column_name, destination_column_name, source_data, destination_data  from ' +
                '(select source_entity_id, source_column_id,source_column_name, proj_data_mappings.destination_column_name, proj_data_mappings.destination_data, source_data from PROJ_DATA_MAPPINGS order by source_entity_id) a, ' +
                '(select entity_id, ENTITY_NAME from PROJECT_SOURCE_ENTITY_LIST where entity_id in( select DISTINCT  source_entity_id  from proj_data_mappings)) b ' +
                'where a.source_entity_id = b.entity_id');
            console.log(data);

            if (data.length == 0) {
                Errormanager.addInfo({ data: null, msg: 'All source values are mapped rule is failed ', err: null }, { ruleinfo: 'Each source field should be mapped with destination field' }, { ruleid: 3 })
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (entity_column_mappings[data[i].ENTITY_NAME] === undefined) {
                        entity_column_mappings[data[i].ENTITY_NAME] = {};
                    }
                    if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME] === undefined) {
                        entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME] = { entityid: data[i].ENTITY_ID, mapped_values: [], source_values: [] };
                    }
                    entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].mapped_values.push(data[i].SOURCE_DATA)
                    if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values.length == 0) {
                        var qry = "select distinct " + data[i].SOURCE_COLUMN_NAME + ' AS original_data ' + " from " + data[i].ENTITY_NAME;

                        entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values = await Database.raw(qry)

                    }

                }

                for (var entity in entity_column_mappings) {
                    if (entity !== undefined) {
                        var mappings = entity_column_mappings[entity]
                        for (var mapping in mappings) {
                            var mapping_data = mappings[mapping]


                            // Condition 1: Check source data count > mapped count
                            if (mapping_data.source_values.length > mapping_data.mapped_values.length) {
                                var finalObject = {
                                    sourceentityid: mapping_data.entityid,
                                    entityname: entity,
                                    sourcecolumnnames: mapping,
                                    sourcevaluecount: mapping_data.source_values.length,
                                    mappedvaluecount: mapping_data.mapped_values.length

                                }
                                // console.log(finalObject);
                                Errormanager.addWarnings({ data: finalObject, msg: "All source data values are not mapped", err: null }, { ruleinfo: 'Each source field should be mapped with destination field' }, { ruleid: 3 })
                                //                                finalArray.push(finalObject);

                            }

                            //Condition 2: Check if all values of source are mapped
                            else if (mapping_data.source_values.length == mapping_data.mapped_values.length) {

                                var array = mapping_data.mapped_values;
                                var duplicateFound = false;

                                for (var k = 0; k < array.length; k++) {
                                    for (var j = k + 1; j < array.length; j++) {
                                        if (array[k] == array[j]) {
                                            duplicateFound = true;

                                        }
                                    }
                                }

                                if (duplicateFound == true) {
                                    var finalObject = {
                                        sourceentityid: mapping_data.entityid,
                                        entityname: entity,
                                        sourcecolumnnames: mapping,
                                        sourcevaluecount: mapping_data.source_values.length,
                                        mappedvaluecount: mapping_data.mapped_values.length
                                    }
                                    Errormanager.addWarnings({ data: finalObject, msg: "Duplicate source value mapping identified", err: null }, { ruleinfo: 'Each source field should be mapped with destination field only once' }, { ruleid: 3 })

                                }
                                else {
                                    Errormanager.addInfo({ data: null, msg: 'Duplicate source value mapping identified rule is failed', err: null }, { ruleinfo: 'Each source field should be mapped with destination field only once' }, { ruleid: 3 })
                                }

                            }
                        }
                    }
                }



                console.log(entity_column_mappings);

                // array.push(finalArray)


            }

        }
        catch (err) {
            console.log(err);
            //return response.status(400).send({ success: false, data: null, msg: 'failure', err: error });
        }

        // finally {
        //     Database.close(['oracledb']);
        // }
    }


    async storeMapUnMapIntoDB({request, response, error}) {
        
        try {
            const hdlController = new HdlController();
            
            var HDLEntries = [],MapEntries = [],UNMapEntries = [];
            var dbdata = [], UnMapData = [];
            const deleteDB = await Database.connection('oracledb').raw('DELETE FROM VALIDATIONS_DATA');
            //Iterating over array collection of entities
            const PromiseEntries = hdlController.DataTransferRulesForDefaultTransfers.map(async (rule) => {
                //Get Data for each entity defined in arry of objects
                var dbResult = await Database.connection('oracledb').raw(rule.SourceQuery);
                //including data mapping values in hdl generation
                var mappings = [];
                // Get all data mappings based on entity id.
                var dataMappings = await Database.connection('oracledb').raw('select psl.entity_name, pdm.source_column_name, pdm.source_data, pdm.destination_data from project_source_entity_list psl,'
                +'proj_data_mappings pdm where psl.entity_id = pdm.source_entity_id');

                var MappedEntity = dataMappings.filter(e => {

                    var entity = hdlController.lookupObj[e.ENTITY_NAME];

                    if(entity) {
                        if (entity.toUpperCase() === rule.DestinationEntity.toUpperCase())
                            return e
                    }

                })

                var mapData = MappedEntity.map(me => {
                    return { 'SourceData': me.SOURCE_DATA, 'DestData': me.DESTINATION_DATA, 'SourceColumn': me.SOURCE_COLUMN_NAME, 'Entity': me.ENTITY_NAME }
                });


                //sorting keys for each entity in array collection
                if (dbResult) {
                    var keys = Object.keys(dbResult[0]).sort();
  
                    dbResult.forEach(eachResult => {

                        for (var i = 0; i < keys.length; i++) {

                            for (var j = 0; j < mapData.length; j++) {
                                //Checking whether sourcecolumn with keys if it is true
                                if (keys[i].indexOf(mapData[j].SourceColumn)) {
                                    //If true, then checking whether mapped source data and entries data is null or not.
                                    if (mapData[j].SourceData != null && eachResult[keys[i]] != null) {
                                        //If true, then comparing both mapped source data and database entries data is equal or not.
                                        if (mapData[j].SourceData.toUpperCase().indexOf(eachResult[keys[i]].toUpperCase())) {
                                            //If true, then framing the query based on entity, sourcecolumn and sourcedata.
                                            var mapPersonDataQuery = "SELECT PERSON_NUMBER FROM "+mapData[j].Entity+" WHERE "+mapData[j].SourceColumn+"='"+mapData[j].SourceData+"'";
                                            //Here already data is mapped found, then pushing with validation_entity, person_query, mapping_column_name, mapped_data.
                                            dbdata.push({
                                                VALIDATION_ENTITY: mapData[j].Entity,
                                                PERSON_QUERY: mapPersonDataQuery,
                                                MAPPING_COLUMN_NAME: mapData[j].SourceColumn,
                                                MAPPED_DATA: mapData[j].SourceData
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });

            HDLEntries = await Promise.all(PromiseEntries);
            var not_mapped_query = '';
            //If mapped data(dbdata) is present or not.
            if(dbdata.length > 0){
                //If true, then removing duplicate data and stored in dbdata.
                dbdata = removeDuplicates(dbdata, "MAPPED_DATA");
                //Looping through all dbdata mapped data.
                for(var i = 0;i < dbdata.length;i++) {
                    //Get person number, code from respective mapped query.
                    var query = await Database.connection('oracledb').raw(dbdata[i].PERSON_QUERY);
                    //Checking if data is present.
                    if(query.length > 0){
                        //If true, then looping all mapped data based on person number.
                        query.forEach((pdata) => {  
                            not_mapped_query += pdata.PERSON_NUMBER+",";  
                            //Here pushing all mapped data in MapEntries array.
                            MapEntries.push({
                                VALIDATION_ENTITY: dbdata[i].VALIDATION_ENTITY,
                                MAPPED_PERSON_NUMBER: pdata.PERSON_NUMBER,
                                MAPPING_COLUMN_NAME: dbdata[i].MAPPING_COLUMN_NAME,
                                MAPPED_DATA: dbdata[i].MAPPED_DATA
                            });
                        });
                        //Here pushing all unmapped data in UnMapEntries array.
                        UNMapEntries.push({
                            VALIDATION_ENTITY: dbdata[i].VALIDATION_ENTITY,
                            UNMAP_QUERY: not_mapped_query,
                            MAPPING_COLUMN_NAME: dbdata[i].MAPPING_COLUMN_NAME
                        });
                    }
                }
                //Inserting all mapped entries into VALIDATIONS_DATA Table.
                let dbinsert = await Database.connection('oracledb').insert(MapEntries).into('VALIDATIONS_DATA');
                //Removing duplicate if required for UNMapEntries array based on VALIDATION_ENTITY.
                UNMapEntries = removeDuplicates(UNMapEntries, "MAPPING_COLUMN_NAME");
                //Checking whether un mapped data is exists or not.
                if (UNMapEntries.length > 0) {
                    //If true, then looping all unmap entries.
                    for (var j = 0;j < UNMapEntries.length; j++) {
                        //Checking whether person number last character is comma or not.
                        if((UNMapEntries[j].UNMAP_QUERY).toString().slice(-1) == ',') {
                            //If true, then removing last character comma from string.
                            var person_ids = (UNMapEntries[j].UNMAP_QUERY).toString().slice(0, -1);
                            //Checking whether unmap data from already map data using NOT IN.
                            var query = await Database.connection('oracledb').raw("SELECT PERSON_NUMBER, "+UNMapEntries[j].MAPPING_COLUMN_NAME+" as MAP_COLUMN FROM "+UNMapEntries[j].VALIDATION_ENTITY+" where PERSON_NUMBER NOT IN ("+person_ids+")");
                            //If data is exists or not.
                            if(query.length > 0){
                                //If true, then looping all push into UnMapData array.
                                query.forEach((pdata) => {  
                                    UnMapData.push({
                                        VALIDATION_ENTITY: UNMapEntries[j].VALIDATION_ENTITY,
                                        NOTMAPPED_PERSON_NUMBER: pdata.PERSON_NUMBER,
                                        MAPPING_COLUMN_NAME: UNMapEntries[j].MAPPING_COLUMN_NAME,
                                        UNMAPPED_DATA: pdata.MAP_COLUMN
                                    });
                                });
                            }
                        }
                    }
                    //Inserting all unmap data into VALIDATIONS_DATA Table.
                    let dbinsert = await Database.connection('oracledb').insert(UnMapData).into('VALIDATIONS_DATA');
                }

                
                //Getting all mapped data query.
                //let unmapQueryData = await Database.connection('oracledb').raw('SELECT DISTINCT ID,MAPPING_COLUMN_NAME as COLUMN_NAME,UNMAPPED_DATA as MAP_DATA FROM VALIDATIONS_DATA WHERE NOTMAPPED_PERSON_NUMBER != 0');
                //Getting all unmapped data query.
                //let mapQueryData = await Database.connection('oracledb').raw('SELECT DISTINCT ID,MAPPING_COLUMN_NAME as COLUMN_NAME,MAPPED_DATA as MAP_DATA FROM VALIDATIONS_DATA WHERE MAPPED_PERSON_NUMBER != 0');
                let mapQueryData = await Database.connection('oracledb').raw('SELECT MAPPING_COLUMN_NAME, COUNT(MAPPED_PERSON_NUMBER) as COUNT_MAP FROM VALIDATIONS_DATA  GROUP BY MAPPING_COLUMN_NAME');
                let unmapQueryData = await Database.connection('oracledb').raw('SELECT MAPPING_COLUMN_NAME, COUNT(NOTMAPPED_PERSON_NUMBER) as COUNT_UNMAP FROM VALIDATIONS_DATA GROUP BY MAPPING_COLUMN_NAME');
                var totalData = [];
                //If mapdata present or not
                if(mapQueryData.length > 0){
                    //If true, then looping through pushing all map data into totalData array.
                    mapQueryData.forEach((mdata, index) => {
                        totalData.push({
                            "id": index,
                            "series": 'MAP_'+mdata.MAPPING_COLUMN_NAME,
                            "group": 'group1',
                            "value": mdata.COUNT_MAP
                        });
                    });
                    //If unmap data present or not.
                    if(unmapQueryData.length > 0) {
                        //If true, then looping through pushing all unmap data into totalData array.
                        unmapQueryData.forEach((umdata, index) => {
                            totalData.push({
                                "id": mapQueryData.length + index,
                                "series": 'UNMAP_'+umdata.MAPPING_COLUMN_NAME,
                                "group": "group1",
                                "value": umdata.COUNT_UNMAP
                            });
                        });
                    }
                }
                else{
                    //If unmap data present or not.
                    if(unmapQueryData.length > 0) {
                        //If true, then looping through pushing all unmap data into totalData array.
                        unmapQueryData.forEach((umdata, index) => {
                            totalData.push({
                                "id": mapQueryData.length + index,
                                "series": 'UNMAP_'+umdata.MAPPING_COLUMN_NAME,
                                "group": "group1",
                                "value": umdata.COUNT_UNMAP
                            });
                        });
                    }
                }

                // return response.send({data:HDLEntries})
                return ({ success: totalData });
            }
            else {
                //If not mapped data.
                return ({ success: null, error: null });                
            }

        }

        catch (err) {
            console.log(err);
            return ({ success: null, error: err });

        }

        // finally {
        //     Database.close(['oracledb']);
        // }
    }

}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}


module.exports = ValidationController

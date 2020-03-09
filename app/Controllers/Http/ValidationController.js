'use strict'

const ErrorManager = use('App/Models/ErrorManager');
const Database = use('Database');

const HdlController = require('./HdlController');


let Errormanager = new ErrorManager();

const DataTransferRulesForDefaultTransfers = [
    {
        DestinationEntity: "Worker",
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'PersonNumber', 'StartDate', 'DateOfBirth', 'ActionCode', 'BloodType'],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date', 'EFFECTIVE_END_DATE', 'Person_Number', 'Start_Date', 'DATE_OF_BIRTH', 'ActionCode', 'Blood_type'],
        SourceQuery: "SELECT to_char(P.EFFECTIVE_START_DATE, 'YYYY/MM/DD')  AS EffectiveStartDate,  to_char(P.EFFECTIVE_END_DATE,'YYYY/MM/DD') AS EffectiveEndDate, P.PERSON_NUMBER AS PersonNumber, to_char(P.Start_Date,'YYYY/MM/DD') as StartDate, to_char(P.DATE_OF_BIRTH, 'DD/MM/YYYY') AS DateOfBirth, 'EBS' As SourceSystemOwner, actioncode as ActionCode, p.blood_type as BloodType," +
            " P.PERSON_NUMBER || '_' ||'PERSON' \"SOURCESYSTEMID\"" + " FROM PERSON P  WHERE P.PERSON_ID is not NULL AND P.PERSON_NUMBER IS NOT NULL "        

    },

    {
        DestinationEntity: 'PersonName',
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'PersonIdSourceSystemId', 'PersonNumber', 'LegislationCode', 'NameType', 'FirstName', 'MiddleNames', 'LastName', 'Title'],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date', 'Effective_End_Date', 'PersonIdSourceSystemId', 'PERSON_NUMBER', 'Legislation_Code', 'Name_Type', 'First_Name', 'Middle_Names', 'Last_Name', 'Title'],
        SourceQuery: "SELECT to_char(pn.effective_start_date,'YYYY/MM/DD') as effectivestartdate, to_char(pn.Effective_End_Date, 'YYYY/MM/DD') as EffectiveEndDate," + "  P.PERSON_NUMBER || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\"," + "pn. Person_Number as PersonNumber,pn. Legislation_Code as LegislationCode,'GLOBAL' as NameType, pn. First_Name as FirstName, pn. Middle_Names as MiddleNames," +
            "pn.Last_Name as LastName, pn.title as Title, 'EBS' AS SourceSystemOwner," + "P.PERSON_NUMBER || '_' || 'PERSON_NAME'  \"SOURCESYSTEMID\"" + " FROM PERSON_NAME pn INNER JOIN PERSON p on p.PERSON_ID = pn.PERSON_ID"
          

    },

    {
        DestinationEntity: "PersonLegislativeData",
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'PersonIdSourceSystemId', 'LegislationCode', 'HighestEducationLevel', 'MaritalStatus', 'MaritalStatusDate', 'Sex', 'PersonNumber'],
        SourceColumns: ['SOURCE_SYSTEM_OWNER', 'SOURCE_SYSTEM_ID', 'EFFECTIVE_START_DATE', 'EFFECTIVE_END_DATE', 'PersonIdSourceSystemId', 'Legislation_Code', 'Highest_Education_Level', 'Marital_Status', 'Marital_Status_Date', 'Sex', 'PERSON_NUMBER'],
        SourceQuery: "SELECT  PLI.PERSON_NUMBER AS PersonNumber, to_char(PLI.EFFECTIVE_START_DATE, 'YYYY/MM/DD') AS EffectiveStartDate, to_char(PLI.EFFECTIVE_END_DATE, 'YYYY/MM/DD') AS EffectiveEndDate," + " PLI.PERSON_NUMBER  || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\"" + ",PLI.Legislation_Code AS " +
            "LegislationCode,PLI.Highest_Education_Level AS HighestEducationLevel,PLI.Marital_Status AS MaritalStatus, PLI.Sex, PLI.Marital_Status_Date AS MaritalStatusDate,'EBS' AS SourceSystemOwner," +
            " PLI.PERSON_NUMBER || '_' || 'PERSON_LEGISLATIVE_DATA'  \"SOURCESYSTEMID\"" +
            " FROM PERSON_LEGISLATIVE_INFO PLI INNER JOIN PERSON P ON PLI.PERSON_ID = P.PERSON_ID"
           
    },


    {
        DestinationEntity: "WorkRelationship",
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'LegalEmployerName', 'DateStart', 'ActionCode', 'PrimaryFlag', 'WorkerType', 'PersonIdSourceSystemId'],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Legal_Employer_Name', 'Date_Start', 'Action_Code', 'Primary_Flag', 'Worker_Type', 'PersonIdSourceSystemId'],
        SourceQuery: "select Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'   \"SOURCESYSTEMID\"," +
            "Legal_Employer_Name as LegalEmployerName, to_char(Date_Start, 'YYYY/MM/DD') as DateStart, Action_Code as ActionCode, Primary_Flag as PrimaryFlag, Worker_Type as WorkerType," + " PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\""
            + " FROM WORK_RELATIONSHIP "
            

    },


    {
        DestinationEntity: "WorkTerms",
        DestinationColumns: ['ActionCode', 'SourceSystemOwner', 'SourceSystemId', 'AssignmentName', 'AssignmentType', 'AssignmentNumber', 'AssignmentStatusTypeCode', 'EffectiveEndDate', 'EffectiveLatestChange', 'EffectiveSequence', 'EffectiveStartDate', 'SystemPersonType', 'BusinessUnitShortCode', 'LegalEmployerName', 'PersonIdSourceSystemId', 'PosIdSourceSystemId'],
        SourceColumns: ['Action_Code', 'Source_System_Owner', 'Source_System_Id', 'Assignment_Name', 'Assignment_Type', 'Assignment_Number', 'Assignment_Status_Type_Code', 'Effective_End_Date', 'Effective_Latest_Change', 'Effective_Sequence', 'Effective_Start_Date', 'System_Person_Type', 'Business_Unit_Short_Code', 'Legal_Employer_Name', 'PersonIdSourceSystemId', 'PosIdSourceSystemId'],
        SourceQuery: "select Action_Code as ActionCode, Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'ETERM' \"SOURCESYSTEMID\"" + ",Assignment_Name as AssignmentName,Assignment_Type as AssignmentType," + " Assignment_Name || PERSON_NUMBER \"ASSIGNMENTNUMBER\""
            + ", Assignment_Status_Type_Code as AssignmentStatusTypeCode, to_char(Effective_End_Date, 'YYYY/MM/DD') as EffectiveEndDate, Effective_Latest_Change as EffectiveLatestChange, Effective_Sequence as EffectiveSequence, to_char(Effective_Start_Date, 'YYYY/MM/DD') as EffectiveStartDate,"
            + " System_Person_Type as SystemPersonType, Business_Unit_Short_Code as BusinessUnitShortCode, Legal_Employer_Name as LegalEmployerName," + " PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\"" + ", PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'\"POSIDSOURCESYSTEMID\"" +
            " FROM WORK_TERMS "
           


    },

    {
        DestinationEntity: "Assignment",
        DestinationColumns: ['ActionCode', 'SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'EffectiveSequence', 'EffectiveLatestChange', 'AssignmentType', 'AssignmentName', 'AssignmentNumber', 'AssignmentStatusTypeCode', 'BusinessUnitShortCode', 'LegalEmployerName', 'PosIdSourceSystemId', 'PersonIdSourceSystemId', 'PersonTypeCode', 'PrimaryFlag', 'SystemPersonType', 'WtaIdSourceSystemId', 'JobCode', 'DepartmentName', 'LocationCode', 'GradeCode'],
        SourceColumns: ['Action_Code', 'Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date', 'Effective_End_Date', 'Effective_Sequence', 'Effective_Latest_Change', 'Assignment_Type', 'Assignment_Name', 'Assignment_Number', 'Assignment_Status_Type_Code', 'Business_Unit_Short_Code', 'Legal_Employer', 'PosIdSourceSystemId', 'PersonIdSourceSystemId', 'Person_Type_Code', 'Primary_Flag', 'System_Person_Type', 'WtaIdSourceSystemId', 'JobCode', 'Department_Name', 'LocationCode', 'GradeCode'],
        SourceQuery: "select Action_Code as ActionCode, Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'ASG' \"SOURCESYSTEMID\"" + ",to_char(Effective_Start_Date,'YYYY/MM/DD') as EffectiveStartDate,to_char(Effective_End_Date, 'YYYY/MM/DD') as EffectiveEndDate, Effective_Sequence as EffectiveSequence,"
            + "Effective_Latest_Change as EffectiveLatestChange, Assignment_Type as AssignmentType,Assignment_Name as AssignmentName," + " Assignment_Name || PERSON_NUMBER \"ASSIGNMENTNUMBER\""
            + ",Assignment_Status_Type_Code as AssignmentStatusTypeCode,Business_Unit_Short_Code as BusinessUnitShortCode, Legal_Employer as LegalEmployerName," + " PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'\"POSIDSOURCESYSTEMID\""
            + ", PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\"" + ",Person_Type_Code as PersonTypeCode, Primary_Flag as PrimaryFlag, System_Person_Type as SystemPersonType,"
            + " PERSON_NUMBER || '_' || 'ETERM'   \"WTAIDSOURCESYSTEMID\"" + ",JobCode , Department_Name as DepartmentName, LocationCode , GradeCode " + " FROM ASSIGNMENT "
           

    }

 
]

var lookupObj = {
    PERSON: "Worker",
    PERSON_NAME: "PersonName",
    PERSON_LEGISLATIVE_INFO: "PersonLegislativeData",
    PERSON_NID: "PersonNationalIdentifier",
    PERSON_ADDRESS: "PersonAddress",
    WORK_RELATIONSHIP: "WorkRelationship",
    WORK_TERMS: "WorkTerms",
    ASSIGNMENT: "Assignment",
    PERSON_SALARY:"person_salary"
}
class ValidationController {

    // constructor() {
    //     this.lookupObj = lookupObj;
    //     this.DataTransferRulesForDefaultTransfers = DataTransferRulesForDefaultTransfers;
    // }

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

    }


    async storeMapUnMapIntoDB({request, response, error}) {
        
        try {
           
            var req = request.body;
            var HDLEntries = [];
             var MapEntries = [];
            var UNMapEntries = [];
            var dbdata = [], UnMapData = [];
            const deleteDB = await Database.connection('oracledb').raw('DELETE FROM VALIDATIONS_DATA');
            //Iterating over array collection of entities
            const PromiseEntries = DataTransferRulesForDefaultTransfers.map(async (rule) => {
                //Get Data for each entity defined in arry of objects
                var dbResult = await Database.connection('oracledb').raw(rule.SourceQuery);
                console.log(dbResult);
                //including data mapping values in hdl generation
                var mappings = [];
                // Get all data mappings based on entity id.
                var dataMappings = await Database.connection('oracledb').raw('select psl.entity_name, pdm.source_column_name, pdm.source_data, pdm.destination_data from project_source_entity_list psl,'
                +'proj_data_mappings pdm where psl.entity_id = pdm.source_entity_id and psl.entity_id='+req.entityId);

                var MappedEntity = dataMappings.filter(e => {

                    var entity =lookupObj[e.ENTITY_NAME];

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
                                // mapData[j].SourceColumn = mapData[j].SourceColumn.toString().split('_').join("");
                                // console.log(mapData[j].SourceColumn)
                                //Checking whether sourcecolumn with keys if it is true
                                if (keys[i].indexOf(mapData[j].SourceColumn)) {
                                    //If true, then checking whether mapped source data and entries data is null or not.
                                    if (mapData[j].SourceData != null && eachResult[keys[i]] != null) {
                                        //If true, then comparing both mapped source data and database entries data is equal or not.
                                        if (mapData[j].SourceData.toUpperCase().indexOf(eachResult[keys[i]].toUpperCase())) {
                                            //If true, then framing the query based on entity, sourcecolumn and sourcedata.
                                            var mapPersonDataQuery = "SELECT PERSON_NUMBER FROM "+mapData[j].Entity+" WHERE "+mapData[j].SourceColumn + "='"+mapData[j].SourceData+"'";
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
                    if(UnMapData.length > 0) {
                        let dbinsert = await Database.connection('oracledb').insert(UnMapData).into('VALIDATIONS_DATA');
                    }
                }

                
                //Getting all mapped data query.
                //let unmapQueryData = await Database.connection('oracledb').raw('SELECT DISTINCT ID,MAPPING_COLUMN_NAME as COLUMN_NAME,UNMAPPED_DATA as MAP_DATA FROM VALIDATIONS_DATA WHERE NOTMAPPED_PERSON_NUMBER != 0');
                //Getting all unmapped data query.
                //let mapQueryData = await Database.connection('oracledb').raw('SELECT DISTINCT ID,MAPPING_COLUMN_NAME as COLUMN_NAME,MAPPED_DATA as MAP_DATA FROM VALIDATIONS_DATA WHERE MAPPED_PERSON_NUMBER != 0');
                let mapQueryData = await Database.connection('oracledb').raw('SELECT MAPPING_COLUMN_NAME, COUNT(MAPPED_PERSON_NUMBER) as COUNT_MAP FROM VALIDATIONS_DATA  GROUP BY MAPPING_COLUMN_NAME');
                let unmapQueryData = await Database.connection('oracledb').raw('SELECT MAPPING_COLUMN_NAME, COUNT(NOTMAPPED_PERSON_NUMBER) as COUNT_UNMAP FROM VALIDATIONS_DATA GROUP BY MAPPING_COLUMN_NAME');
                var totalData = [];
                var totalData1 = [];
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
                            totalData1.push({
                                "id": mapQueryData.length + index,
                                "series": 'UNMAP_'+umdata.MAPPING_COLUMN_NAME,
                                "group": umdata.MAPPING_COLUMN_NAME,
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
                            totalData1.push({
                                "id": mapQueryData.length + index,
                                "series": 'UNMAP_'+umdata.MAPPING_COLUMN_NAME,
                                "group": umdata.MAPPING_COLUMN_NAME,
                                "value": umdata.COUNT_UNMAP
                            });
                        });
                    }
                }

                // return response.send({data:HDLEntries})
                return ({ success: totalData1 });
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

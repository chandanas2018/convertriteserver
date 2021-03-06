'use strict'
const Database = use('Database');
const Logger = use('Logger');
const toPascalCase = require('js-pascalcase');
const moment = require('moment');
// const Helpers = use('Helpers');

const fs = require('fs');
var hdlMappings = require('../../DataServices/HdlMappings');

const DataTransferRulesForDefaultTransfers = [
    {
        DestinationEntity: "Worker",
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'PersonNumber', 'StartDate', 'DateOfBirth', 'ActionCode', 'BloodType'],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date', 'EFFECTIVE_END_DATE', 'Person_Number', 'Start_Date', 'DATE_OF_BIRTH', 'ActionCode', 'Blood_type'],
        SourceQuery: "SELECT to_char(P.EFFECTIVE_START_DATE, 'YYYY/MM/DD')  AS EffectiveStartDate,  to_char(P.EFFECTIVE_END_DATE,'YYYY/MM/DD') AS EffectiveEndDate, P.PERSON_NUMBER AS PersonNumber, to_char(P.Start_Date,'YYYY/MM/DD') as StartDate, to_char(P.DATE_OF_BIRTH, 'DD/MM/YYYY') AS DateOfBirth, 'EBS' As SourceSystemOwner, actioncode as ActionCode, p.blood_type as BloodType," +
            " P.PERSON_NUMBER || '_' ||'PERSON' \"SOURCESYSTEMID\"" + " FROM PERSON P  WHERE P.PERSON_ID is not NULL AND P.PERSON_NUMBER IS NOT NULL AND P.PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"

    },

    {
        DestinationEntity: 'PersonName',
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'PersonIdSourceSystemId', 'PersonNumber', 'LegislationCode', 'NameType', 'FirstName', 'MiddleNames', 'LastName', 'Title'],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date', 'Effective_End_Date', 'PersonIdSourceSystemId', 'PERSON_NUMBER', 'Legislation_Code', 'Name_Type', 'First_Name', 'Middle_Names', 'Last_Name', 'Title'],
        SourceQuery: "SELECT to_char(pn.effective_start_date,'YYYY/MM/DD') as effectivestartdate, to_char(pn.Effective_End_Date, 'YYYY/MM/DD') as EffectiveEndDate," + "  P.PERSON_NUMBER || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\"," + "pn. Person_Number as PersonNumber,pn. Legislation_Code as LegislationCode,'GLOBAL' as NameType, pn. First_Name as FirstName, pn. Middle_Names as MiddleNames," +
            "pn.Last_Name as LastName, pn.title as Title, 'EBS' AS SourceSystemOwner," + "P.PERSON_NUMBER || '_' || 'PERSON_NAME'  \"SOURCESYSTEMID\"" + " FROM PERSON_NAME pn INNER JOIN PERSON p on p.PERSON_ID = pn.PERSON_ID  WHERE pn.PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"

    },

    {
        DestinationEntity: "PersonLegislativeData",
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'PersonIdSourceSystemId', 'LegislationCode', 'HighestEducationLevel', 'MaritalStatus', 'MaritalStatusDate', 'Sex', 'PersonNumber'],
        SourceColumns: ['SOURCE_SYSTEM_OWNER', 'SOURCE_SYSTEM_ID', 'EFFECTIVE_START_DATE', 'EFFECTIVE_END_DATE', 'PersonIdSourceSystemId', 'Legislation_Code', 'Highest_Education_Level', 'Marital_Status', 'Marital_Status_Date', 'Sex', 'PERSON_NUMBER'],
        SourceQuery: "SELECT  PLI.PERSON_NUMBER AS PersonNumber, to_char(PLI.EFFECTIVE_START_DATE, 'YYYY/MM/DD') AS EffectiveStartDate, to_char(PLI.EFFECTIVE_END_DATE, 'YYYY/MM/DD') AS EffectiveEndDate," + " PLI.PERSON_NUMBER  || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\"" + ",PLI.Legislation_Code AS " +
            "LegislationCode,PLI.Highest_Education_Level AS HighestEducationLevel,PLI.Marital_Status AS MaritalStatus, PLI.Sex, PLI.Marital_Status_Date AS MaritalStatusDate,'EBS' AS SourceSystemOwner," +
            " PLI.PERSON_NUMBER || '_' || 'PERSON_LEGISLATIVE_DATA'  \"SOURCESYSTEMID\"" +
            " FROM PERSON_LEGISLATIVE_INFO PLI INNER JOIN PERSON P ON PLI.PERSON_ID = P.PERSON_ID where PLI.PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"
    },


    {
        DestinationEntity: "WorkRelationship",
        DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'LegalEmployerName', 'DateStart', 'ActionCode', 'PrimaryFlag', 'WorkerType', 'PersonIdSourceSystemId'],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Legal_Employer_Name', 'Date_Start', 'Action_Code', 'Primary_Flag', 'Worker_Type', 'PersonIdSourceSystemId'],
        SourceQuery: "select Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'   \"SOURCESYSTEMID\"," +
            "Legal_Employer_Name as LegalEmployerName, to_char(Date_Start, 'YYYY/MM/DD') as DateStart, Action_Code as ActionCode, Primary_Flag as PrimaryFlag, Worker_Type as WorkerType," + " PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\""
            + " FROM WORK_RELATIONSHIP WHERE PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"

    },


    {
        DestinationEntity: "WorkTerms",
        DestinationColumns: ['ActionCode', 'SourceSystemOwner', 'SourceSystemId', 'AssignmentName', 'AssignmentType', 'AssignmentNumber', 'AssignmentStatusTypeCode', 'EffectiveEndDate', 'EffectiveLatestChange', 'EffectiveSequence', 'EffectiveStartDate', 'SystemPersonType', 'BusinessUnitShortCode', 'LegalEmployerName', 'PersonIdSourceSystemId', 'PosIdSourceSystemId'],
        SourceColumns: ['Action_Code', 'Source_System_Owner', 'Source_System_Id', 'Assignment_Name', 'Assignment_Type', 'Assignment_Number', 'Assignment_Status_Type_Code', 'Effective_End_Date', 'Effective_Latest_Change', 'Effective_Sequence', 'Effective_Start_Date', 'System_Person_Type', 'Business_Unit_Short_Code', 'Legal_Employer_Name', 'PersonIdSourceSystemId', 'PosIdSourceSystemId'],
        SourceQuery: "select Action_Code as ActionCode, Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'ETERM' \"SOURCESYSTEMID\"" + ",Assignment_Name as AssignmentName,Assignment_Type as AssignmentType," + " Assignment_Name || PERSON_NUMBER \"ASSIGNMENTNUMBER\""
            + ", Assignment_Status_Type_Code as AssignmentStatusTypeCode, to_char(Effective_End_Date, 'YYYY/MM/DD') as EffectiveEndDate, Effective_Latest_Change as EffectiveLatestChange, Effective_Sequence as EffectiveSequence, to_char(Effective_Start_Date, 'YYYY/MM/DD') as EffectiveStartDate,"
            + " System_Person_Type as SystemPersonType, Business_Unit_Short_Code as BusinessUnitShortCode, Legal_Employer_Name as LegalEmployerName," + " PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\"" + ", PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'\"POSIDSOURCESYSTEMID\"" +
            " FROM WORK_TERMS WHERE PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"


    },

    {
        DestinationEntity: "Assignment",
        DestinationColumns: ['ActionCode', 'SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'EffectiveSequence', 'EffectiveLatestChange', 'AssignmentType', 'AssignmentName', 'AssignmentNumber', 'AssignmentStatusTypeCode', 'BusinessUnitShortCode', 'LegalEmployerName', 'PosIdSourceSystemId', 'PersonIdSourceSystemId', 'PersonTypeCode', 'PrimaryFlag', 'SystemPersonType', 'WtaIdSourceSystemId', 'JobCode', 'DepartmentId', 'LocationCode', 'GradeCode'],
        SourceColumns: ['Action_Code', 'Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date', 'Effective_End_Date', 'Effective_Sequence', 'Effective_Latest_Change', 'Assignment_Type', 'Assignment_Name', 'Assignment_Number', 'Assignment_Status_Type_Code', 'Business_Unit_Short_Code', 'Legal_Employer', 'PosIdSourceSystemId', 'PersonIdSourceSystemId', 'Person_Type_Code', 'Primary_Flag', 'System_Person_Type', 'WtaIdSourceSystemId', 'JobCode', 'DepartmentId', 'LocationCode', 'GradeCode'],
        SourceQuery: "select Action_Code as ActionCode, Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'ASG' \"SOURCESYSTEMID\"" + ",to_char(Effective_Start_Date,'YYYY/MM/DD') as EffectiveStartDate,to_char(Effective_End_Date, 'YYYY/MM/DD') as EffectiveEndDate, Effective_Sequence as EffectiveSequence,"
            + "Effective_Latest_Change as EffectiveLatestChange, Assignment_Type as AssignmentType,Assignment_Name as AssignmentName," + " Assignment_Name || PERSON_NUMBER \"ASSIGNMENTNUMBER\""
            + ",Assignment_Status_Type_Code as AssignmentStatusTypeCode,Business_Unit_Short_Code as BusinessUnitShortCode, Legal_Employer as LegalEmployerName," + " PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'\"POSIDSOURCESYSTEMID\""
            + ", PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\"" + ",Person_Type_Code as PersonTypeCode, Primary_Flag as PrimaryFlag, System_Person_Type as SystemPersonType,"
            + " PERSON_NUMBER || '_' || 'ETERM'   \"WTAIDSOURCESYSTEMID\"" + ",JobCode , DepartmentId , LocationCode , GradeCode " + " FROM ASSIGNMENT  WHERE PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)" 

    }

    // {
    //     DestinationEntity: "PersonNationalIdentifier",
    //     DestinationColumns: ['PersonNumber', 'LegislationCode', 'IssueDate', 'ExpirationDate', 'PlaceOfIssue', 'NationalIdentifierType', 'NationalIdentifierNumber', 'PrimaryFlag', 'SourceSystemOwner', 'SourceSystemId'],
    //     SourceColumns: ['PERSON_NUMBER','Legislation_Code','Issue_Date','Expiration_Date','Place_Of_Issue','National_Identifier_Type','National_Identifier_Number','Primary_Flag','SOURCE_SYSTEM_OWNER','SOURCE_SYSTEM_ID'], 
    //     SourceQuery: "select pni.PERSON_NUMBER as PersonNumber ,pni.Legislation_Code as LegislationCode ,pni.Issue_Date as IssueDate,pni.Expiration_Date as  ExpirationDate,pni.Place_Of_Issue as PlaceOfIssue,pni.National_Identifier_Type as NationalIdentifierType, pni.National_Identifier_Number as NationalIdentifierNumber, pni.Primary_Flag as PrimaryFlag, 'EBS' as SourceSystemOwner," +
    //     "'PERSON_NATIONAL_IDENTIFIER' || '_' || pni.PERSON_ID \"SOURCESYSTEMID\"" + " FROM person_national_identifier pni inner join person p on p.person_id = pni.person_id"

    // },


    //     {
    //         DestinationEntity: 'PersonPhone',
    //         DestinationColumns: ['PhoneType', 'DateFrom' , 'DateTo','PersonNumber', 'CountryCodeNumber', 'AreaCode', 'PhoneNumber',  'Extension', 'LegislationCode', 'PrimaryFlag',   'SourceSystemOwner', 'SourceSystemId' ],
    //         SourceColumns: ['Phone_Type', 'Date_From', 'Date_To', 'Person_Number', 'Country_Code_Number', 'AREA_CODE', 'Phone_Number', 'Extension', 'Legislation_Code', 'Primary_Flag', 'Source_System_Owner', 'Source_System_Id'],
    //         SourceQuery: "SELECT pp.Phone_Type as PhoneType , pp.Date_From as DateFrom, pp.Date_To as DateTo, pp.Person_Number as PersonNumber, pp.Country_Code_Number as CountryCodeNumber, pp.AREA_CODE as AreaCode, pp.Phone_Number as PhoneNumber, pp.Extension as Extension, pp.Legislation_Code as LegislationCode, pp.Primary_Flag as PrimaryFlag, 'EBS' AS SourceSystemOwner," +
    //         "'PERSON_PHONE'|| '_' || pp.PERSON_ID \"SourceSystemId\"" + " FROM PERSON_PHONE pp INNER JOIN PERSON p ON p.PERSON_ID = pp.PERSON_ID"

    //     },
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




class HdlController {

    constructor() {
        this.lookupObj = lookupObj;
        this.DataTransferRulesForDefaultTransfers = DataTransferRulesForDefaultTransfers;
    }

    async convert() {
        try {
            var HDLEntries = [];
            //Iterating over array collection of entities
            const PromiseEntries = DataTransferRulesForDefaultTransfers.map(async (rule) => {
                //Get Data for each entity defined in arry of objects
                var dbResult = await Database.connection('oracledb').raw(rule.SourceQuery);
                console.log(dbResult);

                //Initi the entities to be written to file
                var metadataLine = "METADATA|" + rule.DestinationEntity

                var mergelineObject = [];

                //including data mapping values in hdl generation

                var mappings = [];

                var dataMappings = await hdlMappings.getMappingsByEntityId()
                console.log(dataMappings);

                // var entity = "Person_name"
                var MappedEntity = dataMappings.filter(e => {
                   
                        var entity = lookupObj[e.ENTITY_NAME];

                        console.log(entity);

                        if (entity.toUpperCase() === rule.DestinationEntity.toUpperCase())
                            return e


                    
                })
                console.log(MappedEntity);
                var mapData = MappedEntity.map(me => {
                    return { 'SourceData': me.SOURCE_DATA, 'DestData': me.DESTINATION_DATA, 'SourceColumn': me.SOURCE_COLUMN_NAME, 'Entity': me.ENTITY_NAME }
                });
                console.log(mapData);

                //sorting keys for each entity in array collection
                if (dbResult) {
                    var keys = Object.keys(dbResult[0]).sort();
                    console.log(keys);


                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i] === 'PERSONIDSOURCESYSTEMID') {
                            metadataLine = metadataLine + "|" + "PersonId(SourceSystemId)"
                        } else
                            if (keys[i] === 'POSIDSOURCESYSTEMID') {
                                metadataLine = metadataLine + "|" + "PeriodOfServiceId(SourceSystemId)"
                            }

                            else
                                if (keys[i] === 'WTAIDSOURCESYSTEMID') {
                                    metadataLine = metadataLine + "|" + "WorkTermsAssignmentId(SourceSystemId)"
                                }
                                else {
                                    for (var k = 0; k < rule.DestinationColumns.length; k++) {
                                        if (rule.DestinationColumns[k].toUpperCase() === keys[i]) {
                                            metadataLine = metadataLine + "|" + rule.DestinationColumns[k];
                                            console.log(metadataLine);
                                            break;
                                        }
                                    }


                                }
                    }
                    dbResult.forEach(eachResult => {
                        //forming merge lines for array of objects..
                        var mergeLine = "MERGE|" + rule.DestinationEntity

                        // mergeLine = mergeLine + "|" + mapping;


                        for (var i = 0; i < keys.length; i++) {

                            for (var j = 0; j < mapData.length; j++) {

                                if (keys[i] === mapData[j].SourceColumn) {
                                    if(mapData[j].SourceData!=null && eachResult[keys[i]] != null){
                                        if (mapData[j].SourceData.toUpperCase() === eachResult[keys[i]].toUpperCase()) {
                                            eachResult[keys[i]] = mapData[j].DestData;
                                           
                                        }    
                                    }
                                   

                                }
                                // mergeLine = mergeLine + "|" + eachResult[keys[i]]
                            }



                            if (eachResult[keys[i]] === null) {
                                mergeLine = mergeLine + "|"
                            }
                            else {
                                mergeLine = mergeLine + "|" + eachResult[keys[i]];
                            }
                            //  console.log(mergeLine);
                        }

                        mergelineObject.push(mergeLine);
                    })

                    console.log(mergelineObject);

                }

                if (dbResult.length == 0) {
                    var HDLEntry = {
                        header: metadataLine
                    }
                }
                else {
                    var HDLEntry = {
                        header: metadataLine,
                        data: mergelineObject
                    }
                }

                return HDLEntry;
                // HDLEntries.push(HDLEntry);
                // console.log(HDLEntries);


            });

            HDLEntries = await Promise.all(PromiseEntries);
            console.log(HDLEntries);

            // return response.send({data:HDLEntries})
            return ({ data: HDLEntries, error: null });

        }

        catch (err) {
            console.log(err);
            return ({ data: null, error: err });

        }

        // finally {
        //     Database.close(['oracledb']);
        // }
    }




    async download({ request, response, error }) {
        var convertStatus = await this.convert();

        if (convertStatus.data == null) {
            response.send(convertStatus.error)
            return
        }
        var HDLEntries = convertStatus.data

        var projectname = "Worker"
        var fileloc = 'public/hdls/' + projectname + '.dat';
        var filepath = '/hdls/' + projectname + '.dat';


        try {


            fs.open(fileloc, 'w', function (err, file) {
                if (err) {
                    console.error("open error:  " + err.message);
                }
                else {
                    var failed = false
                    for (var i = 0; i < HDLEntries.length; i++) {
                        fs.appendFileSync(file, HDLEntries[i].header + "\n", function (error) {
                            console.log(error);
                            failed = false
                        })
                        for (var j = 0; j < HDLEntries[i].data.length; j++) {
                            fs.appendFileSync(file, HDLEntries[i].data[j] + "\n", function (error) {
                                console.log(error);
                            })
                        }
                        fs.appendFileSync(file, "\n", function (error) {
                            console.log(error);
                        })
                    }
                    fs.close(file, function (error) {
                        if (error) {
                            console.error("close error:  " + error.message);

                        } else {
                            console.log("File was closed!");


                        }
                    });

                    if (failed) {
                        response.send({ error: "HDL generation not successful " })
                    }
                }

            })
            return response.send({ loc: filepath })
        }
        catch (error) {
            response.send(JSON.stringify(error))
        }
    }


    async hdlMappings({ request, response, error }) {

        try {


            var dataArray = await hdlMappings.getMappingsByEntityId()
            console.log(dataArray);

            // var entity = "PersonName";
            var newentity = entity.replace("Person_name", "PersonName");
            console.log(newentity);

            var MappedEntity = dataArray.filter(e => {
                entity = e.ENTITY_NAME.replace(e.ENTITY_NAME, "PersonName")
                if (entity.toUpperCase() === entity.toUpperCase())
                    return e
            });
            console.log(MappedEntity);
            var mapData = MappedEntity.map(me => { return { 'SourceData': me.SOURCE_DATA, 'DestData': me.DESTINATION_DATA } });
            console.log(mapData);

        }
        catch (error) {
            console.log(error)
            return response.status(400).send({ success: false, msg: 'error while data mappings list', data: null, err: error });
        }
    }


    async processSupervisor() {
        //Get Data from Supervisor Mappings tablee
        try {
            var SupervisorMappings = await Database.connection('oracledb').select('*').from('SUPERVISOR_MAPPINGS');
            for (var i = 0; i < SupervisorMappings.length; i++) {
                var empNumber = SupervisorMappings[i].EMPLOYEENUMBER;
                var mgrNumber = SupervisorMappings[i].SUPERVISORNUMBER;
                var assignmentObj = await Database.connection('oracledb').select('*')
                    .from('ASSIGNMENT');
                var empAssignmentObj = assignmentObj.find(a => a.PERSON_NUMBER === empNumber);
                var mgrAssignmentObj = assignmentObj.find(a => a.PERSON_NUMBER === mgrNumber);

                var effective_start_date = moment(Date.parse(empAssignmentObj.EFFECTIVE_START_DATE.toString().split('-').reverse().join(' '))).format('DD-MMM-YY');
                console.log(effective_start_date);

                // var empAssignmentObj = await Database.connection('oracledb').select('*')
                //                             .from('ASSIGNMENT').where('PERSON_NUMBER',empNumber);
                //  var mgrAssignmentObj = await Database.connection('oraledb').select('*')
                //                         .from('ASSIGNMENT').where('PERSON_NUMBER',mgrNumber);           

                //Get Assignment SOurce SystemId for the Employee
                //Format : " PERSON_NUMBER || '_' || 'ASG' \"SOURCESYSTEMID\"
                var assignmentSourceSystemId = empNumber + "_ASG";
                var effectiveStartDate = effective_start_date;
                var effectiveEndDate = empAssignmentObj.EFFECTIVE_END_DATE;
                var mgrAssignmentNumber = mgrNumber + "_ASG";
                var mgrId = mgrNumber + "_PERSON";
                var mgrType = mgrAssignmentObj.ASSIGNMENT_NAME;
                var primaryFlag = mgrAssignmentObj.PRIMARY_FLAG;
                var sourcesystemowner = empAssignmentObj.SOURCE_SYSTEM_OWNER;
                var personnumber = empNumber;

                // Insert into Supervisor table from which we read and generate the HDL

                var spvsrObj = {
                    ASSIGNMENT_NUMBER: empNumber,
                    EFFECTIVE_START_DATE: effectiveStartDate,
                    EFFECTIVE_END_DATE: effectiveEndDate,
                    MANAGER_ID: mgrId,
                    MANAGER_ASSIGNMENT_NUMBER: mgrAssignmentNumber,
                    MANAGER_TYPE: mgrType,
                    PRIMARY_FLAG: primaryFlag,
                    SOURCE_SYSTEM_OWNER: sourcesystemowner,
                    PERSON_NUMBER:personnumber

                };
                var insStatus = await Database.connection('oracledb').insert(spvsrObj)
                    .into('SUPERVISOR');

                console.log(insStatus);

            }
            return ({ data: "Successfully inserted", error: null });
        }
        catch (error) {
            console.log(error)
        }
    }

    async GetSupervisorHdl() {
        var SupervisorHdlMetadataObj = {
            DestinationEntity: 'AssignmentSupervisor',
            DestinationColumns: ['AsgIdSourceSystemId', 'SourceSystemOwner', 'SourceSystemId', 'EffectiveStartDate', 'EffectiveEndDate', 'ManAssIdSourceSystemId', 'ManIdSourceSystemId', 'ManagerType', 'PersonIdSourceSystemId', 'PrimaryFlag'],
            SourceColumns: ['AsgIdSourceSystemId', 'Source_System_Owner', 'SourceSystemId', 'Effective_Start_Date', 'Effective_End_Date', 'MANAGER_ASSIGNMENT_NUMBER', 'MANAGER_ID', 'MANAGER_TYPE', 'PersonIdSourceSystemId', 'Primary_Flag'],
            SourceQuery: "select sup.ASSIGNMENT_NUMBER || '_' || 'ASG' \"ASGIDSOURCESYSTEMID\"" + ",'EBS' as SourceSystemOwner," +
                "sup.ASSIGNMENT_NUMBER || '_' || 'ASGSUP' \"SOURCESYSTEMID\"" + ",to_char(sup.EFFECTIVE_START_DATE, 'YYYY/MM/DD')  AS EffectiveStartDate, to_char(sup.EFFECTIVE_END_DATE, 'YYYY/MM/DD')  AS EffectiveEndDate," +
                "sup.MANAGER_ASSIGNMENT_NUMBER  \"MANASSIDSOURCESYSTEMID\"" + ", sup.MANAGER_ID \"MANIDSOURCESYSTEMID\"" + ", 'LINE_MANAGER' as ManagerType ," + "sup.ASSIGNMENT_NUMBER || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\"" +
                ", sup.Primary_Flag as PrimaryFlag FROM SUPERVISOR sup WHERE sup.PERSON_NUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"


        }
        try {
            //Get Data for  entity defined in arry of object
            var dbResult = await Database.connection('oracledb').raw(SupervisorHdlMetadataObj.SourceQuery);
            console.log(dbResult);

            //Initi the entities to be written to file
            var metadataLine = "METADATA|" + SupervisorHdlMetadataObj.DestinationEntity

            var mergelineObject = [];

            //sorting keys for each entity in array collection
            if (dbResult) {
                var keys = Object.keys(dbResult[0]).sort();
                console.log(keys);

                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === 'ASGIDSOURCESYSTEMID') {
                        metadataLine = metadataLine + "|" + "AssignmentId(SourceSystemId)"
                    }
                    else if (keys[i] === 'MANASSIDSOURCESYSTEMID') {
                        metadataLine = metadataLine + "|" + "ManagerAssignmentId(SourceSystemId)"
                    }
                    else if (keys[i] === 'MANIDSOURCESYSTEMID') {
                        metadataLine = metadataLine + "|" + "ManagerId(SourceSystemId)"
                    }
                    else if (keys[i] === 'PERSONIDSOURCESYSTEMID') {
                        metadataLine = metadataLine + "|" + "PersonId(SourceSystemId)"
                    }
                    else {
                        for (var k = 0; k < SupervisorHdlMetadataObj.DestinationColumns.length; k++) {
                            if (SupervisorHdlMetadataObj.DestinationColumns[k].toUpperCase() === keys[i]) {
                                metadataLine = metadataLine + "|" + SupervisorHdlMetadataObj.DestinationColumns[k];
                                console.log(metadataLine);
                                break;
                            }
                        }


                    }
                }

                //forming merge lines 

                for (var d = 0; d < dbResult.length; d++) {

                    var mergeLine = "MERGE|" + SupervisorHdlMetadataObj.DestinationEntity

                    for (var i = 0; i < keys.length; i++) {

                        if (dbResult[d][keys[i]] === null) {
                            mergeLine = mergeLine + "|"
                        }
                        else if (keys[i] === "SOURCESYSTEMID"){
                            mergeLine = mergeLine + "|" + dbResult[d][keys[i]] + "_" + d;
                        }
                        else {
                            mergeLine = mergeLine + "|" + dbResult[d][keys[i]];
                        }
                        console.log(mergeLine);
                    }
                    mergelineObject.push(mergeLine);
                }

                console.log(mergelineObject);

                var HDLEntry = {
                    header: metadataLine,
                    data: mergelineObject
                }
                console.log(HDLEntry);
                var HDLEntries = [];
                HDLEntries.push(HDLEntry)

                return HDLEntries;

            }
        }
        catch (err) {
            console.log(err);
        }
    }


    async generateSupervisiorHdl({ request, response, error }) {
        var cs = await this.GetSupervisorHdl();
        var convertStatus = cs[0];
        var HDLEntries = [];

        if (convertStatus.data == null) {
            response.send(convertStatus.error)
            return
        }
        HDLEntries.push(convertStatus)

        var projectname = "Worker"
        var fileloc = 'public/hdls/' + projectname + '.dat';
        var filepath = '/hdls/' + projectname + '.dat';


        try {
            fs.open(fileloc, 'w', function (err, file) {
                if (err) {
                    console.error("open error:  " + err.message);
                }
                else {
                    var failed = false
                    for (var i = 0; i < HDLEntries.length; i++) {
                        fs.appendFileSync(file, HDLEntries[i].header + "\n", function (error) {
                            console.log(error);
                            failed = false
                        })
                        for (var j = 0; j < HDLEntries[i].data.length; j++) {
                            fs.appendFileSync(file, HDLEntries[i].data[j] + "\n", function (error) {
                                console.log(error);
                            })
                        }
                        fs.appendFileSync(file, "\n", function (error) {
                            console.log(error);
                        })
                    }
                    fs.close(file, function (error) {
                        if (error) {
                            console.error("close error:  " + error.message);

                        } else {
                            console.log("File was closed!");


                        }
                    });

                    if (failed) {
                        response.send({ error: "HDL generation not successful " })
                    }
                }

            })
            return response.send({ loc: filepath })
        }
        catch (error) {
            response.send(JSON.stringify(error))
        }
    }

    async CreateSalaryBasis() {
        try {
            var dbSourceData = await Database.connection('oracledb').select('*').from('SOURCE_SALARY');
            var dataMappings = await hdlMappings.getMappingsByEntityId()
            console.log(dataMappings);

            //Filter Mappings for SalaryBasis
            var MappedEntity = dataMappings.filter(e => {

                if (e.ENTITY_NAME.toUpperCase() === 'PERSON_SALARY')
                    return e

            });
            console.log(MappedEntity);
            var mapData = MappedEntity.map(me => {
                return { 'SourceData': me.SOURCE_DATA, 'DestData': me.DESTINATION_DATA, 'SourceColumn': me.SOURCE_COLUMN_NAME, 'Entity': me.ENTITY_NAME }
            });
            var assignmentObj = await Database.connection('oracledb').select('*')
                .from('ASSIGNMENT');

            if (dbSourceData != null) {
                for (var i = 0; i < dbSourceData.length; i++) {
                    var salBasis = mapData.find(md => md.SourceData.toUpperCase() == dbSourceData[i].SALARY_BASIS_NAME.toUpperCase());
                    if (salBasis) {

                        // var empAssignmentObj = assignmentObj.find(a => a.PERSON_NUMBER === dbSourceData[i].PERSON_NUMBER);
                        if (dbSourceData.DATE_FROM) {
                            var Date_From = moment(Date.parse(dbSourceData[i].DATE_FROM.toString().split('-').reverse().join(' '))).format('DD-MMM-YY');
                        }
                        if (dbSourceData.DATE_TO) {
                            var Date_To = moment(Date.parse(dbSourceData[i].DATE_TO.toString().split('-').reverse().join(' '))).format('DD-MMM-YY');
                        }

                        var obj = {
                            ACTIONCODE: 'CHANGE_SALARY',
                            ASSIGNMENTID: dbSourceData[i].PERSON_NUMBER + "_ASG",
                            DATEFROM: Date_From,
                            DATETO: Date_To,
                            SALARYAMOUNT: dbSourceData[i].SALARY_AMOUNT,
                            SALARYBASISNAME: salBasis.DestData,
                            SALARYAPPROVED: 'Y',
                            PERSONNUMBER: dbSourceData[i].PERSON_NUMBER
                        };
                        var res = await Database.connection('oracledb').insert(obj).into('SALARY');
                        console.log(res);
                    }
                }
            }

            return ({ data: "Salary data successfully inserted", error: null });
        }
        catch (err) {
            console.log(err);
        }
    }

    async GetSalaryHdl() {
        var SalaryHdlMetadataObj = {
            DestinationEntity: 'Salary',
            DestinationColumns: ['SourceSystemOwner', 'SourceSystemId', 'ActionCode', 'AssIdSourceSystemId', 'DateFrom', 'DateTo', 'SalaryAmount', 'SalaryBasisName', 'SalaryApproved', 'PersonNumber'],
            SourceColumns: ['SourceSystemOwner', 'SourceSystemId', 'ActionCode', 'AssIdSourceSystemId', 'DateFrom', 'DateTo', 'SalaryAmount', 'SalaryBasisName', 'SalaryApproved', 'PersonNumber'],
            SourceQuery: "SELECT 'EBS' as SourceSystemOwner, 'SALID'|| '_' || sa.ASSIGNMENTID   \"SOURCESYSTEMID\", sa.ActionCode," + "sa.ASSIGNMENTID || '_' || 'ASG' \"ASSIDSOURCESYSTEMID\", to_char(sa.DateFrom, 'YYYY/MM/DD')  AS DateFrom, to_char(sa.DateTo, 'YYYY/MM/DD')  AS DateTo, sa.SalaryAmount, sa.SalaryBasisName, sa.SalaryApproved" + " from salary sa WHERE sa.PERSONNUMBER in (SELECT MAPPED_PERSON_NUMBER FROM VALIDATIONS_DATA)"

        }
        try {
            //Get Data for  entity defined in arry of object
            var dbResult = await Database.connection('oracledb').raw(SalaryHdlMetadataObj.SourceQuery);
            console.log(dbResult);

            //Initi the entities to be written to file
            var metadataLine = "METADATA|" + SalaryHdlMetadataObj.DestinationEntity

            var mergelineObject = [];

            //sorting keys for each entity in array collection
            if (dbResult) {
                var keys = Object.keys(dbResult[0]).sort();
                console.log(keys);

                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === 'ASSIDSOURCESYSTEMID') {
                        metadataLine = metadataLine + "|" + "AssignmentId(SourceSystemId)"
                    }
                    else {
                        for (var k = 0; k < SalaryHdlMetadataObj.DestinationColumns.length; k++) {
                            if (SalaryHdlMetadataObj.DestinationColumns[k].toUpperCase() === keys[i]) {
                                metadataLine = metadataLine + "|" + SalaryHdlMetadataObj.DestinationColumns[k];
                                console.log(metadataLine);
                                break;
                            }
                        }


                    }
                }

                //forming merge lines 

                for (var d = 0; d < dbResult.length; d++) {

                    var mergeLine = "MERGE|" + SalaryHdlMetadataObj.DestinationEntity

                    for (var i = 0; i < keys.length; i++) {

                        if (dbResult[d][keys[i]] === null) {
                            mergeLine = mergeLine + "|"
                        }
                        else if (keys[i] === "SOURCESYSTEMID") {
                            mergeLine = mergeLine + "|" + dbResult[d][keys[i]] + "_" + d
                        }
                        else {
                            mergeLine = mergeLine + "|" + dbResult[d][keys[i]];
                        }
                        console.log(mergeLine);
                    }
                    mergelineObject.push(mergeLine);
                }

                console.log(mergelineObject);

                var HDLEntry = {
                    header: metadataLine,
                    data: mergelineObject
                }
                console.log(HDLEntry);
                var HDLEntries = [];
                HDLEntries.push(HDLEntry)

                return HDLEntries;

            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async generateSalaryHdl({ request, response, error }) {
        var cs = await this.GetSalaryHdl();
        var convertStatus = cs[0];
        var HDLEntries = [];

        if (convertStatus.data == null) {
            response.send(convertStatus.error)
            return
        }
        HDLEntries.push(convertStatus)

        var projectname = "Worker"
        var fileloc = 'public/hdls/' + projectname + '.dat';
        var filepath = '/hdls/' + projectname + '.dat';


        try {
            fs.open(fileloc, 'w', function (err, file) {
                if (err) {
                    console.error("open error:  " + err.message);
                }
                else {
                    var failed = false
                    for (var i = 0; i < HDLEntries.length; i++) {
                        fs.appendFileSync(file, HDLEntries[i].header + "\n", function (error) {
                            console.log(error);
                            failed = false
                        })
                        for (var j = 0; j < HDLEntries[i].data.length; j++) {
                            fs.appendFileSync(file, HDLEntries[i].data[j] + "\n", function (error) {
                                console.log(error);
                            })
                        }
                        fs.appendFileSync(file, "\n", function (error) {
                            console.log(error);
                        })
                    }
                    fs.close(file, function (error) {
                        if (error) {
                            console.error("close error:  " + error.message);

                        } else {
                            console.log("File was closed!");


                        }
                    });

                    if (failed) {
                        response.send({ error: "HDL generation not successful " })
                    }
                }

            })
            return response.send({ loc: filepath })
        }
        catch (error) {
            response.send(JSON.stringify(error))
        }
    }
}
module.exports = HdlController

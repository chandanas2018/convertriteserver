'use strict'
const Database = use('Database');
const moment = use('moment');
const Logger = use('Logger');
// const Helpers = use('Helpers');
const fs = require('fs');

const DataTransferRulesForDefaultTransfers = [
    {
        DestinationEntity: "Worker",
        DestinationColumns: [ 'SourceSystemOwner', 'SourceSystemId','EffectiveStartDate',  'EffectiveEndDate',  'PersonNumber', 'StartDate', 'DateOfBirth','ActionCode' ],
        SourceColumns: ['Source_System_Owner', 'Source_System_Id', 'Effective_Start_Date','EFFECTIVE_END_DATE', 'Person_Number','Start_Date','DATE_OF_BIRTH', 'ActionCode'],
        SourceQuery: "SELECT P.EFFECTIVE_START_DATE AS EffectiveStartDate, P.EFFECTIVE_END_DATE AS EffectiveEndDate,P.PERSON_NUMBER AS PersonNumber, P.Start_Date as StartDate, P.DATE_OF_BIRTH AS DateOfBirth, 'EBS' As SourceSystemOwner, 'HIRE' as ActionCode,"+
           " P.PERSON_NUMBER || '_' ||'PERSON' \"SOURCESYSTEMID\""  + " FROM PERSON P  WHERE P.PERSON_ID is not NULL AND P.PERSON_NUMBER IS NOT NULL"

    },

    {
        DestinationEntity: 'PersonName',
        DestinationColumns: ['SourceSystemOwner','SourceSystemId','EffectiveStartDate', 'EffectiveEndDate', 'PersonIdSourceSystemId','PersonNumber', 'LegislationCode', 'NameType',  'FirstName', 'MiddleNames', 'LastName',   'Title'],
        SourceColumns: ['Source_System_Owner','Source_System_Id','Effective_Start_Date', 'Effective_End_Date', 'PersonIdSourceSystemId','PERSON_NUMBER', 'Legislation_Code', 'Name_Type', 'First_Name', 'Middle_Names', 'Last_Name','Title'],
        SourceQuery: "SELECT pn.effective_start_date as effectivestartdate, pn.Effective_End_Date as EffectiveEndDate,"+"  P.PERSON_NUMBER || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\","+"pn. Person_Number as PersonNumber,pn. Legislation_Code as LegislationCode,'GLOBAL' as NameType, pn. First_Name as FirstName, pn. Middle_Names as MiddleNames," +
        "pn. Last_Name as LastName, pn.title as Title, 'EBS' AS SourceSystemOwner," + "P.PERSON_NUMBER || '_' || 'PERSON_NAME'  \"SOURCESYSTEMID\"" + " FROM PERSON_NAME pn INNER JOIN PERSON p on p.PERSON_ID = pn.PERSON_ID"
    
    },

    {
        DestinationEntity: "PersonLegislativeData",
        DestinationColumns: [ 'SourceSystemOwner', 'SourceSystemId','EffectiveStartDate', 'EffectiveEndDate', 'PersonIdSourceSystemId','LegislationCode', 'HighestEducationLevel', 'MaritalStatus', 'MaritalStatusDate', 'Sex', 'PersonNumber' ],
        SourceColumns: ['SOURCE_SYSTEM_OWNER','SOURCE_SYSTEM_ID','EFFECTIVE_START_DATE','EFFECTIVE_END_DATE','PersonIdSourceSystemId','Legislation_Code','Highest_Education_Level','Marital_Status','Marital_Status_Date','Sex','PERSON_NUMBER'], 
        SourceQuery: "SELECT  PLI.PERSON_NUMBER AS PersonNumber,PLI.EFFECTIVE_START_DATE AS EffectiveStartDate,PLI.EFFECTIVE_END_DATE AS EffectiveEndDate,"+" PLI.PERSON_NUMBER  || '_' || 'PERSON' \"PERSONIDSOURCESYSTEMID\""+",PLI.Legislation_Code AS " +
            "LegislationCode,PLI.Highest_Education_Level AS HighestEducationLevel,PLI.Marital_Status AS MaritalStatus, PLI.Sex, PLI.Marital_Status_Date AS MaritalStatusDate,'EBS' AS SourceSystemOwner," +
            " PLI.PERSON_NUMBER || '_' || 'PERSON_LEGISLATIVE_DATA'  \"SOURCESYSTEMID\"" +
            " FROM PERSON_LEGISLATIVE_INFO PLI INNER JOIN PERSON P ON PLI.PERSON_ID = P.PERSON_ID"
    },


    {
        DestinationEntity: "WorkRelationship",
        DestinationColumns: ['SourceSystemOwner','SourceSystemId', 'LegalEmployerName', 'DateStart','ActionCode','PrimaryFlag','WorkerType','PersonIdSourceSystemId'],
        SourceColumns: ['Source_System_Owner','Source_System_Id', 'Legal_Employer_Name', 'Date_Start','Action_Code','Primary_Flag','Worker_Type','PersonIdSourceSystemId'],
        SourceQuery: "select Source_System_Owner as SourceSystemOwner," +" PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'   \"SOURCESYSTEMID\"," + 
        "Legal_Employer_Name as LegalEmployerName, Date_Start as DateStart, Action_Code as ActionCode, Primary_Flag as PrimaryFlag, Worker_Type as WorkerType," + " PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\""
        + " FROM WORK_RELATIONSHIP "
         
    },


    {
        DestinationEntity: "WorkTerms",
        DestinationColumns: ['ActionCode','SourceSystemOwner','SourceSystemId','AssignmentName','AssignmentType','AssignmentNumber','AssignmentStatusTypeCode','EffectiveEndDate','EffectiveLatestChange','EffectiveSequence','EffectiveStartDate','SystemPersonType','BusinessUnitShortCode','LegalEmployerName','PersonIdSourceSystemId','PosIdSourceSystemId'],
        SourceColumns: ['Action_Code','Source_System_Owner','Source_System_Id','Assignment_Name','Assignment_Type','Assignment_Number','Assignment_Status_Type_Code','Effective_End_Date','Effective_Latest_Change','Effective_Sequence','Effective_Start_Date','System_Person_Type','Business_Unit_Short_Code','Legal_Employer_Name','PersonIdSourceSystemId','PosIdSourceSystemId'],
        SourceQuery: "select Action_Code as ActionCode, Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'ETERM' \"SOURCESYSTEMID\"" + ",Assignment_Name as AssignmentName,Assignment_Type as AssignmentType," + " Assignment_Name || PERSON_NUMBER \"ASSIGNMENTNUMBER\""
        + ", Assignment_Status_Type_Code as AssignmentStatusTypeCode, Effective_End_Date as EffectiveEndDate, Effective_Latest_Change as EffectiveLatestChange, Effective_Sequence as EffectiveSequence, Effective_Start_Date as EffectiveStartDate," 
        + " System_Person_Type as SystemPersonType, Business_Unit_Short_Code as BusinessUnitShortCode, Legal_Employer_Name as LegalEmployerName," + " PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\"" + ", PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'\"POSIDSOURCESYSTEMID\"" +
        " FROM WORK_TERMS "
    
   
    },
    
    {     DestinationEntity: "Assignment",
    DestinationColumns: ['ActionCode','SourceSystemOwner','SourceSystemId','EffectiveStartDate','EffectiveEndDate','EffectiveSequence','EffectiveLatestChange','AssignmentType','AssignmentName','AssignmentNumber','AssignmentStatusTypeCode','BusinessUnitShortCode','LegalEmployerName','PosIdSourceSystemId','PersonIdSourceSystemId','PersonTypeCode','PrimaryFlag','SystemPersonType','WtaIdSourceSystemId','JobCode','DepartmentName','LocationCode'],
    SourceColumns: ['Action_Code','Source_System_Owner','Source_System_Id','Effective_Start_Date','Effective_End_Date','Effective_Sequence','Effective_Latest_Change','Assignment_Type','Assignment_Name','Assignment_Number','Assignment_Status_Type_Code','Business_Unit_Short_Code','Legal_Employer','PosIdSourceSystemId','PersonIdSourceSystemId','Person_Type_Code','Primary_Flag','System_Person_Type','WtaIdSourceSystemId','Job_Code','Department_Name','Location_Code'],
    SourceQuery: "select Action_Code as ActionCode, Source_System_Owner as SourceSystemOwner," + " PERSON_NUMBER || '_' || 'ASG' \"SOURCESYSTEMID\"" + ",Effective_Start_Date as EffectiveStartDate,Effective_End_Date as EffectiveEndDate, Effective_Sequence as EffectiveSequence,"
    + "Effective_Latest_Change as EffectiveLatestChange, Assignment_Type as AssignmentType,Assignment_Name as AssignmentName," + " Assignment_Name || PERSON_NUMBER \"ASSIGNMENTNUMBER\"" 
    + ",Assignment_Status_Type_Code as AssignmentStatusTypeCode,Business_Unit_Short_Code as BusinessUnitShortCode, Legal_Employer as LegalEmployerName," + " PERSON_NUMBER || '_' || 'PERIOD_OF_SERVICE'\"POSIDSOURCESYSTEMID\"" 
    + ", PERSON_NUMBER || '_' || 'PERSON'   \"PERSONIDSOURCESYSTEMID\"" + ",Person_Type_Code as PersonTypeCode, Primary_Flag as PrimaryFlag, System_Person_Type as SystemPersonType,"
    + " PERSON_NUMBER || '_' || 'ETERM'   \"WTAIDSOURCESYSTEMID\"" + ",Job_Code as JobCode, Department_Name as DepartmentName, Location_Code as LocationCode " + " FROM ASSIGNMENTS_DEMO "

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


class HdlController {
    async convert() {
        try {
            var HDLEntries = [];

           // var connection = Database.connection('oracledb')

            for (var i = 0; i < DataTransferRulesForDefaultTransfers.length; i++) {
                Logger.info('Started writing to HDL File %s', DataTransferRulesForDefaultTransfers.length)
                var rule = DataTransferRulesForDefaultTransfers[i];

                var metadataline = "METADATA|" + rule.DestinationEntity
                var mergeline = "MERGE|" + rule.DestinationEntity

                var noDataPresent = false;

                var result = await Database.connection('oracledb').raw(rule.SourceQuery);
                console.log(rule.SourceQuery);
                console.log(result);
               

                for (var j = 0; j < rule.DestinationColumns.length; j++) {
                    if(rule.DestinationColumns[j] === 'PersonIdSourceSystemId'){
                        metadataline = metadataline + "|" + "PersonId(SourceSystemId)"
                    }else
                        if(rule.DestinationColumns[j] === 'PosIdSourceSystemId'){
                            metadataline = metadataline + "|" + "PeriodOfServiceId(SourceSystemId)"   
                        }

                     else
                     if(rule.DestinationColumns[j] === 'WtaIdSourceSystemId'){
                        metadataline = metadataline + "|" + "WorkTermsAssignmentId(SourceSystemId)"   
                    }
                    else{
                        metadataline = metadataline + "|" + rule.DestinationColumns[j] 
                    }
                  
                }
                
                    var mergelines = [];

                    for (var row = 0; row < result.length; row++) {


                        var keys = [];
                        //Changing some values in Result object from DB to match the Resultant HDL Schema
                        var keys = Object.keys(result[row]);
                        for(var k=0; k<keys.length; k++){
                           
                            // if( keys[k] == 'LEGISLATION_CODE'){                
                            //     if(Object.values(result[row]).LEGISLATION_CODE != 'US'){
                            //         result[row].LEGISLATION_CODE = 'US';
                            //     }
                            // }

                            // if(rule.DestinationEntity === "PersonDriversLicence" || rule.DestinationEntity === "PersonEthnicity"){
                            //     result[row].COUNTRY_CODE = 'US';
                            // }

                            // if(keys[k] == 'ACTION'){
                            //     if(result[row].ACTION === null || typeof(result[row].ACTION == "string")){
                            //         result[row].ACTION = 'HIRE';
                            //     }
                            // }
                        
                        }


                        function convert1() {
                            if (result[row].DATEOFBIRTH == null) {
                                result[row].DATEOFBIRTH = null
                            } else {
                                var c1 = moment(result[row].DATEOFBIRTH).format('YYYY/MM/DD');
                                result[row].DATEOFBIRTH = c1;
                            }
                        }

                        function convert2() {
                            if (result[row].DATEOFDEATH == null) {
                                result[row].DATEOFDEATH = null
                            }
                            else {
                                var c2 = moment(result[row].DATEOFDEATH).format('YYYY/MM/DD');
                                result[row].DATEOFDEATH = c2;
                            }
                        }


                        function convert3() {
                            if (result[row].EFFECTIVESTARTDATE == null ) {
                                result[row].EFFECTIVESTARTDATE = null
                            } else {
                                var c3 = moment(result[row].EFFECTIVESTARTDATE).format('YYYY/MM/DD');
                                 result[row].EFFECTIVESTARTDATE = c3;
                               
                            }
                        }

                        
                        function convert4() {
                            if (result[row].EFFECTIVEENDDATE == null ) {
                                result[row].EFFECTIVEENDDATE = '4712/12/31';
                            } else {
                               
                                var c4 = moment(result[row].EFFECTIVEENDDATE).format('YYYY/MM/DD');
                                result[row].EFFECTIVEENDDATE = c4;
                              

                            }
                        }
                        
                        function convert5(){
                            if (result[row].STARTDATE == null ) {
                                result[row].STARTDATE = null
                            } else {
                                var c5 = moment(result[row].STARTDATE).format('YYYY/MM/DD');
                                result[row].STARTDATE = c5;
                            }
                        }

                        function convert6(){
                            if (result[row].DATESTART == null) {
                                result[row].DATESTART = null
                            } else {
                                var c6 = moment(result[row].DATESTART).format('YYYY/MM/DD');
                                result[row].DATESTART = c6;
                            }
                        }

                        function convert7(){
                            if (result[row].DATETO == null ) {
                                result[row].DATETO = null
                            } else {
                                var c6 = moment(result[row].DATETO).format('YYYY/MM/DD');
                                result[row].DATETO = c7;
                            }
                        }
                       
                        

                        var rowData = Object.values(result[row])
                        convert1();
                        convert2();
                        convert3();
                        convert4();
                        convert5();
                        convert6();
                        // convert7();
                        
    
                        var newmergeline = mergeline;
                        if (rowData.length == rule.DestinationColumns.length) {
                            for (var j = 0; j < rowData.length; j++) {
                                if(result[row][rule.DestinationColumns[j].toUpperCase()]=== null){
                                    newmergeline = newmergeline + "|"
                                }
                                else
                                {
                                newmergeline = newmergeline + "|" + result[row][rule.DestinationColumns[j].toUpperCase()]
                                }

                            }
                        }
                        else {
                            //Error
                        }
                        mergelines.push(newmergeline)
                    }
               

                if(result.length == 0){
                    var HDLEntry = {
                        header: metadataline  
                    }
                } 
                else{
                    var HDLEntry = {
                        header: metadataline,
                        data : mergelines
                    }
                }   


               

                HDLEntries.push(HDLEntry)




            }
            return { data: HDLEntries, error: null };
             //return response.send({data:HDLEntries})
        }

        catch (err) {
            console.log(err);
            return { data: null, error: err }
        }
        // finally{
        //     Database.close(['oracledb']);
        //   }
    }

    async download({ request, response, error }) {
        var convertStatus = await this.convert();

        if (convertStatus.data == null) {
            response.send(convertStatus.error)
            return
        }
        var HDLEntries = convertStatus.data

        var projectname = "Worker"
        var fileloc = 'public/hdls/' + projectname +'.dat';
        var filepath = '/hdls/' + projectname +'.dat';


        try {


            fs.open(fileloc, 'w', function (err, file) {
                if (err) {
                    console.error("open error:  " + err.message);
                }
                else {
                    var failed = false
                    for (var i = 0; i < HDLEntries.length; i++) {
                        fs.appendFile(file, HDLEntries[i].header + "\n", function (error) {
                            console.log(error);
                            failed = false
                        })
                        for (var j = 0; j < HDLEntries[i].data.length; j++) {
                            fs.appendFile(file, HDLEntries[i].data[j] + "\n", function (error) {
                                console.log(error);
                            })
                        }
                        fs.appendFile(file, "\n", function (error) {
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
            return response.send( {loc: filepath })
        }
        catch (error) {
            response.send(JSON.stringify(error))
        }
    }

}
module.exports = HdlController

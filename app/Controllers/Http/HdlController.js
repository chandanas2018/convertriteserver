'use strict'
const Database = use('Database');
const moment = use('moment');
const Logger = use('Logger');
// const Helpers = use('Helpers');
const fs = require('fs');

const DataTransferRulesForDefaultTransfers = [
    {
        DestinationEntity: "Worker",
        DestinationColumns: [ 'EffectiveStartDate',  'EffectiveEndDate',  'PersonNumber', 'BloodType', 'CorrespondenceLanguage', 'DateOfBirth',  'DateOfDeath', 'CountryOfBirth', 'RegionOfBirth', 'TownOfBirth', 'PersonDuplicateCheck','SourceSystemOwner','ActionCode', 'SourceSystemId'],
        SourceColumns: ['PersonNumber', 'EffectiveStartDate', 'PersonID', 'EFFECTIVE_END_DATE', 'ActionCode', 'BLOOD_TYPE', 'CORRESPONDENCE_LANGUAGE', 'COUNTRY_OF_BIRTH', 'DATE_OF_BIRTH', 'DATE_OF_DEATH', 'PERSONDUPLICATECHECK'],
        SourceQuery: "SELECT P.EFFECTIVE_START_DATE AS EffectiveStartDate, P.EFFECTIVE_END_DATE AS EffectiveEndDate,P.PERSON_NUMBER AS PersonNumber,P.BLOOD_TYPE AS BloodType, " +
            "P.CORRESPONDENCE_LANGUAGE AS CorrespondenceLanguage,P.DATE_OF_BIRTH AS DateOfBirth, P.DATE_OF_DEATH AS DateOfDeath, " +
            "P.COUNTRY_OF_BIRTH AS CountryOfBirth, P.REGION_OF_BIRTH AS RegionOfBirth, P.TOWN_OF_BIRTH AS TownOfBirth, P.PERSONDUPLICATECHECK as PersonDuplicateCheck, 'EBS' As SourceSystemOwner, 'HIRE' as ActionCode,"+
           "'PERSON' || '_' || P.PERSON_ID  \"SOURCESYSTEMID\""  + " FROM PERSON P  WHERE P.PERSON_ID is not NULL AND P.PERSON_NUMBER IS NOT NULL"

    },

    {
        DestinationEntity: "PersonNationalIdentifier",
        DestinationColumns: ['PersonNumber', 'LegislationCode', 'IssueDate', 'ExpirationDate', 'PlaceOfIssue', 'NationalIdentifierType', 'NationalIdentifierNumber', 'PrimaryFlag', 'SourceSystemOwner', 'SourceSystemId'],
        SourceColumns: ['PERSON_NUMBER','Legislation_Code','Issue_Date','Expiration_Date','Place_Of_Issue','National_Identifier_Type','National_Identifier_Number','Primary_Flag','SOURCE_SYSTEM_OWNER','SOURCE_SYSTEM_ID'], 
        SourceQuery: "select pni.PERSON_NUMBER as PersonNumber ,pni.Legislation_Code as LegislationCode ,pni.Issue_Date as IssueDate,pni.Expiration_Date as  ExpirationDate,pni.Place_Of_Issue as PlaceOfIssue,pni.National_Identifier_Type as NationalIdentifierType, pni.National_Identifier_Number as NationalIdentifierNumber, pni.Primary_Flag as PrimaryFlag, 'EBS' as SourceSystemOwner," +
        "'PERSON_NATIONAL_IDENTIFIER' || '_' || pni.PERSON_ID \"SOURCESYSTEMID\"" + " FROM person_national_identifier pni inner join person p on p.person_id = pni.person_id"
         
    },

    {
        DestinationEntity: 'PersonName',
        DestinationColumns: ['EffectiveStartDate', 'EffectiveEndDate', 'PersonNumber', 'LegislationCode', 'NameType',  'FirstName', 'MiddleNames', 'LastName', 'Honors', 'KnownAs',  'PreNameAdjunct', 'MilitaryRank','PreviousLastName', 'Suffix',  'Title', 'CharSetContext', 'SourceSystemOwner', 'SourceSystemId',  'NameInformation1', 'NameInformation2', 'NameInformation3', 'NameInformation4', 'NameInformation5', 'NameInformation6', 'NameInformation7', 'NameInformation8', 'NameInformation9', 'NameInformation10', 'NameInformation11', 'NameInformation12', 'NameInformation13', 'NameInformation14', 'NameInformation15', 'NameInformation16', 'NameInformation17', 'NameInformation18', 'NameInformation19', 'NameInformation20', 'NameInformation21', 'NameInformation22', 'NameInformation23', 'NameInformation24', 'NameInformation25', 'NameInformation26', 'NameInformation27', 'NameInformation28', 'NameInformation29', 'NameInformation30'],
        SourceColumns: ['effective_start_date', 'Effective_End_Date', 'PERSON_NUMBER', 'Legislation_Code', 'Name_Type', 'First_Name', 'Middle_Names', 'Last_Name', 'Honors', 'Known_As', 'Pre_Name_Adjunct', 'Military_Rank', 'Previous_Last_Name', 'Suffix', 'Title', 'CharSet_Context', 'SourceSystemOwner', 'SourceSystemId','NameInformation1', 'NameInformation2', 'NameInformation3', 'NameInformation4', 'NameInformation5', 'NameInformation6', 'NameInformation7', 'NameInformation8', 'NameInformation9', ' NameInformation10', 'NameInformation11', ' NameInformation12', ' NameInformation13', ' NameInformation14', ' NameInformation15', ' NameInformation16', ' NameInformation17', ' NameInformation18', ' NameInformation19', ' NameInformation20', ' NameInformation21', ' NameInformation22', ' NameInformation23', ' NameInformation24', 'NameInformation25', 'NameInformation26', 'NameInformation27', 'NameInformation28', 'NameInformation29', 'NameInformation30'],
        SourceQuery: "SELECT pn.effective_start_date as effectivestartdate, pn.Effective_End_Date as EffectiveEndDate,pn. Person_Number as PersonNumber,pn. Legislation_Code as LegislationCode,pn.Name_Type as NameType, pn. First_Name as FirstName, pn. Middle_Names as MiddleNames," +
        "pn. Last_Name as LastName, pn. Honors, pn. Known_As as KnownAs, pn.Pre_Name_Adjunct as PreNameAdjunct, pn.Military_Rank as MilitaryRank, pn.Previous_Last_Name as PreviousLastName , pn.Suffix , pn.Title, pn.CharSet_Context as CharSetContext , 'EBS' AS SourceSystemOwner," +
        "pn. Name_Information1 as NameInformation1, pn.Name_Information2 as NameInformation2,pn.Name_Information3 as NameInformation3, pn.Name_Information4 as NameInformation4, pn.Name_Information5 as NameInformation5, pn.Name_Information6 as NameInformation6, pn. Name_Information7 as NameInformation7, pn.Name_Information8 as NameInformation8," +
        " pn.Name_Information9 as NameInformation9, pn. Name_Information10 as NameInformation10,pn.Name_Information11 as NameInformation11, pn.Name_Information12 as NameInformation12, pn.Name_Information13 as NameInformation13, pn. Name_Information14 as NameInformation14,pn.Name_Information15 as NameInformation15, pn.Name_Information16 as NameInformation16, pn.Name_Information17 as NameInformation17, pn.Name_Information18 as NameInformation18,pn.Name_Information19 as NameInformation19, pn.Name_Information20 as NameInformation20," +
         "pn.Name_Information21 as NameInformation21, pn.Name_Information22 as NameInformation22,pn. Name_Information23 as NameInformation23, pn.Name_Information24 as NameInformation24, pn. Name_Information25 as NameInformation25, pn.Name_Information26 as NameInformation26, pn.Name_Information27 as NameInformation27, pn.name_information28 as NameInformation28, pn.name_information29 as NameInformation29, pn. name_information30 as NameInformation30," +
         "'PERSON_NAME' || '_' || P.PERSON_ID \"SOURCESYSTEMID\"" + " FROM PERSON_NAME pn INNER JOIN PERSON p on p.PERSON_ID = pn.PERSON_ID"
        },


        {
            DestinationEntity: 'PersonPhone',
            DestinationColumns: ['PhoneType', 'DateFrom' , 'DateTo','PersonNumber', 'CountryCodeNumber', 'AreaCode', 'PhoneNumber',  'Extension', 'LegislationCode', 'PrimaryFlag',   'SourceSystemOwner', 'SourceSystemId' ],
            SourceColumns: ['Phone_Type', 'Date_From', 'Date_To', 'Person_Number', 'Country_Code_Number', 'AREA_CODE', 'Phone_Number', 'Extension', 'Legislation_Code', 'Primary_Flag', 'Source_System_Owner', 'Source_System_Id'],
            SourceQuery: "SELECT pp.Phone_Type as PhoneType , pp.Date_From as DateFrom, pp.Date_To as DateTo, pp.Person_Number as PersonNumber, pp.Country_Code_Number as CountryCodeNumber, pp.AREA_CODE as AreaCode, pp.Phone_Number as PhoneNumber, pp.Extension as Extension, pp.Legislation_Code as LegislationCode, pp.Primary_Flag as PrimaryFlag, 'EBS' AS SourceSystemOwner," +
            "'PERSON_PHONE'|| '_' || pp.PERSON_ID \"SourceSystemId\"" + " FROM PERSON_PHONE pp INNER JOIN PERSON p ON p.PERSON_ID = pp.PERSON_ID"
          
        },


    {
        DestinationEntity: "PersonLegislativeData",
        DestinationColumns: ['PersonNumber', 'EffectiveStartDate', 'EffectiveEndDate', 'LegislationCode', 'HighestEducationLevel', 'MaritalStatus', 'Sex', 'MaritalStatusDate', 'SourceSystemOwner', 'SourceSystemId'],
        SourceColumns: ['PERSON_NUMBER','EFFECTIVE_START_DATE','EFFECTIVE_END_DATE','Legislation_Code','Highest_Education_Level','Marital_Status','Sex','Marital_Status_Date','SOURCE_SYSTEM_OWNER','SOURCE_SYSTEM_ID'], 
        SourceQuery: "SELECT  PLI.PERSON_NUMBER AS PersonNumber,PLI.EFFECTIVE_START_DATE AS EffectiveStartDate,PLI.EFFECTIVE_END_DATE AS EffectiveEndDate,PLI.Legislation_Code AS " +
            "LegislationCode,PLI.Highest_Education_Level AS HighestEducationLevel,PLI.Marital_Status AS MaritalStatus, PLI.Sex, PLI.Marital_Status_Date AS MaritalStatusDate,'EBS' AS SourceSystemOwner," +
            "'PERSON_LEGISLATIVE_DATA' || '_' || PLI.PERSON_ID  \"SOURCESYSTEMID\"" +
            " FROM PERSON_LEGISLATIVE_INFO PLI INNER JOIN PERSON P ON PLI.PERSON_ID = P.PERSON_ID"
    }



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
                console.log(result);
               

                for (var j = 0; j < rule.DestinationColumns.length; j++) {
                    metadataline = metadataline + "|" + rule.DestinationColumns[j]  
                    
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
                            if (result[row].DATEFROM == null) {
                                result[row].DATEFROM = null
                            } else {
                                var c5 = moment(result[row].DATEFROM).format('YYYY/MM/DD');
                                result[row].DATEFROM = c5;
                            }
                        }

                        function convert6(){
                            if (result[row].DATETO == null ) {
                                result[row].DATETO = null
                            } else {
                                var c6 = moment(result[row].DATETO).format('YYYY/MM/DD');
                                result[row].DATETO = c6;
                            }
                        }
                       
                        

                        var rowData = Object.values(result[row])
                        convert1();
                        convert2();
                        convert3();
                        convert4();
                        convert5();
                        convert6();
                        
    
                        var newmergeline = mergeline;
                        if (rowData.length == rule.DestinationColumns.length) {
                            for (var j = 0; j < rowData.length; j++) {
                                if(result[row][rule.DestinationColumns[j].toUpperCase()] == null){
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
        finally{
            Database.close(['oracledb']);
          }
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

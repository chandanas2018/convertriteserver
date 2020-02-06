'use strict'

const Database = use('Database');
const fs = require('fs');
const {parseAsync} = require('json2csv');
var csvWriter = require('csv-write-stream')
const config = require('../../../config/Configuration');
//var csv = require('csv')


class EbsController {

      

    async datamigration({request,response,error}){
        try{
           // var qry1 = await Database.connection('ebsoracledb').raw("select * from per_all_people_f where employee_number = '1'");
        var qry1 = await Database.connection('oracledb').raw("SELECT to_char(effective_start_date,'DD-MM-RRRR') as EFFECTIVE_START_DATE, to_char(effective_end_date,'DD-MM-RRRR') as EFFECTIVE_END_DATE, person_id , employee_number AS PERSON_NUMBER, blood_type, "
        + "correspondence_language,TO_CHAR(start_date,'DD-MM-RRRR') AS START_DATE , TO_CHAR(date_of_birth,'DD-MM-RRRR') AS DATE_OF_BIRTH, TO_CHAR(date_of_death,'DD-MM-RRRR') AS DATE_OF_DEATH, " +
        " country_of_birth , region_of_birth , town_of_birth , '' AS source_system_owner, '' AS source_system_id ,  '' AS action_code, '' AS reason_code, attribute12 as person_duplicate_check FROM per_all_people_f WHERE sysdate BETWEEN effective_start_date AND effective_end_date" +
        " AND per_information_category = 'US' " + " AND person_id is not null and employee_number is not null  ORDER BY 1 DESC " )
        console.log(qry1);
        return qry1;

        var qry2 = await Database.connection('oracledb').raw("select employee_number as person_number, PERSON_ID, PER_INFORMATION_CATEGORY asLEGISLATION_CODE,"
         + " '' as issue_date, '' as expiration_date, '' as place_of_issue, '' as national_identifier_type, '' as primary_flag, " +
         " '' as source_system_owner, '' as source_system_id, NATIONAL_IDENTIFIER as NATIONAL_IDENTIFIER_NUMBER " + 
         "FROM per_all_people_f where sysdate BETWEEN effective_start_date AND effective_end_date"+ " AND per_information_category = 'US'" +
         "AND employee_number is not null AND PERSON_ID IS NOT NULL ORDER BY 1 DESC " )
        console.log(qry2);   
       
        var qry3 = await Database.connection('oracledb').raw("select pp.phone_type as phone_type, pp.date_from as date_from, pp.date_to as date_to,"
        + "pp.phone_number as phone_number, ppf.employee_number as person_number, ppf.person_id as person_id, '' as country_code_number, '' as area_code,"
        + " '' as extension, ppf.per_information_category as legislation_code from per_phones pp,per_all_people_f ppf  WHERE pp.party_id = ppf.party_id " 
        + " AND sysdate BETWEEN effective_start_date AND effective_end_date AND per_information_category = 'US'" +  "AND employee_number is not null "
        + " and person_id is not null ORDER BY 1 DESC ")
       console.log(qry3);

       var qry4 =  await Database.connection('oracledb').raw("SELECT EFFECTIVE_START_DATE, EFFECTIVE_END_DATE, EMPLOYEE_NUMBER as person_number, "
       + " person_id,  per_information_category as legislation_code, first_name,  middle_names, last_name, honors, known_as, pre_name_adjunct, previous_last_name "
       + " suffix, '' as source_system_owner, '' as source_system_id, title FROM per_all_people_f where sysdate between effective_start_date and effective_end_date "
       + " AND per_information_category = 'US'"+ " AND employee_number is not null and person_id is not null ORDER BY 1 DESC ")
       
        console.log(qry4);

        var qry5 = await Database.connection('oracledb').raw(" SELECT EFFECTIVE_START_DATE, EFFECTIVE_END_DATE, EMPLOYEE_NUMBER as perosn_number, per_information_category as legislation_code,"
        + " '' as HIGHEST_EDUCATION_LEVEL, '' as MARITAL_STATUS, '' as marital_status_date, '' as VET_100A, '' as VET_100, '' as source_system_owner, '' as source_system_id, '' as unique_identifier,"
        + " '' as country_code, sex FROM per_all_people_f where sysdate between effective_start_date and effective_end_date "
        + " AND per_information_category = 'US'" + "AND employee_number is not null ORDER BY 1 DESC" )
        
        console.log(qry5);

       response.status(200).send({success:true, data:qry1, msg:"data returned", err:null});
   
        }
        catch(error){
        console.log(error);
        response.status(400).send({success:false, data:null, msg:"error while data returned", err:error});
        }
       
    }

    async dataForCSV(entity){
        try{
            var qry = await config.getQueryByEntityAsync(entity);
            console.log(qry);
            var qry1 = await Database.connection('oracledb').raw(qry)
            console.log(qry1);
            return qry1;
        }
        catch(error){
            console.log(error);
        }
        finally{
        //   Database.close(['oracledb']);
          console.log('hello');
        }
    }


    async csvFile({request,response,error}){
        try{
          var entity = request.qs.entity;  
          console.log(entity);
          var data = await this.dataForCSV(entity);
          console.log(data);
          var fields = await config.getFieldsByEntityAsync(entity)
          const opts = {fields}
          var filename = 'person';
          var fileloc = 'public/ebs/' + entity + '.csv'
          var filepath = '/ebs/' + entity + '.csv';
        //   const csv = parse(data, opts)
        if(fs.existsSync(fileloc)){
            fs.writeFile(fileloc, '', function(){console.log('done')})
        }
        parseAsync(data, opts).then(csv =>{
            console.log(csv);

            fs.open(fileloc, 'w', function (err, file) {
                if(err){
                    console.error("open error:  " + err.message);
                }
                else{
                    fs.appendFile(file, csv , function (error) {
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

            })
     
        //  var csvFilename = "d:\some\path\myfile.csv";
        //   var writer = csvWriter({sendHeaders: false})
        //   writer.pipe(fs.createWriteStream(csvFilename))
        //   writer.write(csv)
        //   writer.end()
            
        }).catch(err => {
            console.error(err);
        });
        
        return response.send({loc:filepath});
        
        }
        catch(error){
            console.log(error);
            return response.send(JSON.stringify(error));
        }
    }


    async dataLoading({request,response,error}){
        try{
            var result = await Database.connection('oracledb').raw("DECLARE p_directory   VARCHAR2(200);"+
            " p_export      VARCHAR2(200);"+ "l_msg         VARCHAR2(200);"+
        "BEGIN import_person_file('RT_DATA_UPLOAD', 'person_name_demo.csv', l_msg);" +
         "END;")
            console.log(result);
            return response.status(200).send({success:true, data:result, msg:"Data loaded successfully", error:null});
        }
        catch(error){
            console.log(error);
            return response.status(400).send({success:false, data:null, msg:"Data loaded successfully", error:error});
        }
        
    }

}

module.exports = EbsController

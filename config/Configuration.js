const appConfig = require("../appSettings.json");

class Configuration {

    constructor(){
        console.log("Testing Config Functions...")
    }

    getConfigValueByKey(key){
        // return new Promise((resolve,reject)=>{
            // var elem = Object.values(appConfig);
            var retObj = appConfig[key];
            var firKey = Object.keys(appConfig);
            var allChildElementsObj = appConfig[firKey[0]];
           // console.log(allChildElementsObj);
            var allChildElementsKeys = Object.keys(allChildElementsObj);
            var elemObj = {};
            for(var i = 0; i< allChildElementsKeys.length; i++){
                if(allChildElementsKeys[i].toLowerCase() == key.toLowerCase()){
                        elemObj = allChildElementsObj[key];
                        break;
                }
            }



            // for(var i = 0; i < allKeys.length ; i++){
            //     if(allKeys[i] == key){
            //         retObj = appConfig[key];
            //     }
            // }
            //resolve(elemOj);
           // console.log(elemObj);
            return elemObj;
      //  });
           
    }

    async getQueryByEntityAsync(entity){
        var personEntityQuery = "SELECT to_char(effective_start_date,'DD-MM-RRRR') as EFFECTIVE_START_DATE, to_char(effective_end_date,'DD-MM-RRRR') as EFFECTIVE_END_DATE, person_id , employee_number AS PERSON_NUMBER, blood_type, "
        + "correspondence_language,TO_CHAR(start_date,'DD-MM-RRRR') AS START_DATE , TO_CHAR(date_of_birth,'DD-MM-RRRR') AS DATE_OF_BIRTH, TO_CHAR(date_of_death,'DD-MM-RRRR') AS DATE_OF_DEATH, " +
        " country_of_birth , region_of_birth , town_of_birth , '' AS source_system_owner, '' AS source_system_id ,  '' AS action_code, '' AS reason_code, attribute12 as person_duplicate_check FROM per_all_people_f WHERE sysdate BETWEEN effective_start_date AND effective_end_date" +
        " AND per_information_category = 'US' " + " AND person_id is not null and employee_number is not null  ORDER BY 1 DESC"

        switch(entity){
            case "Person":
                return new Promise((resolve,reject) => {
                        resolve(personEntityQuery)
                });
            break;
            default:
                console.log("No Criteria Matched")

        }
    }

    async getFieldsByEntityAsync(entity){
        const personFields = ['EFFECTIVE_START_DATE', 
          'EFFECTIVE_END_DATE', 
          'PERSON_ID',
           'PERSON_NUMBER', 
           'BLOOD_TYPE', 
           'CORRESPONDENCE_LANGUAGE' ,
          'START_DATE',
          'DATE_OF_BIRTH', 
          'DATE_OF_DEATH',
          'COUNTRY_OF_BIRTH' ,
          'REGION_OF_BIRTH',
          'TOWN_OF_BIRTH',
          'SOURCESYSTEMOWNER',
          'SOURCESYSTEMID',
          'ACTIONCODE',
          'REASONCODE',
          'PERSONDUPLICATECHECK',
          'RETIREMENTDATE'
          ];

          switch(entity){
              case "Person":
                  return new Promise((resolve,reject)=>{
                      resolve(personFields);
                  });
                  break;
              default:
                  console.log("No criteria matched for fetching fields!")  
          }
    }
}

module.exports = new Configuration();
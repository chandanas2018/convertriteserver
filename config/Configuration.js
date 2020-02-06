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

    async getEbsQueryByEntityAsync(entity){
        var LocationQuery = "SELECT DISTINCT hlat.location_id As LocationId,hlat.location_code As LocationCode,hlat.description As LocationName,hlat.description As Description,"
        + "hlit.active_inactive_flag As ActiveStatus,to_char(hla.creation_date,'YYYY/MM/DD') As EffectiveStartDate,hla.address_line_1 As AddressLine1,hla.address_line_2 As"
        + " AddressLine2,hla.country As Country,hla.postal_code As PostalCode,hla.region_1 As Region1,hla.region_2 As Region2,hla.town_or_city As TownOrCity "
        + "FROM apps.hr_locations_all_tl hlat,apps.hr_locations_all hla,apps.hr_location_info_types hlit,apps.HR_LOCATION_EXTRA_INFO hlei"
        + " WHERE hlat.location_id = hla.location_id  AND hla.location_id = hlei.location_id AND hlei.information_type = hlit.information_type"

        var JobsQuery = "SELECT b.job_id As JobCode, TO_CHAR(b.date_from,'YYYY/MM/DD') As EffectiveStartDate, t.name as Name "+
                        "FROM apps.per_jobs b,apps.per_jobs_tl t WHERE t.job_id = b.job_id AND t.language = 'US'";
        var OrganizationQuery = "SELECT TO_CHAR(o.DATE_FROM,'YYYY/MM/DD') As EffectiveStartDate,otl.organization_id,otl.name as Name " +
                                "FROM apps.hr_all_organization_units o,apps.hr_all_organization_units_tl otl WHERE 1=1 "+
                                "AND o.organization_id = otl.organization_id AND otl.language = 'US' AND TYPE ='DEP'";
        switch(entity){
            case "Location":
                return new Promise((resolve,reject)=>{
                    resolve(LocationQuery);
                });
                break;
            case "Jobs":
                return new Promise((resolve,reject)=>{
                    resolve(JobsQuery);
                });
                break;
            case "Organization":
                return new Promise((resolve,reject)=>{
                    resolve(OrganizationQuery);
                });
                break;
            default:
                console.log("No case matched");
        }
    }
}

module.exports = new Configuration();
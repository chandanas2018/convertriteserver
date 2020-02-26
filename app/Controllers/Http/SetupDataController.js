const fetch = require("node-fetch");
const btoa = require("btoa");
const setUpHelper = require('../../Helpers/SetupdataHelpers');

class SetupDataController{
    async GetDataForSetupByEntity({request,response,error}){
        try{
            //Initialize data for Request
            //ToDo: Move to Config Json File to standardize
            const HcmUrl = "https://ucf5-zjoz-fa-ext.oracledemos.com";
            const Username = "Hcm_impl";
            const Password = "XNj35965";

            var entity = request.qs.entity;
            var otherParams = {
                method: 'GET',
               // credentials: 'same-origin',
                //redirect: 'follow',
                headers:{
                    "Content-Type": "application/vnd.oracle.adf.resourcecollection+json",
                    "Authorization": 'Basic ' + btoa(Username+":"+Password)
                }
            };

            if(entity == "Departments"){
                entity = "departmentsLov";
            }

            if(entity == "SalaryBasis"){
                entity = "salaryBasisLov";
            }

            var requestUrl = HcmUrl + "/hcmRestApi/resources/11.13.18.05/" + entity + "?limit=1000";
            // get_data = async(request,otherParams) => {

            // }

            var restResponse = await fetch(requestUrl,otherParams);
            var respJson = await restResponse.json();

            console.log(respJson);

            //reset entity for data access to Database
            entity = request.qs.entity;
            //Insert Data from HCM into Staging Database
         var insertStatus =   await new setUpHelper().InsertSetupData(entity,respJson.items);
            //return response.status(200).send(respJson);

         response.status(200).send(insertStatus.length);
        }
        catch(ex){
            response.status(500).send({error:"Error while fetching data!"})
        }
    }
}

module.exports = SetupDataController;
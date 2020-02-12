const fetch = require("node-fetch");
const btoa = require("btoa");

class SetupDataController{
    async GetDataForSetupByEntity({request,response,error}){
        try{
            //Initialize data for Request
            //ToDo: Move to Config Json File to standardize
            const HcmUrl = "https://ecbp.fa.us2.oraclecloud.com";
            const Username = "Rite_software";
            const Password = "RTI8686193926@";

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

            var requestUrl = HcmUrl + "/hcmRestApi/resources/11.13.18.05/" + entity;
            // get_data = async(request,otherParams) => {

            // }

            var restResponse = await fetch(requestUrl,otherParams);
            var respJson = await restResponse.json();

            console.log(respJson);

            return response.status(200).send(respJson);


        }
        catch(ex){
            response.status(500).send({error:"Error while fetching data!"})
        }
    }
}

module.exports = SetupDataController;
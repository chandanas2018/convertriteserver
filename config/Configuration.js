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
            console.log(allChildElementsObj);
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
            console.log(elemObj);
            return elemObj;
      //  });
           
    }
}

module.exports = new Configuration();

const db = require('../../appSettings.json');
// console.log(db);

// Object.keys(db.connectionStrings.stagingDbConnection).forEach(function (name) {
//   var values = db.connectionStrings.stagingDbConnection[name]
//   console.log(name + ':' + values);
//   //return values;

// })



class Configuration {
  
  constructor() {
    console.log('hello');
    //this.connection = db.connectionStrings.stagingDbConnection;
   
    
  }

  

  getConfigurationValueByKey(key, element) {
   
  //  var keys = Object.keys(db).forEach(k=>{

  //  });

   var obj = Object.values(db)[0];
   console.log(obj);
   var newObj  = Object.keys(obj);
   console.log(newObj);

      Object.keys(newObj[0]).forEach(k=>{
        console.log(k);
   
        if(key===k){
          var x = obj[k];
          console.log(x);
        }
      })
  //  .values(element)[0].values(key);


   
    

    
   
  }
 
  
}








module.exports = new Configuration()



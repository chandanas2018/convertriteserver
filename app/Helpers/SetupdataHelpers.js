const Database = use('Database');
const moment = use('moment');
const Logger = use('Logger');
const bluebird = require('bluebird');

class SetupDataHelper{
    constructor(){
        
    }
    async InsertSetupData(entity,data){
      var transactions =  await bluebird.map(data,async(element) => {
            var obj = await this.GetObjectByEntity(entity,element);
            if(obj && obj != null){
            let trans = await Database.connection('oracledb').insert(obj)
                              .into(entity.toUpperCase());
            console.log(trans);
            return trans;
            }
        },
        {concurrency:10},
        );
        
        return await Promise.all(transactions);
    }

    async GetObjectByEntity(entity,dataEntity){
        if(entity.toUpperCase() == "LOCATIONS"){
            const locationData = await Database.connection('oracledb').select('*').from('LOCATIONS');
            var locationExists =  locationData.some(location => location.LOCATIONID == dataEntity.LocationId);

            if(locationExists){
                return new Promise((resolve,reject)=>{
                    resolve(null);
                });
            }
            else{
                var obj = {LOCATIONID: dataEntity.LocationId,LOCATIONCODE: dataEntity.LocationCode,
                    LOCATIONNAME:dataEntity.LocationName,COUNTRY:dataEntity.Country,PLACE: dataEntity.TownOrCity,DESCRIPTION:dataEntity.Description};
    
                    return new Promise((resolve,reject)=>{
                        resolve(obj);
                    });
            }
           
        }
    }
}

module.exports = SetupDataHelper;
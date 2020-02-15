const Database = use('Database');
const moment = use('moment');
const Logger = use('Logger');

class SetupDataHelper{
    constructor(){
        
    }
    async InsertSetupData(entity,data){
        data.forEach(async(element) => {
            var obj = await this.GetObjectByEntity(entity,element);
            let trans = await Database.connection('oracledb').insert(obj)
                              .into(entity.toUpperCase());
            console.log(trans);
        });
        
        
      
      //  return response.status(200).send({success:true, data:qry, msg:'Successfully created the project', err:null});
    }

    async GetObjectByEntity(entity,dataEntity){
        if(entity.toUpperCase() == "LOCATIONS"){
            var obj = {LOCATIONID: dataEntity.LocationId,LOCATIONCODE: dataEntity.LocationCode,
                LOCATIONNAME:dataEntity.LocationName,COUNTRY:dataEntity.Country,PLACE: dataEntity.TownOrCity,DESCRIPTION:dataEntity.Description};

                return new Promise((resolve,reject)=>{
                    resolve(obj);
                });
        }
    }
}

module.exports = SetupDataHelper;
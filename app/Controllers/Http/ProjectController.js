'use strict'

const Database = use('Database')
 
//const Projects = use('App/Models/Projects');

class ProjectController {

    //to create a new project 
    async createProject({request, response, error}){
        try{
          var date = new Date().toUTCString().slice(4, 17);
          var data = request.body;
          let qry = await Database.insert({
              //PROJECT_ID:data.projectid,
              PROJECT_NAME:data.projectname,
              DATE_OF_CREATION: date,
              DATE_OF_UPDATION:date,
              CONVERSION_STATUS:'',
              PROJECT_CREATED_BY:data.email,
              PROJECT_DESCRIPTION:data.description
          }).into('LIST_OF_PROJECTS');
          console.log(qry);
          let transactions = await Database.insert({ PROJECT_ID:data.projectid,
            TRANSACTION_DATE:date,
            ENTITIY_ACCESSED:'',
            TRANSACTION_STATUS:'project created',
            TRANSACTION_PERFORMED_BY:data.email
        }).into('PROJECT_TRANSACTIONS');
        console.log(transactions);
          return response.status(200).send({success:true, data:qry, msg:'Successfully created the project', err:null});
        }
        catch(error){
            return response.status(400).send({success:false, data:null, msg:'Successfully created the project', err:error});
        }
    }




   //to get list of created projects for screen1
    async projectsList({request, response, error  }){
        try{
            var data = request.body;
            let qry = await Database.select('PROJECT_ID','PROJECT_NAME','PROJECT_DESCRIPTION','CONVERSION_STATUS',)
            .from('LIST_OF_PROJECTS').where('PROJECT_CREATED_BY', data.email );
            console.log(qry);
            return response.status(200).send({success:true, data:qry, msg :'List of created projects', err:null});
        }
        catch(error){
         return response.status(400).send({success:false, data:null, msg:'Error while getting the projects list', err:error});
        }

        
    }

    //to delete the project for screen 1
    async deleteProject({request, response, error}){
        try{
            var data = request.body;
            //to delete the project
            let qry = await Database.table('LIST_OF_PROJECTS').where('PROJECT_ID', data.projectid)
            .delete();
            console.log(qry);
            //to maintain the log of transactions
            var date = new Date();
            var data1 = {
                status:"deleted",
                email:"Linda@xyz.com"
            }
            let transactions = await Database.insert({ PROJECT_ID:data.projectid,
               TRANSACTION_DATE:date,
               ENTITIY_ACCESSED:data.entityname,
               TRANSACTION_STATUS:data1.status,
               TRANSACTION_PERFORMED_BY:data1.email
           }).into('PROJECT_TRANSACTIONS');
           console.log(transactions);
            return response.status(200).send({success:true, data:qry, msg:'Successfully delete the project', err:null});
        }
        catch(error){
            return response.status(400).send({success:false, data:null,msg:'Error while deleting projects', err:error});
        }
    }
     
     //List of Entity names with status 
     async uploadExtracts({request, response, error }){
        try{
            let uploads = await Database.select('ENTITY_NAME','UPLOAD_STATUS', 'TIMESTAMP').from('PROJECT_LEGACY_UPLOAD_STATUS')
            .where('PROJECT_ID', 2);
            console.log(uploads);
            return response.status(200).send({success:true, data:uploads, msg:'Successfully get the upload files list', err:null});
            //return response.json(entities)
        }
        catch(err){
            return response.status(400).send({success:false, data:null, msg:'Error while get the list', error:err});
        }

        
     }
}

module.exports = ProjectController

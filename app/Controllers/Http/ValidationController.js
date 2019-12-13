'use strict'

const ErrorManager = use('App/Models/ErrorManager');
const Database = use('Database');


let Errormanager = new ErrorManager();

class ValidationController {


    async getstatus({ request, response, error }) {

        response.send({ status: Errormanager.getStatus() })
    }

    async  validations({ request, response, error }) {

        try {
            Errormanager.reset();
            //await this.rule1();
            await this.rule2();
            await this.rule3();
            //await this.rule4();

            return response.status(200).send(({ success: true, data: Errormanager.getStatus(), msg: 'validation status', error: null }));
        }

        catch (err) {
            console.log(err);
            return response.status(400).send(({ success: false, data: null, msg: 'errors', error: err }));
        }

    }



    async rule1() {
        try {
            var data = [];
            var r1 = await Database.raw('select * from proj_column_mapping where destination_column_id in (select  '

                + 'destination_column_id from proj_column_mapping group by destination_column_id having count(*) > 1)');

            console.log(r1);
            if(r1.length == 0){
           Errormanager.addInfo({data:null, msg:' Multiple source fileds are not mapped to single destination field rule is failed ', err:null},{ruleinfo: 'DataRule:N to one data mapping check'}, {ruleid:1} )
            }else{
                for(var i=0; i<r1.length; i++){
                    var object1 = {
                        sourcecolumn: r1[i].SOURCE_COLUMN_NAME,
                        destinationcolumn : r1[i].DESTINATION_COLUMN_NAME,
                        sourceentityid : r1[i].SOURCE_ENTITY_ID
                    }
                    data.push(object1)
                }
              Errormanager.addError({ data: data, msg: 'Multiple source fileds cannot be mapped to a single destination field', err: null },{ruleinfo: 'DataRule:N to one field mapping check'}, {ruleid:1})
            }
          
            
        }
        catch (error) {
            // Errormanager.addError({ ruleinfo: 'rule1', data: null, msg: 'Error while excuting rule1', err: error })
            console.log(error);
        }

    }


    async  rule3() {
        try {
            var repetedfields = await Database.raw("SELECT SOURCE_DATA,  SOURCE_COLUMN_NAME, destination_column_name, SOURCE_ENTITY_ID, LISTAGG(DESTINATION_DATA, ',') WITHIN GROUP (ORDER BY DESTINATION_DATA) DESTINATION_DATA , COUNT(*) occurrences FROM PROJ_DATA_MAPPINGS GROUP BY SOURCE_DATA,  source_column_name, destination_column_name, SOURCE_ENTITY_ID HAVING COUNT(*) > 1");         
            console.log(repetedfields);
            if(repetedfields.length == 0){
                Errormanager.addInfo({data:null, msg:'No Repeated source data mappings', err:null},{ruleinfo:'DataRule: One to N data mapping check'}, {ruleid:2} )
            }
            else{
                var data = [];
                for(var i=0; i<repetedfields.length; i++){
                    
                     if (repetedfields[i].OCCURRENCES > 1) {
                         var object2 = {
                             sourceentityid:repetedfields[i].SOURCE_ENTITY_ID,
                             sourcecolumn: repetedfields[i].SOURCE_COLUMN_NAME,
                             destinationcolumn : repetedfields[i].DESTINATION_COLUMN_NAME,
                             sourcedata : repetedfields[i].SOURCE_DATA,
                             destinationdata:repetedfields[i].DESTINATION_DATA
                         }
                         data.push(object2);
                     }
                   
                 
             }
                 Errormanager.addError({ data: data, msg: 'Repeated source data mappings with destination data found', err: null }, {ruleinfo:'DataRule:N to one data mapping check'}, {ruleid:2});
            }
             
            }
        
        catch (err) {
            console.log(err);
        }

    }

    async  rule4() {
        try {
            var error4 = await Database.select('SOURCE_DATA', 'DESTINATION_DATA', 'SOURCE_ENTITY_ID')
                .from('PROJ_DATA_MAPPINGS').where(destination_data, 'undefined');
            console.log(error4);
        }
        catch (err) {
            console.log(err);
        }

    }

    async rule2() {
        try {

            var array =[];
            var finalArray =[];
            var entity_column_mappings = {};
            var data = await Database.raw('select entity_id, entity_name, source_column_name, destination_column_name, source_data, destination_data  from ' +
                '(select source_entity_id, source_column_id,source_column_name, proj_data_mappings.destination_column_name, proj_data_mappings.destination_data, source_data from PROJ_DATA_MAPPINGS order by source_entity_id) a, ' +
                '(select entity_id, ENTITY_NAME from PROJECT_SOURCE_ENTITY_LIST where entity_id in( select DISTINCT  source_entity_id  from proj_data_mappings)) b ' +
                'where a.source_entity_id = b.entity_id');
            console.log(data);
            if(data.length == 0){
            Errormanager.addInfo({data:null, msg:'All source values are mapped rule is failed ', err:null},{ruleinfo:'Each source field should be mapped with destination field'}, {ruleid:3} )
            }else{
                for (var i = 0; i < data.length; i++) {
                    if (entity_column_mappings[data[i].ENTITY_NAME] === undefined) {
                        entity_column_mappings[data[i].ENTITY_NAME] = {};
                    }
                    if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME] === undefined) {
                        entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME] = { entityid : data[i].ENTITY_ID, mapped_values: [], source_values: [] };
                    }
                    entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].mapped_values.push(data[i].SOURCE_DATA)
                    if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values.length == 0) {
                        var qry = "select distinct " + data[i].SOURCE_COLUMN_NAME  +   ' AS original_data '  + " from " + data[i].ENTITY_NAME;
    
                        entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values = await Database.raw(qry)
                       
                    }
                   
                }

                for (var entity in entity_column_mappings) {
                    if (entity  !== undefined) {
                        var mappings  = entity_column_mappings[entity]
                        for (var mapping in mappings) {
                            var mapping_data = mappings[mapping]


                            // Condition 1: Check source data count > mapped count
                            if (mapping_data.source_values.length  > mapping_data.mapped_values.length ) {
                                var finalObject = {
                                    sourceentityid: mapping_data.entityid,        
                                    entityname:  entity,
                                    sourcecolumnnames: mapping,
                                    sourcevaluecount: mapping_data.source_values.length,
                                    mappedvaluecount : mapping_data.mapped_values.length
            
                                }
                                // console.log(finalObject);
                                Errormanager.addWarnings({ data:finalObject, msg: "All source data values are not mapped", err:null }, {ruleinfo:'Each source field should be mapped with destination field'}, {ruleid:3})
//                                finalArray.push(finalObject);
        
                            }

                            //Condition 2: Check if all values of source are mapped
                            else if (mapping_data.source_values.length  ==  mapping_data.mapped_values.length ) {
                            
                                var array = mapping_data.mapped_values;
                                var duplicateFound = false;
            
                                for (var k = 0; k < array.length; k++) {
                                    for (var j = k + 1; j < array.length; j++) {
                                        if (array[k] == array[j]) {
                                            duplicateFound = true;
                                           
                                        }
                                    }
                                }

                                if (duplicateFound == true) {
                                    var finalObject = {
                                        sourceentityid: mapping_data.entityid,        
                                        entityname:  entity,
                                        sourcecolumnnames: mapping,
                                        sourcevaluecount: mapping_data.source_values.length,
                                        mappedvaluecount : mapping_data.mapped_values.length
                                    }
                                    Errormanager.addWarnings({ data:finalObject, msg: "Duplicate source value mapping identified", err:null }, {ruleinfo:'Each source field should be mapped with destination field only once'}, {ruleid:3})
                                        
                                }
                                else {
                                    Errormanager.addInfo({data:null, msg:'Duplicate source value mapping identified rule is failed', err:null}, {ruleinfo:'Each source field should be mapped with destination field only once'}, {ruleid:3})
                                }
                                        
                            }   
                        }
                    }
                }



                console.log(entity_column_mappings);

                // array.push(finalArray)
               
                
            }
            
        }
    catch(err) {
        console.log(err);
        //return response.status(400).send({ success: false, data: null, msg: 'failure', err: error });
    }
   }

    

}




module.exports = ValidationController

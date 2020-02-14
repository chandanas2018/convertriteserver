
const Database = use('Database');


class hdlDataMappings{

    constructor(){
        console.log("Criteria matched!")

    }

    async getMappingsByEntityId(){

        var query = await Database.connection('oracledb').raw('select psl.entity_name, pdm.source_column_name, pdm.source_data, pdm.destination_data from project_source_entity_list psl,'
        +'proj_data_mappings pdm where psl.entity_id = pdm.source_entity_id')
        console.log(query);
        return query;
         
    }
    

   


}

module.exports= new hdlDataMappings();
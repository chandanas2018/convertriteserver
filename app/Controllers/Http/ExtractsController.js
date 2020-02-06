'use strict'

const Database = use('Database');
const config = require('../../../config/Configuration');
// const Helpers = use('Helpers');
const fs = require('fs');

class ExtractsController{
    async ExtractByEntity({request,response,error}){
        var mergelineObjs = [];
        var entity = request.qs.entity;
        if(entity){
            //Get Data From Database
            var qry = await config.getEbsQueryByEntityAsync(entity);
            var result = await Database.connection('oracledb').raw(qry);

            //Form the basic structures to be writen to HDL
            var metadataLine = "METADATA|" + entity;
            var mergeLine = "MERGE|" + entity;

            if(result){
                //Writing Metadata Line..
                var keys = Object.keys(result[0]).sort();

                for(var i = 0; i < keys.length; i++){
                    metadataLine = metadataLine + "|" + keys[i];
                }
                
                //Forming and writing Merge Lines..
                result.forEach(row => {
                    for(var i = 0; i < keys.length; i++){
                        mergeLine = mergeLine + "|" + row[keys[i]];
                    }

                    mergelineObjs.push(mergeLine);
                });

                var HDLEntry = {
                    header: metadataLine,
                    data : mergelineObjs
                }

                //return response.status(200).send({data:HDLEntry});
                //Writing to File
                //ToDo: Refactor this to another Helper function, so that the same can be called in HDLController,
                //      Extracts Controller and EBS Controller for generating .dat files

                var HDLEntries = [];
                HDLEntries.push(HDLEntry);

                var projectname = entity
                var fileloc = 'public/hdls/' + projectname + '.dat';
                var filepath = '/hdls/' + projectname + '.dat';
        
        
                try {
        
        
                    fs.open(fileloc, 'w', function (err, file) {
                        if (err) {
                            console.error("open error:  " + err.message);
                        }
                        else {
                            var failed = false
                            for (var i = 0; i < HDLEntries.length; i++) {
                                fs.appendFile(file, HDLEntries[i].header + "\n", function (error) {
                                    console.log(error);
                                    failed = false
                                })
                                for (var j = 0; j < HDLEntries[i].data.length; j++) {
                                    fs.appendFile(file, HDLEntries[i].data[j] + "\n", function (error) {
                                        console.log(error);
                                    })
                                }
                                fs.appendFile(file, "\n", function (error) {
                                    console.log(error);
                                })
                            }
                            fs.close(file, function (error) {
                                if (error) {
                                    console.error("close error:  " + error.message);
        
                                } else {
                                    console.log("File was closed!");
        
        
                                }
                            });
        
                            if (failed) {
                                response.send({ error: "HDL generation not successful " })
                            }
                        }
        
                    })
                    return response.send( {loc: filepath })
                }
                catch (error) {
                    response.send(JSON.stringify(error))
                }

            }
           
        }
    }

    async WriteToFile(){
        if (convertStatus.data == null) {
            response.send(convertStatus.error)
            return
        }
       
    }
}

module.exports = ExtractsController
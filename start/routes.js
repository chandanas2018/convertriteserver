'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('')
Route.on ('/api/v1/uploadfile').render('file')
Route.post('/api/v1/uploadfile', 'FileController.uploadData')

//Routes for project creations and upload extracts
Route.group(() => 
{  
    Route.post('/projects/list', 'ProjectController.projectsList')
    Route.delete('/delete/projects', 'ProjectController.deleteProject') 
    //Route.post('/file/transactions', 'ProjectController.saveTransactions')
    Route.get('/upload/extracts','ProjectController.uploadExtracts')
    Route.get('/projects/testConfig', 'ProjectController.testConfig')
    Route.post('/projects/create', 'ProjectController.createProject')
}).prefix('api/v1')

//Routes for entity mappings
Route.group(() => 
{ 
    Route.get('/source/entities', 'EntitymappingController.sourceEntities') 
    Route.post('/source/entity/columns', 'EntitymappingController.sourceEntityFields')
    Route.get('/dest/entities', 'EntitymappingController.destEntities')
    Route.post('/dest/entity/columns', 'EntitymappingController.destEntityFields')
    Route.post('/mappings','EntitymappingController.mappingFields' )
    Route.post('/listof/mappedfields', 'EntitymappingController.listofMapfeilds')
    Route.delete('/removeall/mappedfields', 'EntitymappingController.removeMappedFields')
    Route.delete('/delete/individual/mapping', 'EntitymappingController.deleteIndividualMappedField')

}).prefix('api/v1')

//Routes for data mappings
Route.group(() => 
{ 
    Route.post('/identification/columns', 'DatamappingController.identificationColumnList')
    Route.post('/update/identification/columns', 'DatamappingController.updateIdentificationColumnList')
    Route.post('/master/datalist', 'DatamappingController.masterdataList')
    Route.post('/save/datamappings','DatamappingController.saveDataMappings')
    Route.post('/listof/value/mappings', 'DatamappingController.listofDataMappings')
    Route.delete('/delete/individual/datamapping', 'DatamappingController.deleteIndividualDataMapping')
    Route.delete('/removeall/datamappings', 'DatamappingController.removeDataMappings')
    Route.post('/exceldata', 'DatamappingController.excelDownloadTemplate')
    Route.post('/exceldataupload', 'DatamappingController.excelUploadTemplate')
    Route.post('/exceldatamapping', 'DatamappingController.excelDownloadDataMappingTemplate')
    Route.post('/uploaddatamappings', 'DatamappingController.uploadDataMappingFromExcel')
    
 }).prefix('api/v1')

 Route.get('/validation','ValidationController.validations')
 Route.get('/validation/status', 'ValidationController.getstatus')
 Route.get('/api/v1/test', 'TestController.test')
//  Route.post('/api/v1/onetoone/mappings','TestController.onetoOneMappings')
 Route.post('/api/v1/destinationdata', 'HdlController.convert')
 Route.post('/api/v1/processSupervisor','HdlController.processSupervisor')
 Route.get('/api/v1/download/hdl', 'HdlController.download')
 Route.get('/api/v1/supervisior/hdl','HdlController.generateSupervisiorHdl')
 Route.get('/api/v1/generateSalaryHdl', 'HdlController.generateSalaryHdl')
 Route.post('/api/v1/source/columns', 'TestController.previewFile')
 Route.post('/api/v1/oracle/errors', 'FileController.errorlistFile')


 //for testing ebs controller methods 
 Route.get('/ebsdata','EbsController.datamigration')
 Route.get('/csv', 'Ebscontroller.csvFile')
 Route.get('/api/EbsExtracts','ExtractsController.ExtractByEntity')
 Route.get('/data/loading','Ebscontroller.dataLoading')
 Route.get('/hdl/dataMappings','HdlController.hdlMappings')
 // Route.group(() => {
 
 //SetUpDataController
 Route.get('/api/vi/GetSetupData','SetupDataController.GetDataForSetupByEntity')

 Route.post('/getValidations','ValidationController.storeMapUnMapIntoDB')


Route.post('/processSupervisor','HdlController.processSupervisor')
Route.post('/CreateSalaryBasis', 'HdlController.CreateSalaryBasis')

Route.get('/downloadValidation', 'ValidationController.downloadValidations');

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
Route.post('/api/v1/uploadfile', 'FileController.store')

//Routes for project creations and upload extracts
Route.group(() => 
{  
    Route.post('/projects/list', 'ProjectController.projectsList')
    Route.delete('/delete/projects', 'ProjectController.deleteProject') 
    //Route.post('/file/transactions', 'ProjectController.saveTransactions')
    Route.get('/upload/extracts','ProjectController.uploadExtracts')
    Route.get('/projects/testConfig', 'ProjectController.testConfig')
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
    
 }).prefix('api/v1')

 Route.get('/validation','ValidationController.validations')
 Route.get('/validation/status', 'ValidationController.getstatus')
 Route.get('/api/v1/test', 'TestController.test')
//  Route.post('/api/v1/onetoone/mappings','TestController.onetoOneMappings')
 Route.post('/api/v1/destinationdata', 'HdlController.convert')
 Route.get('/api/v1/download/hdl', 'HdlController.download')
 Route.post('/api/v1/source/columns', 'TestController.previewFile')
 Route.post('/api/v1/oracle/errors', 'FileController.errorlistFile')



 Route.get('/bloodgroup','DataMigrationController.Bloodgroup')

// Route.group(() => {
//  Route.post('login', 'LoginController') 
// }).prefix('api')

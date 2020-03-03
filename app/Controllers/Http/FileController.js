'use strict'




const Helpers = use('Helpers')
const csv = require('csv-parser')
const fs = require('fs')
const moment = require('moment');

var results = []

// var errorArray = [
//     {errornumber : 1, errorcode : "ORA12170", msg : "TNS No Listner Connect Timeout Occured"},
//     {errornumber : 2, errorcode : "ORA00904", msg : "Invalid Identifier"},
//     {errornumber : 3, errorcode : "ORA014101", msg : "Inserted value to large for column"},
//     {errornumber : 4, errorcode : "ORA01418", msg: "Specified Index does not exists"}

// ]

const Errorobj = use('App/Models/Error');



const Database = use('Database');



const validationOptions = {
    // types:['image'],
    extnames: ['csv', 'png']
}

//const str = 'D:/app1/tmp/uploads/certifications.csv'

class FileController {
    //to upload the file
    async store({ request, response, error }) {
        const file = request.file('myFile', validationOptions)
        response.ok(file)
        var d = new Date()
        var destpath = Helpers.tmpPath('uploads' + '/' + d.getTime() + '/')
        console.log(destpath)
        //to move the file into tempath
        await file.move(destpath)
        console.log('file: ', file)

        if (!file.moved()) {
            response.status(400).send({ error: file.error() })
        }

        else {
            const filename = destpath + file.fileName
            results = []
            // read the data of file & parse the data into json using csv parser
            await fs.createReadStream(filename)
                .pipe(csv())
                .on('data', (data) =>
                    results.push(data)
                ).on('end', () => {
                    console.log(results)
                    console.log(results.length);
                }).on('error', function (err) {
                    res.end({ data: null, message: 'Error while reading file ', error: err });
                });
            //console.log(file.fileName);
            var resArr = file.fileName.split('.')
            var doc = resArr[0]
            console.log(doc)
            try {

                // var str = "select * from " + resArr[0].toUpperCase();
                // console.log(str);
                // var v = await Database.raw(str)

                await Database.connection('oracledb').table(doc.toUpperCase())
                    .delete()

                var pageLength = 50;
                var qstart = 0;
                var page = [];
                var q = 0;



                while (qstart < results.length) {
                    page = [];

                    for (q = qstart; q < (qstart + pageLength) && q < results.length; q++) {
                        page.push(results[q]);
                        // if (typeof results[q] === 'string') {
                        //     results[q] = results[q].toUpperCase();
                        // }
                        // var obj = results.map( function( item ){
                        //     for(var key in item){
                        //         var upper = key.toUpperCase();
                        //         // check if it already wasn't uppercase
                        //         if( upper !== key ){ 
                        //             item[ upper ] = item[key];
                        //             delete item[key];
                        //         }
                        //     }
                        //     return item;

                        // });

                    }

                    // const errordata =  await Errorobj.errorsList();                    
                    var errorinfo = new Errorobj();



                    await Database.connection('oracledb').table(doc.toUpperCase())
                        .insert(page)

                    qstart = qstart + pageLength

                }

                //for returning number of rows inserted 
                var rowCount = await Database.from(doc).count('* as total');
                console.log(rowCount);


                if (results != null || results.length == 0) {
                    try {
                        // to update status of file      
                        let qry = await Database.connection('oracledb').table('PROJECT_LEGACY_UPLOAD_STATUS').where({ 'ENTITY_NAME': doc, 'PROJECT_ID': 2 })
                            .update({ 'UPLOAD_STATUS': 'UPLOADED', 'TIMESTAMP': new Date() });
                        console.log(qry)
                        //insert service for log data           
                        var date = new Date();
                        var data1 = {
                            projectid: 2,
                            email: 'Linda@xyz.com',
                            status: 'uploaded'
                        }
                        let transactions = await Database.connection('oracledb').insert({
                            PROJECT_ID: data1.projectid,
                            TRANSACTION_DATE: date,
                            ENTITIY_ACCESSED: doc,
                            TRANSACTION_STATUS: data1.status,
                            TRANSACTION_PERFORMED_BY: data1.email
                        }).into('PROJECT_TRANSACTIONS');
                        console.log(transactions);
                    }
                    catch (err) {
                        console.log(err)
                        return response.send({ success: false, data: null, msg: 'DeprecationWarning', error: err });
                    }
                }
                return response.status(200).send({ success: true, data: { data: file.fileName + ' ' + new Date().toLocaleString(), status: 'uploaded', count: rowCount }, message: 'Data inserted successfully', error: null })
            }

            catch (error) {
                return response.status(200).send({ success: false, data: null, message: 'Error while inserting data', error: error });

            }
            // finally{
            //    // Database.close(['oracledb']);
            // }

        }

    }

    //upload extracts new service
    async uploadData({ request, response, error }) {
        var data = request.body;
        console.log(data);
        var rows = JSON.parse(data.data);
        console.log(rows);

        try {
           
            //deleting table data 
        
            if(data.filename === "PERSON_SALARY"){
                data.filename = "SOURCE_SALARY";
            }
            


            await Database.connection('oracledb').table(data.filename)
                .delete()


            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i]);

                
                var dateobj = {
                    datefrom : rows[i].DATE_FROM,
                    dateto: rows[i].DATE_TO ,
                    dateofbirth : rows[i].DATE_OF_BIRTH,
                    effectivestartdate : rows[i].EFFECTIVE_START_DATE,
                    startdate:rows[i].START_DATE,
                    datestart :rows[i].DATE_START
                }
                console.log(dateobj);  

                if (data.filename === "PERSON") {
                    rows[i].DATE_OF_BIRTH = moment(Date.parse(dateobj.dateofbirth.split('-').reverse().join(' '))).format('DD-MMM-YY');
                    rows[i].EFFECTIVE_START_DATE = moment(Date.parse(dateobj.effectivestartdate.split('-').reverse().join(' '))).format('DD-MMM-YY');
                    rows[i].START_DATE = moment(Date.parse(dateobj.startdate.split('-').reverse().join(' '))).format('DD-MMM-YY');

                }

                else if (data.filename === "PERSON_NAME" ||
                    data.filename === "PERSON_LEGISLATIVE_INFO" ||
                    data.filename === "ASSIGNMENT" ||
                    data.filename === 'WORK_TERMS') {
                    rows[i].EFFECTIVE_START_DATE = moment(Date.parse(dateobj.effectivestartdate.split('-').reverse().join(' '))).format('DD-MMM-YY');
                }

                else if (data.filename === "WORK_RELATIONSHIP") {
                    rows[i].DATE_START = moment(Date.parse(dateobj.datestart.split('-').reverse().join(' '))).format('DD-MMM-YY');
                }

                else if (dateobj.datefrom){
                    rows[i].DATE_FROM = moment(Date.parse(dateobj.datefrom.split('-').reverse().join(' '))).format('DD-MMM-YY');
                    if (dateobj.dateto){
                        rows[i].DATE_TO = moment(Date.parse(dateobj.dateto.split('-').reverse().join(' '))).format('DD-MMM-YY');
                    }
                 }
                
                var insertedData = await Database.connection('oracledb').table(data.filename.toUpperCase())
                    .insert(rows[i]);
                console.log(insertedData);

            }

            //for returning number of rows inserted 
            var rowCount = await Database.from(data.filename.toUpperCase()).count('* as total');
            console.log(rowCount);

            if (rows != null || rows.length == 0) {
                try {
                    // to update status of file 
                    if(data.filename === "SOURCE_SALARY"){
                        data.filename = "PERSON_SALARY";
                    }    
                    let qry = await Database.connection('oracledb').table('PROJECT_LEGACY_UPLOAD_STATUS').where({ 'ENTITY_NAME': data.filename, 'PROJECT_ID': 2 })
                        .update({ 'UPLOAD_STATUS': 'UPLOADED', 'TIMESTAMP': new Date() });
                    console.log(qry)
                    //insert service for log data           
                    var date = new Date();
                    var data1 = {
                        projectid: 2,
                        email: 'Linda@xyz.com',
                        status: 'UPLOADED'
                    }
                    let transactions = await Database.connection('oracledb').insert({
                        PROJECT_ID: data1.projectid,
                        TRANSACTION_DATE: date,
                        ENTITIY_ACCESSED: data.filename,
                        TRANSACTION_STATUS: data1.status,
                        TRANSACTION_PERFORMED_BY: data1.email
                    }).into('PROJECT_TRANSACTIONS');
                    console.log(transactions);
                }
                catch (err) {
                    console.log(err)
                    return response.send({ success: false, data: null, msg: 'DeprecationWarning', error: err });
                }
            }


            return response.status(200).send({ success: true, data: { data1: insertedData, status: 'uploaded', count: rowCount[0].total }, message: 'Data inserted successfully', error: null })
        }
        catch (error) {
            console.log(error);
            return response.status(200).send({ success: false, data: null, message: 'Error while inserting data', error: error });
        }
    }

    //post service for maintaing error list
    async errorlistFile({ request, response, error }) {
        try {
            let rawdata = fs.readFileSync('././././public/errorlist.json');
            let errorsList = JSON.parse(rawdata);
            console.log(errorsList);
            response.status(200).send({ success: true, data: errorsList, msg: 'Successfully load the errorlist file', err: null });

        }

        catch (error) {
            response.status(400).send({ success: false, data: null, msg: 'Error while loading the errorlist file', err: error });
        }



    }

}

module.exports = FileController
const Database = use('Database');
const moment = use('moment');
const Logger = use('Logger');
const bluebird = require('bluebird');

class SetupDataHelper {
    constructor() {

    }
    async InsertSetupData(entity, data) {
        var transactions = await bluebird.map(data, async (element) => {
            var obj = await this.GetObjectByEntity(entity, element);
            if (obj && obj != null) {
                let trans = await Database.connection('oracledb').insert(obj)
                    .into(entity.toUpperCase());
                console.log(trans);
                return trans;
            }
        },
            { concurrency: 10 },
        );

        return await Promise.all(transactions);
    }

    async GetObjectByEntity(entity, dataEntity) {
        if (entity.toUpperCase() == "LOCATIONS") {
            const locationData = await Database.connection('oracledb').select('*').from('LOCATIONS');
            var locationExists = locationData.some(location => location.LOCATIONID == dataEntity.LocationId);

            if (locationExists) {
                return new Promise((resolve, reject) => {
                    resolve(null);
                });
            }
            else {
                var obj = {
                    LOCATIONID: dataEntity.LocationId, LOCATIONCODE: dataEntity.LocationCode,
                    LOCATIONNAME: dataEntity.LocationName, COUNTRY: dataEntity.Country, PLACE: dataEntity.TownOrCity, DESCRIPTION: dataEntity.Description
                };

                return new Promise((resolve, reject) => {
                    resolve(obj);
                });
            }

        }

        if (entity.toUpperCase() == "GRADES") {
            const GradeData = await Database.connection('oracledb').select('*').from('GRADES');
            var gradeExists = GradeData.some(grade => grade.GRADEID == dataEntity.GradeId);

            if (gradeExists) {
                return new Promise((resolve, reject) => {
                    resolve(null);
                });
            }
            else {
                var obj = {
                    CATEGORYCODE: dataEntity.CategoryCode,
                    //EFFECTIVEENDDATE:dataEntity.EffectiveEndDate,
                    //EFFECTIVESTARTDATE: dataEntity.EffectiveStartDate,
                    GRADECODE: dataEntity.GradeCode,
                    GRADEID: dataEntity.GradeId,
                    GRADENAME: dataEntity.GradeName
                };

                return new Promise((resolve, reject) => {
                    resolve(obj);
                });
            }

        }

        //Organizations
        if (entity.toUpperCase() == "ORGANIZATIONS") {
            const OrgData = await Database.connection('oracledb').select('*').from('ORGANIZATIONS');
            var OrgExists = OrgData.some(org => org.ORGANIZATIONID == dataEntity.OrganizationId);

            if (OrgExists) {
                return new Promise((resolve, reject) => {
                    resolve(null);
                });
            }
            else {
                var obj = {
                    NAME: dataEntity.Name,
                    //EFFECTIVEENDDATE:dataEntity.EffectiveEndDate,
                    //EFFECTIVESTARTDATE: dataEntity.EffectiveStartDate,
                    CODE: dataEntity.OrganizationCode,
                    CLASSIFICATION_CODE: dataEntity.ClassificationCode,
                    ORGANIZATIONID: dataEntity.OrganizationId,
                    LOCATIONID: dataEntity.LocationId
                };

                return new Promise((resolve, reject) => {
                    resolve(obj);
                });
            }

        }

        //Jobs
        if (entity.toUpperCase() == "JOBS") {
            const JobData = await Database.connection('oracledb').select('*').from('JOBS');
            var jobExists = JobData.some(job => job.JOBID == dataEntity.JobId);

            if (jobExists) {
                return new Promise((resolve, reject) => {
                    resolve(null);
                });
            }
            else {
                var obj = {
                    JOBID: dataEntity.JobId,
                    //EFFECTIVEENDDATE:dataEntity.EffectiveEndDate,
                    //EFFECTIVESTARTDATE: dataEntity.EffectiveStartDate,
                    JOBCODE: dataEntity.JobCode,
                    JOBFAMILYID: dataEntity.JobFamilyId,
                    JOBFUNCTIONCODE: dataEntity.JobFunctionCode,
                    MANAGERLEVEL: dataEntity.ManagerLevel,
                    NAME: dataEntity.Name,
                    GRADELADDERID: dataEntity.GradeLadderId
                };

                return new Promise((resolve, reject) => {
                    resolve(obj);
                });
            }

        }

        //Departments
        if (entity.toUpperCase() == "DEPARTMENTS") {
            const DeptData = await Database.connection('oracledb').select('*').from('DEPARTMENTS');
            var DeptExists = DeptData.some(dep => dep.ORGANIZATIONID == dataEntity.OrganizationId && dep.LOCATIONID == dataEntity.LocationId);

            if (DeptExists) {
                return new Promise((resolve, reject) => {
                    resolve(null);
                });
            }
            else {
                var obj = {
                    ORGANIZATIONID: dataEntity.OrganizationId,
                    //EFFECTIVEENDDATE:dataEntity.EffectiveEndDate,
                    //EFFECTIVESTARTDATE: dataEntity.EffectiveStartDate,
                    NAME: dataEntity.Name,
                    LOCATIONID: dataEntity.LocationId,
                    LOCATIONCODE: dataEntity.LocationCode,
                    LOCATIONNAME: dataEntity.LocationName,
                    SETID: dataEntity.SetId,
                    SETCODE: dataEntity.SetCode,
                    SETNAME: dataEntity.SetName,
                    STATUS: dataEntity.Status
                };

                return new Promise((resolve, reject) => {
                    resolve(obj);
                });
            }
        }

        //Salary Basis
        if (entity.toUpperCase() == "SALARYBASIS") {
            const sbData = await Database.connection('oracledb').select('*').from('SALARYBASIS');
            var sbExists = sbData.some(sb => sb.SALARYBASISID == dataEntity.SALARYBASISID);

            if (sbExists) {
                return new Promise((resolve, reject) => {
                    resolve(null);
                });
            }
            else {
                var obj = {
                    SALARYBASISID: dataEntity.SalaryBasisId,
                    SALARYBASISNAME: dataEntity.SalaryBasisName,
                    FREQUENCYCODE: dataEntity.FrequencyCode,
                    FREQUENCYNAME: dataEntity.FrequencyName,
                    CODE: dataEntity.Code,
                    SALARYBASISTYPE: dataEntity.SalaryBasisType,
                    COMPONENTUSAGE: dataEntity.ComponentUsage,
                    ANNUALIZATIONFACTOR: dataEntity.AnnualizationFactor,
                    STATUS: dataEntity.Status,
                    SALARYAMOUNTSCALE: dataEntity.SalaryAmountScale,
                    GRADERATEID: dataEntity.GradeRateId,
                    INPUTCURRENCYCODE: dataEntity.InputCurrencyCode,
                    ELEMENTTYPEID: dataEntity.ElementTypeId,
                    LEGISLATIVEDATAGROUPID: dataEntity.LegislativeDataGroupId
                };

                return new Promise((resolve, reject) => {
                    resolve(obj);
                });
            }
        }
    }

}

module.exports = SetupDataHelper;
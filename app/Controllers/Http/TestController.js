'use strict'
const Database = use('Database');
const DataTransferRulesForDefaultTransfers = [
  {
    DestinationEntity: 'worker',
    DestinationColumns:['PersonId','PersonNumber','EffectiveEndDate','EffectiveStartDate','ActionCode','BloodType','CorrespondenceLanguage','CountryOfBirth','DateOfBirth','DateOfDeath','PersonDuplicateCheck'],
    SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'PERSON_NAME',column:'EFFECTIVE_END_DATE'},{entity:'PERSON',column:'START_DATE'},{entity:'ASSIGNMENT',column:'ACTION'},{entity:'PERSON',column:'BLOOD_TYPE'},{entity:'PERSON',column:'CORRESPONDENCE_LANGUAGE'},{entity:'PERSON',column:'COUNTRY_OF_BIRTH'},{entity:'PERSON',column:'DATE_OF_BIRTH'},{entity:'PERSON',column:'DATE_OF_DEATH'},{entity:'',column:''}],
    SourceQuery: "select ''as PersonId,PERSON_NUMBER,EFFECTIVE_END_DATE,START_DATE,ACTION,BLOOD_TYPE,CORRESPONDENCE_LANGUAGE,COUNTRY_OF_BIRTH,DATE_OF_BIRTH,DATE_OF_DEATH , '' AS PERSONDUPLICATECHECK  from PERSON, PERSON_NAME,ASSIGNMENT " +  
    "WHERE PERSON.UNIQUE_IDENTIFIER = PERSON_NAME.UNIQUE_IDENTIFIER AND PERSON_NAME.UNIQUE_IDENTIFIER = ASSIGNMENT.UNIQUE_IDENTIFIER "   
  
  },
  
  {
    DestinationEntity: 'PersonAddress',
    DestinationColumns:['PersonAddrUsageId', 'AddressLine1','PersonNumber','PersonId','EffectiveEndDate','EffectiveStartDate','AddlAddressAttribute1','AddlAddressAttribute2','AddlAddressAttribute3','AddlAddressAttribute4', 
    'AddlAddressAttribute5','AddressId','AddressLine2','AddressLine3','AddressLine4','AddressType','Country','LongPostalCode','PostalCode','PrimaryFlag','Region1','Region2','Region3','TownOrCity','SourceSystemId','SourceSystemOwner','GUID'],
    SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_1'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'EFFECTIVE_END_DATE'},{entity:'PERSON_ADDRESS',column:'EFFECTIVE_START_DATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_2'},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_3'},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_4'},{entity:'PERSON_ADDRESS',column:'ADDRESS_TYPE'},{entity:'PERSON_ADDRESS',column:'COUNTRY'},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'POSTAL_CODE'},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'REGION_1'},{entity:'PERSON_ADDRESS',column:'REGION_2'},{entity:'PERSON_ADDRESS',column:'REGION_3'},{entity:'PERSON_ADDRESS',column:'TOWN_OR_CITY'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
    SourceQuery: "SELECT '' as PersonAddrUsageId,b.ADDRESS_LINE_1,a.PERSON_NUMBER,'' as PersonId,b.EFFECTIVE_END_DATE,b.EFFECTIVE_START_DATE,'' as AddlAddressAttribute1,'' as AddlAddressAttribute2,'' as AddlAddressAttribute3,'' as AddlAddressAttribute4, '' as AddlAddressAttribute5,'' as AddressId,    a.PERSON_NUMBER,   b.ADDRESS_LINE_2, b.ADDRESS_LINE_3," +
     "b.ADDRESS_LINE_4,b.ADDRESS_TYPE,b.COUNTRY,'' as LongPostalCode,b.POSTAL_CODE,'' as Primaryflag,b.REGION_1,b.REGION_2,b.REGION_3,b.TOWN_OR_CITY,'' as SourceSystemId,'' as SourceSystemOwner,'' as GUID " + " FROM PERSON a,PERSON_ADDRESS b WHERE a.UNIQUE_IDENTIFIER = b.UNIQUE_IDENTIFIER"  
  },
  
  
  
  {
    DestinationEntity: 'PersonCitizenship',
    DestinationColumns:['CitizenshipId', 'LegislationCode', 'PersonNumber','PersonId','CitizenshipStatus','DateFrom','DateTo','SourceSystemId','SourceSystemOwner','GUID'],
    SourceColumnInfo:[{entity:'',column:''},{entity:'CITIZENSHIP_VO',column:'LEGISLATION_CODE'},{entity:'CITIZENSHIP_VO',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'CITIZENSHIP_VO',column:'CITIZENSHIP_STATUS'},{entity:'CITIZENSHIP_VO',column:'DATE_FROM'},{entity:'CITIZENSHIP_VO',column:'DATE_TO'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
    SourceQuery: "select '' as CitizenshipId, LEGISLATION_CODE,PERSON_NUMBER,'' as PersonId ,CITIZENSHIP_STATUS,DATE_FROM,DATE_TO, '' as SourceSystemId, '' as GUID from CITIZENSHIP_VO;"   
  
  },
  
  {
    DestinationEntity: 'PersonDriversLicence',
    DestinationColumns:['DriversLicenseId', 'LegislationCode','LicenseNumber','LicenseType','PersonNumber','PersonId','DateFrom','DateTo','IssuingAuthority','IssuingCountry','IssuingLocation','LicenseSuspended','NumberOfPoints','SuspendedFromDate','SuspendedToDate','DateTo','Violations','SourceSystemId','SourceSystemOwner','GUID'],
    SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON',column:'DRIVER_LICENSE_COUNTRY'},{entity:'PERSON',column:'DRIVER_LICENSE_NUMBER'},{entity:'PERSON',column:'DRIVER_LICENSE_TYPE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'',column:'START_DATE'},{entity:'PERSON',column:'DRIVER_LICENSE_EXP_DATE'},{entity:'DOCUMENTS_OF_RECORD_VO',column:'ISSUING_AUTHORITY'},{entity:'PERSON',column:'DRIVER_LICENSE_COUNTRY'},{entity:'PERSON',column:'DRIVER_LICENSE_STATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON',column:'DRIVER_LICENSE_EXP_DATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
    SourceQuery: "select '' as DriversLicenseId, a.DRIVER_LICENSE_COUNTRY,a.DRIVER_LICENSE_NUMBER, a.DRIVER_LICENSE_TYPE,a.PERSON_NUMBER,'' as PersonId, a.START_DATE,a.DRIVER_LICENSE_EXP_DATE,b.ISSUING_AUTHORITY,a.DRIVER_LICENSE_COUNTRY,a.DRIVER_LICENSE_STATE,'' as LicenseSuspended,''  from PERSON a, DOCUMENTS_OF_RECORD_VO b where a.PERSON_NUMBER = b.PERSON_NUMBER"
   },
  
   {
    DestinationEntity: 'PersonEmail',
    DestinationColumns:['EmailAddressId','EmailAddress', 'EmailType', 'PersonNumber','PersonId','DateFrom','DateTo','PrimaryFlag','SourceSystemId','SourceSystemOwner','GUID'],
    SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_EMAIL',column:'EMAIL_ADDRESS'},{entity:'PERSON_EMAIL',column:'EMAIL_TYPE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_EMAIL',column:'DATE_FROM'},{entity:'PERSON_EMAIL',column:'DATE_TO'},{entity:'PERSON_EMAIL',column:'PRIMARY_FLAG'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
    SourceQuery: "select '' as EmailAddressId, EMAIL_ADDRESS, EMAIL_TYPE, PERSON_NUMBER,'' as PersonId, DATE_FROM,DATE_TO,'' as PRIMARY_FLAG,'' as SourceSystemId,'' as SourceSystemOwner,'' as GUID  from PERSON_EMAIL, PERSON where PERSON.UNIQUE_IDENTIFIER = PERSON_EMAIL.UNIQUE_IDENTIFIER"
  },
  
  {
      DestinationEntity: 'PersonEthnicity',
      DestinationColumns:['EthnicityId', 'Ethnicity', 'LegislationCode','PersonNumber','PersonId','DeclarerId','DeclarerPersonNumber','PrimaryFlag','SourceSystemId','SourceSystemOwner','GUID'],
      SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON',column:'ETHNICITY'},{entity:'PERSON',column:'COUNTRY_CODE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
      SourceQuery: "select '' as EthnicityId, ETHNICITY, COUNTRY_CODE, PERSON_NUMBER,'' as PersonId,'' as DeclarerId,'' as DeclarerPersonNumber, PrimaryFlag,'' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON" 
  },
  
  {
      DestinationEntity: 'PersonLegislativeData',
      DestinationColumns:['PersonLegislativeId', 'LegislationCode', 'PersonNumber','PersonId','EffectiveEndDate','EffectiveStartDate','Sex','HighestEducationLevel','MaritalStatus','MaritalStatusDate','SourceSystemId','SourceSystemOwner','GUID' ],
      SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_LEGISLATIVE_INFO',column:'COUNTRY_CODE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_LEGISLATIVE_INFO',column:'EFFECTIVE_END_DATE'},{entity:'PERSON_LEGISLATIVE_INFO',column:'EFFECTIVE_START_DATE'},{entity:'PERSON_LEGISLATIVE_INFO',column:'SEX'},{entity:'PERSON_LEGISLATIVE_INFO',column:'HIGHEST_EDUCATION_LEVEL'},{entity:'PERSON_LEGISLATIVE_INFO',column:'MARITAL_STATUS'},{entity:'PERSON_LEGISLATIVE_INFO',column:'MARITAL_STATUS_DATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
      SourceQuery: "select '' as PersonLegislativeId, a.COUNTRY_CODE,b.PERSON_NUMBER,'' as PersonId,a.EFFECTIVE_END_DATE,a.EFFECTIVE_START_DATE,a.SEX,a.HIGHEST_EDUCATION_LEVEL,a.MARITAL_STATUS,a.MARITAL_STATUS_DATE, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID  from PERSON_LEGISLATIVE_INFO a,PERSON b where a.UNIQUE_IDENTIFIER = b.UNIQUE_IDENTIFIER"   
  },
  
  {
      DestinationEntity: 'PersonName',
      DestinationColumns: ['PersonNameId','NameType','PersonNumber','PersonId','EffectiveEndDate','EffectiveStartDate','CharSetContext','FirstName','Honors','LastName','LegislationCode','MiddleNames','MilitaryRank','NameInformation1','NameInformation10','NameInformation11','NameInformation12','NameInformation13','NameInformation14','NameInformation15','NameInformation16','NameInformation17','NameInformation18','NameInformation19','NameInformation20','NameInformation21','NameInformation22','NameInformation23','NameInformation24','NameInformation25','NameInformation26','NameInformation27','NameInformation28','NameInformation29','NameInformation3','NameInformation30','NameInformation4','NameInformation5','NameInformation6','NameInformation7','NameInformation8','NameInformation9','KnownAs','PreNameAdjunct','PreviousLastName','Suffix','Title','SourceSystemId','SourceSystemOwner','GUID'],
      SourceColumnInfo:[{entity:'',column:''},{entity:'',column:''},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_NAME',column:'EFFECTIVE_END_DATE'},{entity:'PERSON_NAME',column:'EFFECTIVE_START_DATE'},{entity:'',column:''},{entity:'PERSON_NAME',column:'FIRST_NAME'},{entity:'',column:''},{entity:'PERSON_NAME',column:'LAST_NAME'},{entity:'PERSON_NAME',column:'COUNTRY_CODE'},{entity:'PERSON_NAME',column:'MIDDLE_NAMES'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON_NAME',column:'KNOWN_AS'},{entity:'PERSON_NAME',column:'PRE_NAME_ADJUNCT'},{entity:'PERSON_NAME',column:'PREVIOUS_LAST_NAME'},{entity:'PERSON_NAME',column:'SUFFIX'},{entity:'PERSON_NAME',column:'TITLE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
      SourceQuery :"select '' as PersonNameId,'' as NameType, b.PERSON_NUMBER,'' as PersonId,a.EFFECTIVE_END_DATE,a.EFFECTIVE_START_DATE,'' as CharSetContext,a.FIRST_NAME,'' as Honors, a.LAST_NAME,a.COUNTRY_CODE,a.MIDDLE_NAMES, ''as MilitaryRank,'' as NameInformation1,'' as  NameInformation10, '' as NameInformation11,'' as NameInformation12,'' as NameInformation14, '' as  NameInformation15,'' as NameInformation16, '' as NameInformation17, '' as NameInformation18, '' as NameInformation19, '' as NameInformation20, '' as NameInformation21,'' as NameInformation22,'' as NameInformation23,'' as NameInformation24,'' as NameInformation25,'' as NameInformation26,'' as NameInformation27,'' as NameInformation28, '' as NameInformation29,'' NameInformation3,'' as NameInformation30,'' as NameInformation4,'' as NameInformation5,'' as NameInformation6,'' as NameInformation7,'' as NameInformation8,'' as NameInformation9,a.KNOWN_AS,a.PRE_NAME_ADJUNCT,a.PREVIOUS_LAST_NAME,a.SUFFIX,a.TITLE, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON_NAME a ,PERSON b where a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
     },
  
     {
      DestinationEntity: 'PersonPhone',
      DestinationColumns : ['PhoneId','PhoneNumber','PersonNumber','PhoneType','PersonId','AreaCode','CountryCodeNumber','DateFrom','DateTo','Extension','LegislationCode','PrimaryFlag','SpeedDialNumber','Validity','SourceSystemId','SourceSystemOwner','GUID'],
      SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_PHONE',column:'PHONE_NUMBER'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'PERSON_PHONE',column:'PHONE_TYPE'},{entity:'',column:''},{entity:'PERSON_PHONE',column:'AREA_CODE'},{entity:'PERSON_PHONE',column:'COUNTRY_CODE_NUMBER'},{entity:'PERSON_PHONE',column:'DATE_FROM'},{entity:'PERSON_PHONE',column:'DATE_TO'},{entity:'PERSON_PHONE',column:'EXTENSION'},{entity:'PERSON_PHONE',column:'COUNTRY_CODE'},{entity:'PERSON_PHONE',column:'PRIMARY_FLAG'},{entity:'PERSON_PHONE',column:'SPEED_DIAL_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
       SourceQuery :"select '' as PhoneId, a.PHONE_NUMBER,b.PERSON_NUMBER,a.PHONE_TYPE,'' as PersonId,a.AREA_CODE,a.COUNTRY_CODE_NUMBER,a.DATE_FROM,a.DATE_TO,a.EXTENSION,a.COUNTRY_CODE,a.PRIMARY_FLAG,a.SPEED_DIAL_NUMBER,'' as Validity, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON_PHONE a,PERSON b where a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
   },
   {
    DestinationEntity: 'Assignment',
    DestinationColumns : ['AssignmentId','AssignmentNumber','WorkTermsAssignmentId','WorkTermsNumber','EffectiveEndDate','EffectiveLatestChange','EffectiveSequence','EffectiveStartDate','ActionCode','AssignmentCategory','AssignmentName','AssignmentStatusTypeCode','AssignmentStatusTypeId','AssignmentType','BargainingUnitCode','BusinessUnitShortCode','BusinessUnitId','CollectiveAgreementIdCode','CollectiveAgreementId','DefaultExpenseAccount','DepartmentName','BillingTitle','InternalLocation','ProjectTitle','EndTime','EstablishmentId','ExpenseCheckSendToAddress','FreezeStartDate','FreezeUntilDate','Frequency','FullPartTime','GradeCode','GradeId','GradeLadderPgmId','GradeLadderPgmName','GspEligibilityFlag','HourlySalariedCode','InternalBuilding','InternalFloor','InternalMailstop','InternalOfficeNumber','JobCode','JobId','LabourUnionMemberFlag','LegalEmployerName','LocationCode','LocationId','ManagerFlag','NoticePeriod','NoticePeriodUOM','OrganizationId','PositionOverrideFlag','OvertimePeriodName','PeopleGroup','PeriodOfServiceId','PersonId','PersonNumber','PersonTypeCode','PersonTypeId','PositionCode','PositionId','PrimaryFlag','PrimaryAssignmentFlag','DateProbationEnd','ProbationPeriod','ProbationUnit','ProjectedEndDate','ProjectedStartDate','ProposedUserPersonType','ProposedWorkerType','ReasonCode','PermanentTemporary','ReportingEstablishment','RetirementAge','RetirementDate','SeniorityBasis','SpecialCeilingStep','SpecialCeilingStepId','NormalHours','DateStart','StartTime','SystemPersonType','TaxAddressId','UnionId','UnionName','WorkAtHomeFlag','WorkerCategory','WorkerType','SourceSystemId','SourceSystemOwner','GUID'],
    SourceColumnInfo:[{entity:'',column:''},{entity:'ASSIGNMENT',column:'ASSIGNMENT_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'EFFECTIVE_DATE'},{entity:'ASSIGNMENT',column:'ACTION'},{entity:'ASSIGNMENT',column:'EMPLOYMENT_CATEGORY'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ASSIGNMENT_STATUS_TYPE'},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'BARGAINING_UNIT_CODE'},{entity:'',column:'BUSINESS_UNIT'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'DEPARTMENT'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'TIME_NORMAL_START'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'FREQUENCY'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'GRADE'},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'GRADE_LADDER'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'HOURLY_SALARIED_CODE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'JOB'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'LABOUR_UNION_MEMBER_FLAG'},{entity:'ASSIGNMENT',column:'LEGAL_ENTITY'},{entity:'ASSIGNMENT',column:'LOCATION'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'MANAGER_FLAG'},{entity:'ASSIGNMENT',column:'NOTICE_PERIOD'},{entity:'ASSIGNMENT',column:'NOTICE_PERIOD_UOM'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'ASSIGNMENT',column:'USER_PERSON_TYPE'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'POSITION'},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'PRIMARY_ASSIGNMENT_FLAG'},{entity:'ASSIGNMENT',column:'DATE_PROBATION_END'},{entity:'ASSIGNMENT',column:'PROBATION_PERIOD'},{entity:'ASSIGNMENT',column:'PROBATION_UNIT'},{entity:'ASSIGNMENT',column:'PROJECTED_TERMINATION_DATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ACTION_REASON'},{entity:'ASSIGNMENT',column:'EMPLOYMENT_CATEGORY'},{entity:'ASSIGNMENT',column:'ESTABLISHMENT_ID'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'NORMAL_HOURS'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'TIME_NORMAL_FINISH'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'WORK_AT_HOME'},{entity:'ASSIGNMENT',column:'EMPLOYEE_CATEGORY'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
    SourceQuery : "select '' as AssignmentId,a.ASSIGNMENT_NUMBER,'' as WorkTermsAssignmentId,'' as WorkTermsNumber,'' as EffectiveEndDate,'' as EffectiveLatestChange,'' as EffectiveSequence,a.EFFECTIVE_DATE,a.ACTION,a.EMPLOYMENT_CATEGORY,'' as AssignmentName,a.ASSIGNMENT_STATUS_TYPE ,'' as AssignmentStatusTypeId,'' as AssignmentType,a.BARGAINING_UNIT_CODE,a.BUSINESS_UNIT,'' as BusinessUnitId, '' as CollectiveAgreementIdCode, '' as CollectiveAgreementId, '' as DefaultExpenseAccount, a.DEPARTMENT,'' as BillingTitle,'' as InternalLocation,'' as ProjectTitle,a.TIME_NORMAL_START,'' as EstablishmentId,'' as ExpenseCheckSendToAddress,'' as FreezeStartDate,'' as FreezeUntilDate, a.FREQUENCY, '' as FullPartTime,a.GRADE,'' as GradeId, '' as GradeLadderPgmId,a.GRADE_LADDER,'' as GspEligibilityFlag,a.HOURLY_SALARIED_CODE,'' as InternalBuilding,'' as InternalFloor,'' as InternalMailstop,'' as InternalOfficeNumber, JOB, '' as JobId,a.LABOUR_UNION_MEMBER_FLAG, a.LEGAL_ENTITY,a.LOCATION,'' as LocationId, a.MANAGER_FLAG, a.NOTICE_PERIOD,a.NOTICE_PERIOD_UOM,'' as OrganizationId,'' as PositionOverrideFlag,'' as OvertimePeriodName,'' as PeopleGroup,'' as PeriodOfServiceId,'' as PersonId,b.PERSON_NUMBER,a.USER_PERSON_TYPE,'' as PersonTypeId,a.POSITION,'' as PositionId,'' as PrimaryFlag,a.PRIMARY_ASSIGNMENT_FLAG,a.DATE_PROBATION_END,a.PROBATION_PERIOD,a.PROBATION_UNIT,a.PROJECTED_TERMINATION_DATE,'' as ProjectedStartDate,'' as ProposedUserPersonType,'' as ProposedWorkerType,a.ACTION_REASON,a.EMPLOYMENT_CATEGORY,a.ESTABLISHMENT_ID,'' as RetirementAge,'' as RetirementDate, '' as SeniorityBasis, '' as SpecialCeilingStep,'' as SpecialCeilingStepId,a.NORMAL_HOURS,'' as DateStart,a.TIME_NORMAL_FINISH,'' as SystemPersonType,'' as TaxAddressId,'' as UnionId,'' as UnionName,a.WORK_AT_HOME,a.EMPLOYEE_CATEGORY,'' as WorkerType, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from ASSIGNMENT a,PERSON b WHERE a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
   },
  {
      DestinationEntity: 'AssignmentSupervisor',
      DestinationColumns : ['AssignmentSupervisorId','AssignmentNumber','ManagerAssignmentNumber','ManagerPersonNumber','ManagerType','AssignmentId','EffectiveEndDate','EffectiveStartDate','ActionCode','ManagerId','NewManagerAssignmentNumber','NewManagerPersonNumber','NewManagerType','PersonId','PrimaryFlag','ReasonCode','ManagerAssignmentId','SourceSystemId','SourceSystemOwner','GUID'],
      SourceColumnInfo:[{entity:'',column:''},{entity:'SUPERVISOR',column:'ASSIGNMENT_NUMBER'},{entity:'SUPERVISOR',column:'MANAGER_ASSIGNMENT_NUMBER'},{entity:'',column:''},{entity:'SUPERVISOR',column:'MANAGER_TYPE'},{entity:'',column:''},{entity:'SUPERVISOR',column:'EFFECTIVE_END_DATE'},{entity:'SUPERVISOR',column:'EFFECTIVE_START_DATE'},{entity:'ASSIGNMENT',column:'ACTION'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ACTION_REASON'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
      SourceQuery : "select '' as AssignmentSupervisorId,a.ASSIGNMENT_NUMBER,a.MANAGER_ASSIGNMENT_NUMBER,'' as ManagerPersonNumber,a.MANAGER_TYPE,'' as AssignmentId,a.EFFECTIVE_END_DATE,a.EFFECTIVE_START_DATE,b.ACTION,'' as ManagerId,'' as NewManagerAssignmentNumber,'' as NewManagerPersonNumber,'' as  NewManagerType,'' as PersonId,'' as PrimaryFlag,b.ACTION_REASON,'' as ManagerAssignmentId, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from SUPERVISOR a,ASSIGNMENT b WHERE a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"   
      },
      {
          DestinationEntity:'AssignmentWorkMeasure',
          DestinationColumns :['AssignWorkMeasureId','AssignmentNumber','Unit','AssignmentId','EffectiveEndDate','EffectiveStartDate','ActionCode','NewUnit','ReasonCode','Value','SourceSystemId','SourceSystemOwner','GUID'],
          SourceColumnInfo:[{entity:'',column:''},{entity:'ASSIGNMENT',column:'ASSIGNMENT_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'EFFECTIVE_DATE'},{entity:'ASSIGNMENT',column:'ACTION'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ACTION_REASON'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
          SourceQuery : "select '' as AssignWorkMeasureId,ASSIGNMENT_NUMBER,'' as Unit,'' as AssignmentId,'' as EffectiveEndDate, EFFECTIVE_DATE,ACTION,'' as NewUnit,ACTION_REASON,'' as value,  '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from ASSIGNMENT"  
      }
  ]    

class TestController {
    async test({req, response, err}){
        try{
            // let v1 = await Database.raw('select * from proj_column_mapping where destination_column_id in (select destination_column_id from proj_column_mapping group by destination_column_id having count(*) > 1)');
            // console.log(v1);  
            var mapped = [];
            var unmapped = [];
            var entities = [];
            var entity_column_mappings = {};
            // var mappings = await Database.select('*').from('PROJ_DATA_MAPPINGS');
            //   console.log(mappings); 
              
              var data = await Database.connection('oracledb').raw('select entity_name, source_column_name, source_data, destination_data  from ' +
               '(select source_entity_id, source_column_id,source_column_name, proj_data_mappings.destination_data, source_data from PROJ_DATA_MAPPINGS order by source_entity_id) a, '  +
                '(select entity_id, ENTITY_NAME from PROJECT_SOURCE_ENTITY_LIST where entity_id in( select DISTINCT  source_entity_id  from proj_data_mappings)) b ' + 
                'where a.source_entity_id = b.entity_id');
                console.log(data);
             
                for (var i=0; i<data.length; i++){
                  if(entity_column_mappings[data[i].ENTITY_NAME] === undefined){
                    entity_column_mappings[data[i].ENTITY_NAME] = {};
                  }
                  if(entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME] === undefined){
                    entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME] = {mapped_values: [], source_values:[]} ;
                  }
                 entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].mapped_values.push(data[i].SOURCE_DATA)

                 if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values.length == 0) {
                  var qry = "select distinct " + data[i].SOURCE_COLUMN_NAME + " from " + data[i].ENTITY_NAME;

                  entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values = await Database.raw(qry)
 
                 }

                 if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values.length >
                  entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].mapped_values.length
                  )
                  {
                    ErrorManager.addWarnings({ruleinfo:'Each source field should be mapped with destination field',data: array, msg:"All source data values are not mapped"})
                    // All values are not mapped

                  }

                if (entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].source_values.length ==
                    entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].mapped_values.length
                    )
                    {
                      // All values are not mapped
                      var array = entity_column_mappings[data[i].ENTITY_NAME][data[i].SOURCE_COLUMN_NAME].mapped_values;
                      var duplicateFound = false;

                      for(var k = 0; k < array.length; k++) {
                        for (var j=k+1; j< array.length; j++) {
                          if (array[k] == array[j]) {
                            duplicateFound = true;

                            ErrorManager.addWarnings({ruleinfo:'Each source field should be mapped with destination field',data: array,msg:"Duplicate Found for " + data[i].ENTIY_NAME + " : " + data[i].SOURCE_COLUMN_NAME + " : " + array[k]})
                          }
                        }
                      }


                    }
  
                    
                 
                }
               
                console.log(entity_column_mappings);

                return response.send({data:entity_column_mappings})
             
            //return response.status(200).send({success:true, data:{mappings, mapped, unmapped}, msg:'success', err:null });
        }
        catch(err){
          console.log(err);
          return response.status(400).send({success:false, data:null, msg:'failure', err:error });
        }
        finally{
          Database.close(['oracledb']);
      }
   
    }


    async previewFile({request, response, err}){
    try{
      response.status(200).send({success:true, data:DataTransferRulesForDefaultTransfers, msg:'Successfully get the data', error:null});
    }catch(err){
      response.status(400).send({success:false, data:null, msg:'Error while get the data', error:err});
    }
    }

   




    

}

module.exports = TestController


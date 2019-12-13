'use strict'
const Database = use('Database');
const moment = use('moment');
// const Helpers = use('Helpers');
const fs = require('fs');

const DataTransferRulesForDefaultTransfers = [
    {
        DestinationEntity: "Worker",
        DestinationColumns: ['PersonNumber', 'EffectiveStartDate', 'PersonId', 'EffectiveEndDate', 'ActionCode', 'BloodType', 'CorrespondenceLanguage', 'CountryOfBirth', 'DateOfBirth', 'DateOfDeath', 'PersonDuplicateCheck'],
        SourceColumns: ['PersonNumber', 'START_DATE', 'PersonID', 'EFFECTIVE_END_DATE', 'ACTION', 'BLOOD_TYPE', 'CORRESPONDENCE_LANGUAGE', 'COUNTRY_OF_BIRTH', 'DATE_OF_BIRTH', 'DATE_OF_DEATH', 'PERSONDUPLICATECHECK'],
        //   SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'PERSON_NAME',column:'EFFECTIVE_END_DATE'},{entity:'PERSON',column:'START_DATE'},{entity:'ASSIGNMENT',column:'ACTION'},{entity:'PERSON',column:'BLOOD_TYPE'},{entity:'PERSON',column:'CORRESPONDENCE_LANGUAGE'},{entity:'PERSON',column:'COUNTRY_OF_BIRTH'},{entity:'PERSON',column:'DATE_OF_BIRTH'},{entity:'PERSON',column:'DATE_OF_DEATH'},{entity:'',column:''}],    
        SourceQuery: "select PERSON_NUMBER as PersonNumber,START_DATE,PERSON_NUMBER as PersonId ,EFFECTIVE_END_DATE,ACTION,BLOOD_TYPE,CORRESPONDENCE_LANGUAGE,COUNTRY_OF_BIRTH,DATE_OF_BIRTH,DATE_OF_DEATH, '' as  PERSONDUPLICATECHECK from PERSON, PERSON_NAME, ASSIGNMENT " +
            "WHERE PERSON.UNIQUE_IDENTIFIER = PERSON_NAME.UNIQUE_IDENTIFIER AND PERSON_NAME.UNIQUE_IDENTIFIER = ASSIGNMENT.UNIQUE_IDENTIFIER"

    },


    {
        DestinationEntity: "PersonAddress",
        DestinationColumns: ['PersonAddrUsageId', 'AddressLine1', 'PersonNumber', 'PersonId', 'EffectiveEndDate', 'EffectiveStartDate', 'AddlAddressAttribute1', 'AddlAddressAttribute2', 'AddlAddressAttribute3', 'AddlAddressAttribute4',
            'AddlAddressAttribute5', 'AddressId', 'AddressLine2', 'AddressLine3', 'AddressLine4', 'AddressType', 'Country', 'LongPostalCode', 'PostalCode', 'PrimaryFlag', 'Region1', 'Region2', 'Region3', 'TownOrCity', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['PersonAddrUsageId', 'ADDRESS_LINE_1', 'PERSON_NUMBER', 'PERSONID', 'EFFECTIVE_END_DATE', 'EFFECTIVE_START_DATE', 'AddlAddressAttribute1', 'AddlAddressAttribute2', 'AddlAddressAttribute3', 'AddlAddressAttribute4', 'AddlAddressAttribute5',
            'AddressId', 'ADDRESS_LINE_2', 'ADDRESS_LINE_3', 'ADDRESS_LINE_4', 'ADDRESS_TYPE', 'COUNTRY', 'LONGPOSTALCODE', 'POSTAL_CODE', 'PRIMARYFLAG', 'REGION_1', 'REGION_2', 'REGION_3', 'TOWN_OR_CITY', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        //   SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_1'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'EFFECTIVE_END_DATE'},{entity:'PERSON_ADDRESS',column:'EFFECTIVE_START_DATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_2'},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_3'},{entity:'PERSON_ADDRESS',column:'ADDRESS_LINE_4'},{entity:'PERSON_ADDRESS',column:'ADDRESS_TYPE'},{entity:'PERSON_ADDRESS',column:'COUNTRY'},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'POSTAL_CODE'},{entity:'',column:''},{entity:'PERSON_ADDRESS',column:'REGION_1'},{entity:'PERSON_ADDRESS',column:'REGION_2'},{entity:'PERSON_ADDRESS',column:'REGION_3'},{entity:'PERSON_ADDRESS',column:'TOWN_OR_CITY'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "SELECT '' as PersonAddrUsageId,b.ADDRESS_LINE_1,a.PERSON_NUMBER,'' as PersonId,b.EFFECTIVE_END_DATE,b.EFFECTIVE_START_DATE,'' as AddlAddressAttribute1,'' as AddlAddressAttribute2,'' as AddlAddressAttribute3,'' as AddlAddressAttribute4, '' as AddlAddressAttribute5,'' as AddressId,    a.PERSON_NUMBER,   b.ADDRESS_LINE_2, b.ADDRESS_LINE_3," +
            "b.ADDRESS_LINE_4,b.ADDRESS_TYPE,b.COUNTRY,'' as LongPostalCode,b.POSTAL_CODE,'' as Primaryflag,b.REGION_1,b.REGION_2,b.REGION_3,b.TOWN_OR_CITY,'' as SourceSystemId,'' as SourceSystemOwner,'' as GUID " + " FROM PERSON a,PERSON_ADDRESS b WHERE a.UNIQUE_IDENTIFIER = b.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'PersonCitizenship',
        DestinationColumns: ['CitizenshipId', 'LegislationCode', 'PersonNumber', 'PersonId', 'CitizenshipStatus', 'DateFrom', 'DateTo', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['CitizenshipId', 'LEGISLATION_CODE', 'PERSON_NUMBER', 'PersonId', 'CITIZENSHIP_STATUS', 'DATE_FROM', 'DATE_TO', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        // SourceColumnInfo:[{entity:'',column:''},{entity:'CITIZENSHIP_VO',column:'LEGISLATION_CODE'},{entity:'CITIZENSHIP_VO',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'CITIZENSHIP_VO',column:'CITIZENSHIP_STATUS'},{entity:'CITIZENSHIP_VO',column:'DATE_FROM'},{entity:'CITIZENSHIP_VO',column:'DATE_TO'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as CitizenshipId, LEGISLATION_CODE,PERSON_NUMBER,'' as PersonId ,CITIZENSHIP_STATUS, DATE_FROM, DATE_TO, '' as SourceSystemId, '' as SourceSystemOwner, '' as GUID from CITIZENSHIP_VO "

    },

    {
        DestinationEntity: 'PersonDriversLicence',
        DestinationColumns: ['DriversLicenseId', 'LegislationCode', 'LicenseNumber', 'LicenseType', 'PersonNumber', 'PersonId', 'DateFrom', 'IssuingAuthority', 'IssuingCountry', 'IssuingLocation', 'LicenseSuspended', 'NumberOfPoints', 'SuspendedFromDate', 'SuspendedToDate', 'DateTo', 'Violations', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['DriversLicenseId', 'COUNTRY_CODE', 'DRIVER_LICENSE_NUMBER', 'DRIVER_LICENSE_TYPE', 'PERSON_NUMBER', 'PersonId', 'START_DATE', 'ISSUING_AUTHORITY', 'DRIVER_LICENSE_COUNTRY', 'DRIVER_LICENSE_STATE', 'LicenseSuspended', 'NumberOfPoints', 'SuspendedFromDate', 'SuspendedToDate', 'DRIVER_LICENSE_EXP_DATE', 'Violations', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        // SourceColumnInfo: [{ entity: '', column: '' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_COUNTRY' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_NUMBER' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_TYPE' }, { entity: 'PERSON', column: 'PERSON_NUMBER' }, { entity: '', column: '' }, { entity: '', column: 'START_DATE' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_EXP_DATE' }, { entity: 'DOCUMENTS_OF_RECORD_VO', column: 'ISSUING_AUTHORITY' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_COUNTRY' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_STATE' }, { entity: '', column: '' }, { entity: '', column: '' }, { entity: '', column: '' }, { entity: '', column: '' }, { entity: 'PERSON', column: 'DRIVER_LICENSE_EXP_DATE' }, { entity: '', column: '' }, { entity: '', column: '' }, { entity: '', column: '' }, { entity: '', column: '' }],
        SourceQuery: "select '' as DriversLicenseId, a.COUNTRY_CODE,a.DRIVER_LICENSE_NUMBER, a.DRIVER_LICENSE_TYPE,a.PERSON_NUMBER,'' as PersonId, a.START_DATE,b.ISSUING_AUTHORITY,a.DRIVER_LICENSE_COUNTRY,a.DRIVER_LICENSE_STATE,'' as LicenseSuspended,'' as NumberOfPoints, '' as SuspendedFromDate,'' as SuspendedToDate, a.DRIVER_LICENSE_EXP_DATE, '' as Violations, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON a, DOCUMENTS_OF_RECORD_VO b where a.PERSON_NUMBER = b.PERSON_NUMBER"
    },

    {
        DestinationEntity: 'PersonEmail',
        DestinationColumns: ['EmailAddressId', 'EmailAddress', 'EmailType', 'PersonNumber', 'PersonId', 'DateFrom', 'DateTo', 'PrimaryFlag', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['EmailAddressId', 'EMAIL_ADDRESS', 'EMAIL_TYPE', 'PERSON_NUMBER', 'PersonId', 'DATE_FROM', 'DATE_TO', 'PRIMARY_FLAG', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        // SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_EMAIL',column:'EMAIL_ADDRESS'},{entity:'PERSON_EMAIL',column:'EMAIL_TYPE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_EMAIL',column:'DATE_FROM'},{entity:'PERSON_EMAIL',column:'DATE_TO'},{entity:'PERSON_EMAIL',column:'PRIMARY_FLAG'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as EmailAddressId, EMAIL_ADDRESS, EMAIL_TYPE, PERSON_NUMBER,'' as PersonId, DATE_FROM,DATE_TO,'' as PRIMARY_FLAG,'' as SourceSystemId,'' as SourceSystemOwner,'' as GUID  from PERSON_EMAIL, PERSON where PERSON.UNIQUE_IDENTIFIER = PERSON_EMAIL.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'PersonEthnicity',
        DestinationColumns: ['EthnicityId', 'Ethnicity', 'LegislationCode', 'PersonNumber', 'PersonId', 'DeclarerId', 'DeclarerPersonNumber', 'PrimaryFlag', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['EthnicityId', 'ETHNICITY', 'COUNTRY_CODE', 'PERSON_NUMBER', 'PersonId', 'DeclarerId', 'DeclarerPersonNumber', 'PrimaryFlag', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        // SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON',column:'ETHNICITY'},{entity:'PERSON',column:'COUNTRY_CODE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as EthnicityId, ETHNICITY, COUNTRY_CODE, PERSON_NUMBER,'' as PersonId,'' as DeclarerId,'' as DeclarerPersonNumber, '' as PrimaryFlag,'' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON"
    },

    {
        DestinationEntity: 'PersonLegislativeData',
        DestinationColumns: ['PersonLegislativeId', 'LegislationCode', 'PersonNumber', 'PersonId', 'EffectiveEndDate', 'EffectiveStartDate', 'Sex', 'HighestEducationLevel', 'MaritalStatus', 'MaritalStatusDate', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['PersonLegislativeId', 'COUNTRY_CODE', 'PERSON_NUMBER', 'PersonId', 'EFFECTIVE_END_DATE', 'EFFECTIVE_START_DATE', 'SEX', 'HIGHEST_EDUCATION_LEVEL', 'MARITAL_STATUS', 'MARITAL_STATUS_DATE', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        // SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON',column:'ETHNICITY'},{entity:'PERSON',column:'COUNTRY_CODE'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as PersonLegislativeId, a.COUNTRY_CODE,b.PERSON_NUMBER,'' as PersonId,a.EFFECTIVE_END_DATE,a.EFFECTIVE_START_DATE,a.SEX,a.HIGHEST_EDUCATION_LEVEL,a.MARITAL_STATUS,a.MARITAL_STATUS_DATE, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID  from PERSON_LEGISLATIVE_INFO a,PERSON b where a.UNIQUE_IDENTIFIER = b.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'PersonName',
        DestinationColumns: ['PersonNameId', 'NameType', 'PersonNumber', 'PersonId', 'EffectiveEndDate', 'EffectiveStartDate', 'CharSetContext', 'FirstName', 'Honors', 'LastName', 'LegislationCode', 'MiddleNames', 'MilitaryRank', 'NameInformation1', 'NameInformation10', 'NameInformation11', 'NameInformation12', 'NameInformation13', 'NameInformation14', 'NameInformation15', 'NameInformation16', 'NameInformation17', 'NameInformation18', 'NameInformation19', 'NameInformation20', 'NameInformation21', 'NameInformation22', 'NameInformation23', 'NameInformation24', 'NameInformation25', 'NameInformation26', 'NameInformation27', 'NameInformation28', 'NameInformation29', 'NameInformation3', 'NameInformation30', 'NameInformation4', 'NameInformation5', 'NameInformation6', 'NameInformation7', 'NameInformation8', 'NameInformation9', 'KnownAs', 'PreNameAdjunct', 'PreviousLastName', 'Suffix', 'Title', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['PersonNameId', 'NameType', 'PERSON_NUMBER', 'PersonId', 'EFFECTIVE_END_DATE', 'EFFECTIVE_START_DATE', 'CharSetContext', 'FIRST_NAME', 'Honors', 'LAST_NAME', 'COUNTRY_CODE', 'MIDDLE_NAMES', 'MilitaryRank', 'NameInformation1', 'NameInformation10', 'NameInformation11', 'NameInformation12', 'NameInformation13', 'NameInformation14', 'NameInformation15', 'NameInformation16', 'NameInformation17', 'NameInformation18', 'NameInformation19', ' NameInformation20', 'NameInformation21', ' NameInformation22', ' NameInformation23', ' NameInformation24', ' NameInformation25', ' NameInformation26', ' NameInformation27', ' NameInformation28', ' NameInformation29', ' NameInformation3', ' NameInformation30', ' NameInformation4', ' NameInformation5', ' NameInformation6', 'NameInformation7', 'NameInformation8', 'NameInformation9', 'KNOWN_AS', 'PRE_NAME_ADJUNCT', 'PREVIOUS_LAST_NAME', 'SUFFIX', 'TITLE', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        // SourceColumnInfo:[{entity:'',column:''},{entity:'',column:''},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'',column:''},{entity:'PERSON_NAME',column:'EFFECTIVE_END_DATE'},{entity:'PERSON_NAME',column:'EFFECTIVE_START_DATE'},{entity:'',column:''},{entity:'PERSON_NAME',column:'FIRST_NAME'},{entity:'',column:''},{entity:'PERSON_NAME',column:'LAST_NAME'},{entity:'PERSON_NAME',column:'COUNTRY_CODE'},{entity:'PERSON_NAME',column:'MIDDLE_NAMES'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON_NAME',column:'KNOWN_AS'},{entity:'PERSON_NAME',column:'PRE_NAME_ADJUNCT'},{entity:'PERSON_NAME',column:'PREVIOUS_LAST_NAME'},{entity:'PERSON_NAME',column:'SUFFIX'},{entity:'PERSON_NAME',column:'TITLE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as PersonNameId,'' as NameType, b.PERSON_NUMBER,'' as PersonId,a.EFFECTIVE_END_DATE,a.EFFECTIVE_START_DATE,'' as CharSetContext,a.FIRST_NAME,'' as Honors, a.LAST_NAME,a.COUNTRY_CODE,a.MIDDLE_NAMES, ''as MilitaryRank,'' as NameInformation1,'' as  NameInformation10, '' as NameInformation11,'' as NameInformation12,'' as NameInformation13,'' as NameInformation14, '' as  NameInformation15,'' as NameInformation16, '' as NameInformation17, '' as NameInformation18, '' as NameInformation19, '' as NameInformation20, '' as NameInformation21,'' as NameInformation22,'' as NameInformation23,'' as NameInformation24,'' as NameInformation25,'' as NameInformation26,'' as NameInformation27,'' as NameInformation28, '' as NameInformation29,'' NameInformation3,'' as NameInformation30,'' as NameInformation4,'' as NameInformation5,'' as NameInformation6,'' as NameInformation7,'' as NameInformation8,'' as NameInformation9,a.KNOWN_AS,a.PRE_NAME_ADJUNCT,a.PREVIOUS_LAST_NAME,a.SUFFIX,a.TITLE, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON_NAME a ,PERSON b where a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'PersonPhone',
        DestinationColumns: ['PhoneId', 'PhoneNumber', 'PersonNumber', 'PhoneType', 'PersonId', 'AreaCode', 'CountryCodeNumber', 'DateFrom', 'DateTo', 'Extension', 'LegislationCode', 'PrimaryFlag', 'SpeedDialNumber', 'Validity', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['PhoneId', 'PHONE_NUMBER', 'PERSON_NUMBER', 'PHONE_TYPE', 'PersonId', 'AREA_CODE', 'COUNTRY_CODE_NUMBER', 'DATE_FROM', 'DATE_TO', 'EXTENSION', 'COUNTRY_CODE', 'PRIMARY_FLAG', 'SPEED_DIAL_NUMBER', 'Validity', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        //  SourceColumnInfo:[{entity:'',column:''},{entity:'PERSON_PHONE',column:'PHONE_NUMBER'},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'PERSON_PHONE',column:'PHONE_TYPE'},{entity:'',column:''},{entity:'PERSON_PHONE',column:'AREA_CODE'},{entity:'PERSON_PHONE',column:'COUNTRY_CODE_NUMBER'},{entity:'PERSON_PHONE',column:'DATE_FROM'},{entity:'PERSON_PHONE',column:'DATE_TO'},{entity:'PERSON_PHONE',column:'EXTENSION'},{entity:'PERSON_PHONE',column:'COUNTRY_CODE'},{entity:'PERSON_PHONE',column:'PRIMARY_FLAG'},{entity:'PERSON_PHONE',column:'SPEED_DIAL_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as PhoneId, a.PHONE_NUMBER,b.PERSON_NUMBER,a.PHONE_TYPE,'' as PersonId,a.AREA_CODE,a.COUNTRY_CODE_NUMBER,a.DATE_FROM,a.DATE_TO,a.EXTENSION,a.COUNTRY_CODE,a.PRIMARY_FLAG,a.SPEED_DIAL_NUMBER,'' as Validity, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from PERSON_PHONE a,PERSON b where a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'Assignment',
        DestinationColumns: ['AssignmentId', 'AssignmentNumber', 'WorkTermsAssignmentId', 'WorkTermsNumber', 'EffectiveEndDate', 'EffectiveLatestChange', 'EffectiveSequence', 'EffectiveStartDate', 'ActionCode', 'AssignmentCategory', 'AssignmentName', 'AssignmentStatusTypeCode', 'AssignmentStatusTypeId', 'AssignmentType', 'BargainingUnitCode', 'BusinessUnitShortCode', 'BusinessUnitId', 'CollectiveAgreementIdCode', 'CollectiveAgreementId',
            'DefaultExpenseAccount', 'DepartmentName', 'BillingTitle', 'InternalLocation', 'ProjectTitle', 'EndTime', 'EstablishmentId', 'ExpenseCheckSendToAddress', 'FreezeStartDate', 'FreezeUntilDate', 'Frequency', 'FullPartTime', 'GradeCode', 'GradeId', 'GradeLadderPgmId', 'GradeLadderPgmName', 'GspEligibilityFlag', 'HourlySalariedCode', 'InternalBuilding', 'InternalFloor', 'InternalMailstop', 'InternalOfficeNumber', 'JobCode', 'JobId',
            'LabourUnionMemberFlag', 'LegalEmployerName', 'LocationCode', 'LocationId', 'ManagerFlag', 'NoticePeriod', 'NoticePeriodUOM', 'OrganizationId', 'PositionOverrideFlag', 'OvertimePeriodName', 'PeopleGroup', 'PeriodOfServiceId', 'PersonId', 'PersonNumber', 'PersonTypeCode', 'PersonTypeId', 'PositionCode', 'PositionId', 'PrimaryFlag', 'PrimaryAssignmentFlag', 'DateProbationEnd', 'ProbationPeriod', 'ProbationUnit',
            'ProjectedEndDate', 'ProjectedStartDate', 'ProposedUserPersonType', 'ProposedWorkerType', 'ReasonCode', 'PermanentTemporary', 'ReportingEstablishment', 'RetirementAge', 'RetirementDate', 'SeniorityBasis', 'SpecialCeilingStep', 'SpecialCeilingStepId', 'NormalHours', 'DateStart', 'StartTime', 'SystemPersonType', 'TaxAddressId', 'UnionId', 'UnionName', 'WorkAtHomeFlag', 'WorkerCategory', 'WorkerType', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['AssignmentId', 'ASSIGNMENT_NUMBER', 'WorkTermsAssignmentId', 'WorkTermsNumber', 'EFFECTIVE_DATE', 'EffectiveLatestChange', 'EffectiveSequence', 'EFFECTIVE_DATE', 'ACTION', 'EMPLOYMENT_CATEGORY', 'AssignmentName', 'ASSIGNMENT_STATUS_TYPE', 'AssignmentStatusTypeId', 'AssignmentType', 'BARGAINING_UNIT_CODE', 'BUSINESS_UNIT', 'BusinessUnitId', 'CollectiveAgreementIdCode', 'CollectiveAgreementId',
            'DefaultExpenseAccount', 'DEPARTMENT', 'BillingTitle', 'InternalLocation', 'ProjectTitle', 'TIME_NORMAL_START', 'EstablishmentId', 'ExpenseCheckSendToAddress', 'FreezeStartDate', 'FreezeUntilDate', 'FREQUENCY', 'FullPartTime', 'GRADE', 'GradeId', 'GradeLadderPgmId', 'GRADE_LADDER', 'GspEligibilityFlag', 'HOURLY_SALARIED_CODE', 'InternalBuilding', 'InternalFloor', 'InternalMailstop', 'InternalOfficeNumber', 'JOB', 'JobId',
            'LABOUR_UNION_MEMBER_FLAG', 'LEGAL_ENTITY', 'LOCATION', 'LocationId', 'MANAGER_FLAG', 'NOTICE_PERIOD', 'NOTICE_PERIOD_UOM', 'OrganizationId', 'PositionOverrideFlag', 'OvertimePeriodName', 'PeopleGroup', 'PeriodOfServiceId', ' PersonId', 'PERSON_NUMBER', 'USER_PERSON_TYPE', 'PersonTypeId', 'POSITION', 'PositionId', 'PrimaryFlag', 'PRIMARY_ASSIGNMENT_FLAG', 'DATE_PROBATION_END', 'PROBATION_PERIOD', 'PROBATION_UNIT',
            'PROJECTED_TERMINATION_DATE', 'ProjectedStartDate', 'ProposedUserPersonType', 'ProposedWorkerType', 'ACTION_REASON', 'PERMANENTTEMPORARY', 'ESTABLISHMENT_ID', 'RetirementAge', 'RetirementDate', 'SeniorityBasis', 'SpecialCeilingStep', 'SpecialCeilingStepId', 'NORMAL_HOURS', 'DateStart', 'StartTime', 'SystemPersonType', 'TaxAddressId', 'UnionId', 'UnionName', 'WORK_AT_HOME', 'EMPLOYEE_CATEGORY', ' WorkerType', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        //  SourceColumnInfo:[{entity:'',column:''},{entity:'ASSIGNMENT',column:'ASSIGNMENT_NUMBER'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'EFFECTIVE_DATE'},{entity:'ASSIGNMENT',column:'ACTION'},{entity:'ASSIGNMENT',column:'EMPLOYMENT_CATEGORY'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ASSIGNMENT_STATUS_TYPE'},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'BARGAINING_UNIT_CODE'},{entity:'',column:'BUSINESS_UNIT'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'DEPARTMENT'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'TIME_NORMAL_START'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'FREQUENCY'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'GRADE'},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'GRADE_LADDER'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'HOURLY_SALARIED_CODE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'JOB'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'LABOUR_UNION_MEMBER_FLAG'},{entity:'ASSIGNMENT',column:'LEGAL_ENTITY'},{entity:'ASSIGNMENT',column:'LocationCode'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'MANAGER_FLAG'},{entity:'ASSIGNMENT',column:'NOTICE_PERIOD'},{entity:'ASSIGNMENT',column:'NOTICE_PERIOD_UOM'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'PERSON',column:'PERSON_NUMBER'},{entity:'ASSIGNMENT',column:'USER_PERSON_TYPE'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'POSITION'},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'PRIMARY_ASSIGNMENT_FLAG'},{entity:'ASSIGNMENT',column:'DATE_PROBATION_END'},{entity:'ASSIGNMENT',column:'PROBATION_PERIOD'},{entity:'ASSIGNMENT',column:'PROBATION_UNIT'},{entity:'ASSIGNMENT',column:'PROJECTED_TERMINATION_DATE'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ACTION_REASON'},{entity:'',column:''},{entity:'ASSIGNMENT',column:'ESTABLISHMENT_ID'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'NORMAL_HOURS'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'ASSIGNMENT',column:'WORK_AT_HOME'},{entity:'ASSIGNMENT',column:'EMPLOYEE_CATEGORY'},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''},{entity:'',column:''}],
        SourceQuery: "select '' as AssignmentId,a.ASSIGNMENT_NUMBER,'' as WorkTermsAssignmentId,'' as WorkTermsNumber,'' as EffectiveEndDate,'' as EffectiveLatestChange,'' as EffectiveSequence,a.EFFECTIVE_DATE,a.ACTION,a.EMPLOYMENT_CATEGORY,'' as AssignmentName,a.ASSIGNMENT_STATUS_TYPE ,'' as AssignmentStatusTypeId,'' as AssignmentType,a.BARGAINING_UNIT_CODE, a.BUSINESS_UNIT,'' as BusinessUnitId, '' as CollectiveAgreementIdCode, '' as  CollectiveAgreementId, '' as DefaultExpenseAccount, a.DEPARTMENT,'' as BillingTitle,'' as InternalLocation,'' as ProjectTitle,a.TIME_NORMAL_START, '' as EstablishmentId,'' as ExpenseCheckSendToAddress,'' as FreezeStartDate,'' as FreezeUntilDate, a.FREQUENCY, '' as FullPartTime,a.GRADE,'' as GradeId, '' as GradeLadderPgmId,a.GRADE_LADDER,'' as GspEligibilityFlag,a.HOURLY_SALARIED_CODE,'' as InternalBuilding,'' as InternalFloor,'' as InternalMailstop,'' as InternalOfficeNumber, JOB, '' as JobId,a.LABOUR_UNION_MEMBER_FLAG, a.LEGAL_ENTITY,a.LOCATION,'' as LocationId, a.MANAGER_FLAG, a.NOTICE_PERIOD,a.NOTICE_PERIOD_UOM,'' as OrganizationId,'' as PositionOverrideFlag,'' as OvertimePeriodName,'' as  PeopleGroup,'' as PeriodOfServiceId,'' as PersonId,b.PERSON_NUMBER,a.USER_PERSON_TYPE,'' as PersonTypeId,a.POSITION,'' as PositionId,'' as PrimaryFlag,a.PRIMARY_ASSIGNMENT_FLAG,a.DATE_PROBATION_END,a.PROBATION_PERIOD,a.PROBATION_UNIT,a.PROJECTED_TERMINATION_DATE,'' as ProjectedStartDate,'' as ProposedUserPersonType,'' as ProposedWorkerType,a.ACTION_REASON,'' as Permanenttemporary,a.ESTABLISHMENT_ID,'' as RetirementAge,'' as RetirementDate, '' as SeniorityBasis, '' as SpecialCeilingStep,'' as SpecialCeilingStepId,a.NORMAL_HOURS,'' as DateStart,a.TIME_NORMAL_FINISH,'' as  SystemPersonType,'' as TaxAddressId,'' as UnionId,'' as UnionName,a.WORK_AT_HOME,a.employee_category,'' as WorkerType, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from ASSIGNMENT a,PERSON b WHERE a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'AssignmentSupervisor',
        DestinationColumns: ['AssignmentSupervisorId', 'AssignmentNumber', 'ManagerAssignmentNumber', 'ManagerPersonNumber', 'ManagerType', 'AssignmentId', 'EffectiveEndDate', 'EffectiveStartDate', 'ActionCode', 'ManagerId', 'NewManagerAssignmentNumber',
            'NewManagerPersonNumber', 'NewManagerType', 'PersonId', 'PrimaryFlag', 'ReasonCode', 'ManagerAssignmentId', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['AssignmentSupervisorId', 'ASSIGNMENT_NUMBER', 'MANAGER_ASSIGNMENT_NUMBER', 'ManagerPersonNumber', 'MANAGER_TYPE', 'AssignmentId', 'EFFECTIVE_END_DATE', 'EFFECTIVE_START_DATE', 'ACTION', 'ManagerId', 'NewManagerAssignmentNumber',
            'NewManagerPersonNumber', 'NewManagerType', 'PersonId', 'PrimaryFlag', 'ACTION_REASON', 'ManagerAssignmentId', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceQuery: "select '' as AssignmentSupervisorId,a.ASSIGNMENT_NUMBER,a.MANAGER_ASSIGNMENT_NUMBER,'' as ManagerPersonNumber,a.MANAGER_TYPE,'' as AssignmentId,a.EFFECTIVE_END_DATE,a.EFFECTIVE_START_DATE,b.ACTION,'' as ManagerId,'' as NewManagerAssignmentNumber,'' as NewManagerPersonNumber,'' as  NewManagerType,'' as PersonId,'' as PrimaryFlag,ACTION_REASON,'' as ManagerAssignmentId, '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from SUPERVISOR a,ASSIGNMENT b WHERE a.UNIQUE_IDENTIFIER=b.UNIQUE_IDENTIFIER"
    },

    {
        DestinationEntity: 'AssignmentWorkMeasure',
        DestinationColumns: ['AssignWorkMeasureId', 'AssignmentNumber', 'Unit', 'AssignmentId', 'EffectiveEndDate', 'EffectiveStartDate', 'ActionCode', 'NewUnit', 'ReasonCode', 'Value', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceColumns: ['AssignWorkMeasureId', 'ASSIGNMENT_NUMBER', 'Unit', 'AssignmentId', 'EffectiveEndDate', 'EFFECTIVE_DATE', 'ACTION', 'NewUnit', 'ACTION_REASON', 'value', 'SourceSystemId', 'SourceSystemOwner', 'GUID'],
        SourceQuery: "select '' as AssignWorkMeasureId,ASSIGNMENT_NUMBER,'' as Unit,'' as AssignmentId,'' as EffectiveEndDate, EFFECTIVE_DATE,ACTION,'' as NewUnit,ACTION_REASON,'' as value,  '' as SourceSystemId,'' as SourceSystemOwner,'' as GUID from ASSIGNMENT"
    }

]


class HdlController {

    async convert() {
        try {
            var HDLEntries = [];



            for (var i = 0; i < DataTransferRulesForDefaultTransfers.length; i++) {
                var rule = DataTransferRulesForDefaultTransfers[i];

                var metadataline = "METADATA|" + rule.DestinationEntity
                var mergeline = "MERGE|" + rule.DestinationEntity

                var noDataPresent = false;

               



                var result = await Database.raw(rule.SourceQuery)
                console.log(result);

                for (var j = 0; j < rule.DestinationColumns.length; j++) {
                    metadataline = metadataline + "|" + rule.DestinationColumns[j]  
                    
                }
                    var mergelines = [];

                    for (var row = 0; row < result.length; row++) {

                       

                        // //putting sourcesystemowner as 'EBS' default
                        if( result[row].SOURCESYSTEMOWNER === null){
                            result[row].SOURCESYSTEMOWNER = 'EBS';
                        }

                        var keys = [];

                        var keys = Object.keys(result[row]);
                        for(var k=0; k<keys.length; k++){
                           
                            if( keys[k] == 'LEGISLATION_CODE'){                
                                if(Object.values(result[row]).LEGISLATION_CODE != 'US'){
                                    result[row].LEGISLATION_CODE = 'US';
                                }
                            }

                            if(rule.DestinationEntity === "PersonDriversLicence" || rule.DestinationEntity === "PersonEthnicity"){
                                result[row].COUNTRY_CODE = 'US';
                            }

                            if(keys[k] == 'ACTION'){
                                if(result[row].ACTION === null || typeof(result[row].ACTION == "string")){
                                    result[row].ACTION = 'HIRE';
                                }
                            }
                        
                        }

                        

                        // if(result[row].EFFECTIVE_START_DATE == null && result[row].EFFECTIVE_END_DATE == null){
                        //     result[row].EFFECTIVE_START_DATE = null;
                        //     result[row].EFFECTIVE_END_DATE = null;

                        // }else{
                        //     if(result)
                        // }

                        
                        
                        

                        function convert1() {
                            if (result[row].START_DATE == null) {
                                result[row].START_DATE = null;
                            } else {
                                var c1 = moment(result[row].START_DATE).format('YYYY/MM/DD');
                                console.log(c1);
                                result[row].START_DATE = c1;
                            }
                        }

                        function convert2() {
                            if (result[row].DATE_OF_BIRTH == null) {
                                result[row].DATE_OF_BIRTH = null
                            } else {
                                var c2 = moment(result[row].DATE_OF_BIRTH).format('YYYY/MM/DD');
                                result[row].DATE_OF_BIRTH = c2;
                            }
                        }

                        function convert3() {
                            if (result[row].DATE_OF_DEATH == null) {
                                result[row].DATE_OF_DEATH = null
                            }
                            else {
                                var c3 = moment(result[row].DATE_OF_DEATH).format('YYYY/MM/DD');
                                result[row].DATE_OF_DEATH = c3;
                            }
                        }


                        function convert4() {
                            if (result[row].EFFECTIVE_START_DATE == null ) {
                                result[row].EFFECTIVE_START_DATE = null
                            } else {
                                var c4 = moment(result[row].EFFECTIVE_START_DATE).format('YYYY/MM/DD');
                                 result[row].EFFECTIVE_START_DATE = c4;
                               
                            }
                        }

                        function convert5(){
                            if(result[row].EFFECTIVEENDDATE == null ){
                                result[row].EFFECTIVEENDDATE = '4712/12/31';
                            }else{
                                var c5 = moment(result[row].EFFECTIVEENDDATE).format('YYYY/MM/DD');
                                result[row].EFFECTIVEENDDATE = c5;
                            }
                        }

                        function convert6() {
                            if (result[row].EFFECTIVE_END_DATE == null ) {
                                result[row].EFFECTIVE_END_DATE = '4712/12/31';
                            } else {
                               
                                var c6 = moment(result[row].EFFECTIVE_END_DATE).format('YYYY/MM/DD');
                                result[row].EFFECTIVE_END_DATE = c6;
                              

                            }
                        }

                        function convert7(){
                            if (result[row].DATE_FROM == null) {
                                result[row].DATE_FROM = null
                            } else {
                                var c7 = moment(result[row].DATE_FROM).format('YYYY/MM/DD');
                                result[row].DATE_FROM = c7;
                            }
                        }

                        function convert8(){
                            if (result[row].DATE_TO == null ) {
                                result[row].DATE_TO = null
                            } else {
                                var c8 = moment(result[row].DATE_TO).format('YYYY/MM/DD');
                                result[row].DATE_TO = c8;
                            }
                        }
                       
                        function convert9(){
                            if (result[row].EFFECTIVE_DATE == null) {
                                result[row].EFFECTIVE_DATE = null
                            } else {
                                var c9 = moment(result[row].EFFECTIVE_DATE).format('YYYY/MM/DD');
                                result[row].EFFECTIVE_DATE = c9;
                            }
                        }

                        function convert10(){
                            if(result[row].PROJECTED_TERMINATION_DATE == null){
                                result[row].PROJECTED_TERMINATION_DATE = null
                            }
                            else{
                                var c10 = moment(result[row].PROJECTED_TERMINATION_DATE).format('YYYY/MM/DD');
                                result[row].PROJECTED_TERMINATION_DATE = c10;
                            }
                        }

                        function convert11(){
                            if(result[row].ProjectedStartDate == null){
                                result[row].ProjectedStartDate = null
                            }
                            else{
                                var c11 = moment(result[row].ProjectedStartDate).format('YYYY/MM/DD');
                                result[row].ProjectedStartDate= c11;
                            }
                        }
                       


                        var rowData = Object.values(result[row])
                        convert1();
                        convert2();
                        convert3();
                        convert4();
                        convert5();
                        convert6();
                        convert7();
                        convert8();
                        convert9();
                        convert10();
                        convert11();

                        

                        
                      
                        var newmergeline = mergeline;
                        if (rowData.length == rule.DestinationColumns.length) {
                            for (var j = 0; j < rowData.length; j++) {
                                if(result[row][rule.SourceColumns[j].toUpperCase()] == null){
                                    newmergeline = newmergeline + "|"
                                }
                                else
                                {
                                newmergeline = newmergeline + "|" + result[row][rule.SourceColumns[j].toUpperCase()]
                                }

                            }
                        }
                        else {
                            //Error
                        }
                        mergelines.push(newmergeline)
                    }
               

                if(result.length == 0){
                    var HDLEntry = {
                        header: metadataline  
                    }
                } 
                else{
                    var HDLEntry = {
                        header: metadataline,
                        data : mergelines
                    }
                }   


               

                HDLEntries.push(HDLEntry)




            }
            return { data: HDLEntries, error: null };
            // return response.send({data:HDLEntries})
        }

        catch (err) {
            console.log(err);
            return { data: null, error: err }
        }
    }

    async download({ request, response, error }) {
        var convertStatus = await this.convert();

        if (convertStatus.data == null) {
            response.send(convertStatus.error)
            return
        }
        var HDLEntries = convertStatus.data

        var projectname = "Worker"
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
            return response.send({ loc: filepath, conversionInfo: DataTransferRulesForDefaultTransfers })
        }
        catch (error) {
            response.send(JSON.stringify(error))
        }
    }

}
module.exports = HdlController

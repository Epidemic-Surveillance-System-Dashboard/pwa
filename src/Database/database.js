import Dexie from 'dexie'

const db = new Dexie('ESSD_DB')

db.version(1).stores({
    //Locations
    Facility:"Id,parentId",
    Ward:"Id,parentId",
    LGA:"Id,parentId",
    State:"Id",

    //Data
    Groups:"Id",
    Sets:"Id,parentId",
    Metrics:"Id,parentId",
    Data:"Id,time,metricId,facilityId", //Index everything here
    FacilityView:"id,Name,WardId,LGAId,StateId",

    //Users
    Dashboard:"Id",
    User:"Id",   // only store non-essential information

    //Auth
    LocalUser: "Id"

})

export default db;
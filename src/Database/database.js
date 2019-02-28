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
    Data:"Id,Time,MetricId,FacilityId", //Index everything here
    FacilityView:"id,Name,WardId,LGAId,StateId",

    //Users (all of ESSD)
    User:"Id",   // only store non-essential information

    //User (local)
    LocalUser: "Id",
    Dashboard:"Id",

})

export default db;
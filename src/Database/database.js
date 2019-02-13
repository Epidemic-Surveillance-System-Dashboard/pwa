import Dexie from 'dexie'

const db = new Dexie('ESSD_DB')

db.version(1).stores({
    //Locations
    Facility:"Id",
    Ward:"Id",
    LGA:"Id",
    State:"Id",

    //Data
    Groups:"id",
    Sets:"Id",
    Metrics:"Id",
    Data:"Id,time,metricId,facilityId", //Index everything here
    FacilityView:"id,Name,WardId,LGAId,StateId",

    //Users
    Dashboard:"Id",
    User:"Id" // only store non-essential information

})

export default db;
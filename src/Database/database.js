import Dexie from 'dexie'

const db = new Dexie('ESSD_DB')

db.version(1).stores({
    //Locations
    Facility:"id",
    Ward:"id",
    LGA:"id",
    State:"id",

    //Data
    Groups:"id",
    Sets:"id",
    Metrics:"id",
    Data:"id,time,metricId,facilityId", //Index everything here
    FacilityView:"id,Name,WardId,LGAId,StateId",

    //Users
    Dashboard:"id",
    User:"id" // only store non-essential information

})

export default db;
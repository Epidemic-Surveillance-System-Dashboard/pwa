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
    Data:"Id,Time,MetricId,FacilityId,[FacilityId+MetricId+Time]", //Index everything here

    //Users (all of ESSD)
    User:"Id",   // only store non-essential information

    //User (local)
    LocalUser: "Id",
    Dashboard:"Id",
    DashboardData: "Id"

})

export default db;
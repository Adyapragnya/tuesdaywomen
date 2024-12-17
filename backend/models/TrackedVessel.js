import mongoose from 'mongoose';


const trackedVesselSchema = new mongoose.Schema({
    IMO: { type: Number, required: true},
    AIS: {
        MMSI: Number,
        TIMESTAMP: String,
        LATITUDE: Number,
        LONGITUDE: Number,
        COURSE: Number,
        SPEED: Number,
        HEADING: Number,
        NAVSTAT: Number,
        IMO: Number,
        NAME: String,
        CALLSIGN: String,
        TYPE: Number,
        A: Number,
        B: Number,
        C: Number,
        D: Number,
        DRAUGHT: Number,
        DESTINATION: String,
        LOCODE: String,
        ETA_AIS: String,
        ETA: String,
        SRC: String,
        ZONE: String,
        ECA: Boolean,
        DISTANCE_REMAINING: Number,
        ETA_PREDICTED: String,
    },
    SpireTransportType: String,
    FLAG: String,
    GeofenceStatus: String,
    geofenceType: String,
    GeofenceInsideTime: Date,
    GrossTonnage: Number,
    deadWeight: Number,
    geofenceFlag: String, // New field to track if vessel entered a geofence
    trackingFlag: {
        type: Boolean,
        default: true // Default value is set to true
    },
    lastFetchTime: Date,
    AisPullGfType: String,

    regionName: String,
    regionStatus: String,
    regionEntryTime: Date,
    regionExitTime :Date

}, { timestamps: true });

const TrackedVessel = mongoose.model('vesselstrackeds', trackedVesselSchema, 'vesselstrackeds');


// Export the model
export default  TrackedVessel ;



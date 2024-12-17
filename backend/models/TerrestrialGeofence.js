import mongoose from 'mongoose';

const TerrestrialGeofenceSchema = new mongoose.Schema({
    geofenceId: String,
    geofenceName: String,
    geofenceType: String,
    location: String,
    date: String,
    remarks: String,
   
    coordinates: Array,
    
  });

const TerrestrialGeofence = mongoose.model('TerrestrialGeofence', TerrestrialGeofenceSchema, 'TerrestrialGeofence');

export default  TerrestrialGeofence ;





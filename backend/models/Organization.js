// models/Organization.js
import mongoose from 'mongoose';


const organizationSchema = new mongoose.Schema({
  orgId: { type: String, required: true },
  companyTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  contactEmail: { type: String, required: true },
  assignShips: { type: Number, required: true }, 
  adminFirstName: { type: String, required: true },
  adminLastName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminContactNumber: { type: String, required: true },
  files: { type: [String], default: [] },
});

export default  mongoose.model('Organization', organizationSchema);




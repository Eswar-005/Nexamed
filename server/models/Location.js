import mongoose from 'mongoose';

const medicalStoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  phone: String,
  latitude: Number,
  longitude: Number,
  open_time: String,
  close_time: String,
  is_open_24h: { type: Number, default: 0 },
  google_place_id: String
});

medicalStoreSchema.index({ city: 1, state: 1 });
medicalStoreSchema.index({ latitude: 1, longitude: 1 });

const storeInventorySchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalStore', required: true },
  medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  in_stock: { type: Number, default: 1 },
  quantity: { type: Number, default: 50 },
  price_at_store: Number
});

storeInventorySchema.index({ store_id: 1, medicine_id: 1 }, { unique: true });

const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  email: String,
  latitude: Number,
  longitude: Number,
  license_number: String,
  government_run: { type: Number, default: 1 }
});

bloodBankSchema.index({ city: 1, state: 1 });
bloodBankSchema.index({ latitude: 1, longitude: 1 });

const bloodStockSchema = new mongoose.Schema({
  blood_bank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank', required: true },
  blood_group: { type: String, required: true },
  units_available: { type: Number, default: 0 },
  last_updated: { type: Date, default: Date.now }
});

bloodStockSchema.index({ blood_bank_id: 1, blood_group: 1 }, { unique: true });

const organBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  phone: String,
  notto_registered: { type: Number, default: 1 },
  notto_id: String,
  latitude: Number,
  longitude: Number,
  website: String
});

organBankSchema.index({ type: 1 });
organBankSchema.index({ city: 1, state: 1 });

const sosEventSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  triggered_at: { type: Date, default: Date.now },
  latitude: Number,
  longitude: Number,
  sms_sent: { type: Number, default: 1 },
  contacts_notified: String,
  nearest_hospital_called: { type: Number, default: 1 },
  resolved_at: Date
});

const healthTipSchema = new mongoose.Schema({
  tip_text: { type: String, required: true },
  category: String,
  is_active: { type: Number, default: 1 }
});

export const MedicalStore = mongoose.model('MedicalStore', medicalStoreSchema);
export const StoreInventory = mongoose.model('StoreInventory', storeInventorySchema);
export const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
export const BloodStock = mongoose.model('BloodStock', bloodStockSchema);
export const OrganBank = mongoose.model('OrganBank', organBankSchema);
export const SOSEvent = mongoose.model('SOSEvent', sosEventSchema);
export const HealthTip = mongoose.model('HealthTip', healthTipSchema);
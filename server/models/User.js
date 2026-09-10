import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  date_of_birth: String,
  gender: String,
  blood_group: { type: String, default: 'O+' },
  weight_kg: Number,
  height_cm: Number
});

const userAllergySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  allergen: { type: String, required: true },
  severity: { type: String, default: 'moderate' },
  reaction: String
});

const medicalHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  condition_name: { type: String, required: true },
  diagnosed_year: Number,
  is_current: { type: Number, default: 1 },
  notes: String
});

const emergencyContactSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: String,
  priority: { type: Number, default: 1 }
});

const medicalReportSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  lab_name: String,
  doctor_name: String,
  report_date: String,
  status: { type: String, default: 'Normal' },
  summary: String,
  test_results: String
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password_hash: { type: String, required: true },
  role: { type: String, default: 'patient' },
  is_verified: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export const UserAllergy = mongoose.model('UserAllergy', userAllergySchema);
export const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);
export const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
export const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
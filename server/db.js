import mongoose from 'mongoose';
import { User, UserProfile, UserAllergy, MedicalHistory, EmergencyContact, MedicalReport } from './models/User.js';
import { Medicine, Composition, SideEffect, Substitute } from './models/Medicine.js';
import { Disease, Symptom, DiseaseSymptom, DiseaseDiet, DiseasePrecaution, DiseaseMedicine } from './models/Disease.js';
import { MedicalStore, StoreInventory, BloodBank, BloodStock, OrganBank, SOSEvent, HealthTip } from './models/Location.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexamed';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return true;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexamed';

  try {
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('MongoDB disconnected');
};

export const models = {
  User,
  UserProfile,
  UserAllergy,
  MedicalHistory,
  EmergencyContact,
  MedicalReport,
  Medicine,
  Composition,
  SideEffect,
  Substitute,
  Disease,
  Symptom,
  DiseaseSymptom,
  DiseaseDiet,
  DiseasePrecaution,
  DiseaseMedicine,
  MedicalStore,
  StoreInventory,
  BloodBank,
  BloodStock,
  OrganBank,
  SOSEvent,
  HealthTip,
};

export default mongoose;
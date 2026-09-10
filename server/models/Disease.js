import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icd_code: String,
  overview: String,
  definition: String,
  causes: String,
  diagnosis: String,
  treatment: String,
  emergency_signs: String,
  category: String
});

diseaseSchema.index({ name: 1 });
diseaseSchema.index({ category: 1 });

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  body_region: { type: String, required: true },
  description: String
});

symptomSchema.index({ name: 1 });
symptomSchema.index({ body_region: 1 });

const diseaseSymptomSchema = new mongoose.Schema({
  disease_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true },
  symptom_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Symptom', required: true }
});

diseaseSymptomSchema.index({ disease_id: 1, symptom_id: 1 }, { unique: true });

const diseaseDietSchema = new mongoose.Schema({
  disease_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true },
  diet_item: { type: String, required: true },
  type: { type: String, required: true, enum: ['recommended', 'avoid'] }
});

const diseasePrecautionSchema = new mongoose.Schema({
  disease_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true },
  precaution: { type: String, required: true },
  priority: { type: Number, default: 1 }
});

const diseaseMedicineSchema = new mongoose.Schema({
  disease_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true },
  medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  usage_note: String
});

export const Disease = mongoose.model('Disease', diseaseSchema);
export const Symptom = mongoose.model('Symptom', symptomSchema);
export const DiseaseSymptom = mongoose.model('DiseaseSymptom', diseaseSymptomSchema);
export const DiseaseDiet = mongoose.model('DiseaseDiet', diseaseDietSchema);
export const DiseasePrecaution = mongoose.model('DiseasePrecaution', diseasePrecautionSchema);
export const DiseaseMedicine = mongoose.model('DiseaseMedicine', diseaseMedicineSchema);
import mongoose from 'mongoose';

const compositionSchema = new mongoose.Schema({
  medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  chemical_name: { type: String, required: true },
  strength: String
});

const sideEffectSchema = new mongoose.Schema({
  medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  effect: { type: String, required: true },
  severity: { type: String, default: 'mild' }
});

const substituteSchema = new mongoose.Schema({
  medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  substitute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  saving_amount: { type: Number, default: 0 },
  saving_percentage: { type: Number, default: 0 }
});

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  generic_name: String,
  manufacturer: String,
  mrp: Number,
  pack_size: String,
  category: String,
  prescription_required: { type: Number, default: 0 },
  is_discontinued: { type: Number, default: 0 },
  description: String,
  image_url: String
});

medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ generic_name: 1 });

export const Medicine = mongoose.model('Medicine', medicineSchema);
export const Composition = mongoose.model('Composition', compositionSchema);
export const SideEffect = mongoose.model('SideEffect', sideEffectSchema);
export const Substitute = mongoose.model('Substitute', substituteSchema);
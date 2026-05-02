import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: 'parent' },
  children: [{ type: String }], // Array of idActe
  lastLogin: { type: Date },
}, { timestamps: true });

// Hash password before saving
parentSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
parentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Parent', parentSchema);

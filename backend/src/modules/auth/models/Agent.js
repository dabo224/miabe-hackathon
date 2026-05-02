import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true // Allows nulls while enforcing uniqueness for non-nulls
  },
  phone: {
    type: String
  },
  prefecture: {
    type: String,
    required: true
  },
  establishment: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['agent', 'admin'],
    default: 'agent'
  }
}, {
  timestamps: true
});

// Hash password before saving
AgentSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
AgentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Agent', AgentSchema);

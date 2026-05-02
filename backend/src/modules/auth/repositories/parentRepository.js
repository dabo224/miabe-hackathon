import Parent from '../models/Parent.js';

class ParentRepository {
  async findByPhone(phone) {
    return Parent.findOne({ phone });
  }

  async findById(id) {
    return Parent.findById(id).select('-password');
  }

  async create(data) {
    return Parent.create(data);
  }

  async update(id, data) {
    return Parent.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }
}

export default new ParentRepository();

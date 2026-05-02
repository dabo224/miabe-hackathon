import Naissance from '../models/Naissance.js';

class NaissanceRepository {
  async create(data) {
    const naissance = new Naissance(data);
    return await naissance.save();
  }

  async findByIdActe(idActe) {
    return await Naissance.findOne({ idActe });
  }

  async update(idActe, updateData) {
    return await Naissance.findOneAndUpdate({ idActe }, updateData, { returnDocument: 'after' });
  }

  async findAll() {
    return await Naissance.find().sort({ createdAt: -1 });
  }

  async findByAgentId(agentId, limit = 5) {
    return await Naissance.find({ agentId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async countTodayByAgent(agentId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await Naissance.countDocuments({
      agentId,
      createdAt: { $gte: startOfDay }
    });
  }

  async countPendingByAgent(agentId) {
    return await Naissance.countDocuments({
      agentId,
      blockchainValidated: false
    });
  }

  async countAllByAgent(agentId) {
    return await Naissance.countDocuments({ agentId });
  }

  async findByStatus(status) {
    return await Naissance.find({ status }).sort({ createdAt: -1 });
  }

  async findByAgentIdAndStatus(agentId, status) {
    return await Naissance.find({ agentId, status }).sort({ createdAt: -1 });
  }

  async findPending() {
    return await Naissance.find({ status: 'PENDING' }).sort({ createdAt: -1 });
  }
}

export default new NaissanceRepository();

import Agent from '../models/Agent.js';

class AgentRepository {
  async create(data) {
    const agent = new Agent(data);
    return await agent.save();
  }

  async findByIdentifier(identifier) {
    return await Agent.findOne({ identifier });
  }

  async findById(id) {
    return await Agent.findById(id);
  }

  async update(id, data) {
    return await Agent.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new AgentRepository();

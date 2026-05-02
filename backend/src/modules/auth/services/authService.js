import agentRepository from '../repositories/agentRepository.js';
import parentRepository from '../repositories/parentRepository.js';
import jwt from 'jsonwebtoken';

class AuthService {
  async registerAgent(data) {
    // Automaticaly generate unique Identifier (Format: AG-2026-XXXX)
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const identifier = `AG-${year}-${random}`;

    // Ensure it's unique (recursive check would be better but this is sufficient for a hackathon)
    const existingAgent = await agentRepository.findByIdentifier(identifier);
    if (existingAgent) {
      return this.registerAgent(data); // Retry once
    }

    const agent = await agentRepository.create({
      ...data,
      identifier
    });
    
    // Omit password from response
    const agentData = agent.toObject();
    delete agentData.password;
    
    return agentData;
  }

  async loginAgent(identifier, password) {
    const agent = await agentRepository.findByIdentifier(identifier);
    if (!agent) {
      throw new Error('Identifiant ou mot de passe incorrect');
    }

    const isMatch = await agent.comparePassword(password);
    if (!isMatch) {
      throw new Error('Identifiant ou mot de passe incorrect');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: agent._id, identifier: agent.identifier, role: agent.role },
      process.env.JWT_SECRET || 'secret_key_hackathon',
      { expiresIn: '30d' }
    );

    const agentData = agent.toObject();
    delete agentData.password;

    return { agent: agentData, token };
  }

  async updateProfile(id, data) {
    const { name, email, phone } = data;
    const updatedAgent = await agentRepository.update(id, { name, email, phone });
    
    if (!updatedAgent) throw new Error('Agent non trouvé');

    const agentData = updatedAgent.toObject();
    delete agentData.password;
    return agentData;
  }

  async changePassword(id, currentPassword, newPassword) {
    const agent = await agentRepository.findById(id);
    if (!agent) throw new Error('Agent non trouvé');

    const isMatch = await agent.comparePassword(currentPassword);
    if (!isMatch) throw new Error('Mot de passe actuel incorrect');

    agent.password = newPassword; // Pre-save hook will hash it
    await agent.save();
    
    return { success: true };
  }

  async registerParent(data) {
    const existingParent = await parentRepository.findByPhone(data.phone);
    if (existingParent) {
      throw new Error('Un parent avec ce numéro de téléphone existe déjà');
    }

    const parent = await parentRepository.create(data);
    
    const parentData = parent.toObject();
    delete parentData.password;
    
    return parentData;
  }

  async loginParent(phone, password) {
    const parent = await parentRepository.findByPhone(phone);
    if (!parent) {
      throw new Error('Numéro de téléphone ou mot de passe incorrect');
    }

    const isMatch = await parent.comparePassword(password);
    if (!isMatch) {
      throw new Error('Numéro de téléphone ou mot de passe incorrect');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: parent._id, phone: parent.phone, role: parent.role },
      process.env.JWT_SECRET || 'secret_key_hackathon',
      { expiresIn: '30d' }
    );

    const parentData = parent.toObject();
    delete parentData.password;

    return { parent: parentData, token };
  }
}

export default new AuthService();

import authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const agent = await authService.registerAgent(req.body);
    res.status(201).json({
      success: true,
      message: 'Agent enregistré avec succès',
      data: agent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.loginAgent(identifier, password);
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      ...result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    const agent = await authService.updateProfile(id, { name, email, phone });
    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    await authService.changePassword(id, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const registerParent = async (req, res) => {
  try {
    const parent = await authService.registerParent(req.body);
    res.status(201).json({
      success: true,
      message: 'Compte parent créé avec succès',
      data: parent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const loginParent = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const result = await authService.loginParent(phone, password);
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      ...result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

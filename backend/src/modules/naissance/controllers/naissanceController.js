import naissanceService from '../services/naissanceService.js';
import naissanceRepository from '../repositories/naissanceRepository.js';

export const createNaissance = async (req, res) => {
  try {
    const naissance = await naissanceService.registerBirth(req.body);
    res.status(201).json({
      success: true,
      data: naissance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getNaissance = async (req, res) => {
  try {
    const naissance = await naissanceService.getBirthRecord(req.params.id);
    res.status(200).json({
      success: true,
      data: naissance
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyNaissance = async (req, res) => {
  try {
    const result = await naissanceService.verifyIntegrity(req.params.id);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAgentStats = async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const [totalCount, pendingCount, recentRecords] = await Promise.all([
        naissanceRepository.countAllByAgent(agentId),
        naissanceRepository.countPendingByAgent(agentId),
        naissanceRepository.findByAgentId(agentId, 5)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCount,
        pendingCount,
        recentRecords
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const syncBlockchain = async (req, res) => {
  try {
    const stats = await naissanceService.restoreAllFromBlockchain();
    res.status(200).json({
      success: true,
      message: "Synchronisation terminée",
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDeclarations = async (req, res) => {
    try {
        const { status, agentId } = req.query;
        let declarations;

        if (agentId && status) {
            declarations = await naissanceRepository.findByAgentIdAndStatus(agentId, status);
        } else if (status) {
            declarations = await naissanceRepository.findByStatus(status);
        } else if (agentId) {
            declarations = await naissanceRepository.findByAgentId(agentId, 100);
        } else {
            declarations = await naissanceRepository.findPending();
        }

        res.status(200).json({
            success: true,
            data: declarations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const approveDeclaration = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await naissanceService.approveBirth(id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const rejectDeclaration = async (req, res) => {
    try {
        const { id } = req.params;
        const { motif } = req.body;
        const result = await naissanceService.rejectBirth(id, motif);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

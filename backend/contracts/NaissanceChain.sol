// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NaissanceChain {

    // Structure d'un acte de naissance
    struct Naissance {
        string idActe;           // Ex: GN-2026-00412-KN
        string hashDonnees;      // Empreinte SHA256 des données complètes
        string encryptedData;    // Données complètes chiffrées (Backup)
        string prefecture;       // Préfecture d'enregistrement
        string agentId;          // Identifiant de l'agent
        uint256 dateEnregistrement; // Timestamp Unix
        bool existe;             // Pour vérifier si l'acte existe
    }

    // Mapping : idActe => Naissance
    mapping(string => Naissance) private naissances;

    // Liste de tous les IDs enregistrés
    string[] public tousLesActes;

    // Adresses autorisées à enregistrer (agents officiels)
    mapping(address => bool) public agentsAutorises;

    // Propriétaire du contrat (Ministère)
    address public proprietaire;

    // Événement émis à chaque naissance enregistrée
    event NaissanceEnregistree(
        string idActe,
        string prefecture,
        uint256 date
    );

    // Modificateur : seulement les agents autorisés
    modifier seulementAgent() {
        require(agentsAutorises[msg.sender], "Non autorise");
        _;
    }

    // Modificateur : seulement le propriétaire
    modifier seulementProprietaire() {
        require(msg.sender == proprietaire, "Non autorise");
        _;
    }

    constructor() {
        proprietaire = msg.sender;
        agentsAutorises[msg.sender] = true;
    }

    // Ajouter un agent autorisé (fait par le Ministère)
    function ajouterAgent(address agent) public seulementProprietaire {
        agentsAutorises[agent] = true;
    }

    // Enregistrer une naissance
    function enregistrerNaissance(
        string memory _idActe,
        string memory _hashDonnees,
        string memory _encryptedData,
        string memory _prefecture,
        string memory _agentId
    ) public seulementAgent {

        // Vérifier que l'acte n'existe pas déjà
        require(!naissances[_idActe].existe, "Acte deja enregistre");

        // Créer l'acte
        naissances[_idActe] = Naissance({
            idActe: _idActe,
            hashDonnees: _hashDonnees,
            encryptedData: _encryptedData,
            prefecture: _prefecture,
            agentId: _agentId,
            dateEnregistrement: block.timestamp,
            existe: true
        });

        tousLesActes.push(_idActe);

        // Émettre l'événement
        emit NaissanceEnregistree(_idActe, _prefecture, block.timestamp);
    }

    // Vérifier un acte de naissance
    function verifierNaissance(string memory _idActe)
        public view returns (
            bool valide,
            string memory hashDonnees,
            string memory encryptedData,
            string memory prefecture,
            uint256 dateEnregistrement
        )
    {
        Naissance memory n = naissances[_idActe];

        if (!n.existe) {
            return (false, "", "", "", 0);
        }

        return (true, n.hashDonnees, n.encryptedData, n.prefecture, n.dateEnregistrement);
    }

    // Obtenir le nombre total d'actes enregistrés
    function totalActes() public view returns (uint256) {
        return tousLesActes.length;
    }
}

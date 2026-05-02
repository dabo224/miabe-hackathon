import Config from '../constants/Config';

export interface BirthDeclaration {
    idActe: string;
    prenom: string;
    nom: string;
    sexe: 'M' | 'F';
    dateNaissance: string;
    heureNaissance: string;
    lieuNaissance: {
        region: string;
        prefecture: string;
        sousPrefecture: string;
    };
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    rejectionMotif?: string;
}

export const DeclarationService = {
    async getMyDeclarations(parentId: string): Promise<BirthDeclaration[]> {
        try {
            const agentId = `PARENT-${parentId}`;
            const response = await fetch(`${Config.API_BASE_URL}/naissances?agentId=${agentId}`, {
                headers: {
                    'Bypass-Tunnel-Reminder': 'true'
                }
            });
            const result = await response.json();
            if (result.success) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch declarations', error);
            return [];
        }
    }
};

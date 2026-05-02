import AsyncStorage from '@react-native-async-storage/async-storage';

const FAMILY_MEMBERS_KEY = '@family_members';

export interface FamilyMember {
  idActe: string;
  relation: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  addedAt: string;
}

export const FamilyService = {
  async getMembers(): Promise<FamilyMember[]> {
    try {
      const data = await AsyncStorage.getItem(FAMILY_MEMBERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get family members', e);
      return [];
    }
  },

  async addMember(member: FamilyMember): Promise<void> {
    try {
      const members = await this.getMembers();
      // Avoid duplicates
      const exists = members.find(m => m.idActe === member.idActe);
      if (exists) {
        // Update relation if already exists
        const updated = members.map(m => m.idActe === member.idActe ? member : m);
        await AsyncStorage.setItem(FAMILY_MEMBERS_KEY, JSON.stringify(updated));
      } else {
        await AsyncStorage.setItem(FAMILY_MEMBERS_KEY, JSON.stringify([...members, member]));
      }
    } catch (e) {
      console.error('Failed to add family member', e);
    }
  },

  async removeMember(idActe: string): Promise<void> {
    try {
      const members = await this.getMembers();
      const filtered = members.filter(m => m.idActe !== idActe);
      await AsyncStorage.setItem(FAMILY_MEMBERS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to remove family member', e);
    }
  },

  async getMemberRelation(idActe: string): Promise<string | null> {
    const members = await this.getMembers();
    const member = members.find(m => m.idActe === idActe);
    return member ? member.relation : null;
  }
};

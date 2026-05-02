import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RelationSelectorProps {
  visible: boolean;
  onSelect: (relation: string) => void;
  onClose: () => void;
}

const RELATIONS = [
  { id: 'enfant', label: 'Mon Enfant', icon: 'baby-face-outline' },
  { id: 'moi', label: 'Moi-même', icon: 'account-outline' },
  { id: 'conjoint', label: 'Conjoint(e)', icon: 'account-heart-outline' },
  { id: 'autre', label: 'Autre membre', icon: 'account-group-outline' },
];

export const RelationSelector: React.FC<RelationSelectorProps> = ({ visible, onSelect, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.container}>
          <View style={s.header}>
            <Text style={s.title}>C'est pour qui ?</Text>
            <Text style={s.subtitle}>Précisez le lien de parenté pour organiser votre espace famille.</Text>
          </View>

          <View style={s.grid}>
            {RELATIONS.map((rel) => (
              <TouchableOpacity
                key={rel.id}
                style={s.item}
                onPress={() => onSelect(rel.id)}
                activeOpacity={0.7}
              >
                <View style={s.iconContainer}>
                  <MaterialCommunityIcons name={rel.icon as any} size={32} color="#006a40" />
                </View>
                <Text style={s.itemLabel}>{rel.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={s.closeButton} onPress={onClose}>
            <Text style={s.closeButtonText}>Plus tard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 32,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#191c1d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6d7a70',
    textAlign: 'center',
    opacity: 0.7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  item: {
    width: '46%',
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EAF3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#191c1d',
  },
  closeButton: {
    marginTop: 24,
    padding: 12,
  },
  closeButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#9eaaa1',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { ALL_REGIONS } from '../../constants/Locations';

interface RegionPickerProps {
  value: string;
  onSelect: (region: string) => void;
  label?: string;
}

export function RegionPicker({ value, onSelect, label = "Séléctionner une région" }: RegionPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (region: string) => {
    onSelect(region);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={styles.trigger}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || label}
        </Text>
        <ChevronDown size={18} color="#9eaaa1" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Régions de Guinée</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X size={20} color="#191c1d" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={ALL_REGIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.regionItem, value === item && styles.selectedItem]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.regionText, value === item && styles.selectedText]}>
                    {item}
                  </Text>
                  {value === item && <View style={styles.selectedDot} />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  trigger: {
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#191c1d',
  },
  placeholderText: {
    color: '#bccabe',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#191c1d',
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 40,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  selectedItem: {
    backgroundColor: '#EAF3EE',
  },
  regionText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#191c1d',
  },
  selectedText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#006a40',
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 0,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#006a40',
  }
});

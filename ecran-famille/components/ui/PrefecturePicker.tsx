import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getPrefecturesByRegion } from '../../constants/Locations';

interface PrefecturePickerProps {
  value: string;
  onSelect: (prefecture: string) => void;
  region: string;
  label?: string;
}

export function PrefecturePicker({ value, onSelect, region, label = "Sélectionner une préfecture" }: PrefecturePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [prefectures, setPrefectures] = useState<string[]>([]);

  useEffect(() => {
    if (region) {
      setPrefectures(getPrefecturesByRegion(region));
    } else {
      setPrefectures([]);
    }
  }, [region]);

  const handleSelect = (prefecture: string) => {
    onSelect(prefecture);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
            if (!region) return;
            setModalVisible(true);
        }}
        style={[styles.trigger, !region && styles.disabledTrigger]}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || label}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#9eaaa1" />
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
              <Text style={styles.modalTitle}>Préfectures de {region}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={22} color="#191c1d" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={prefectures}
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
  disabledTrigger: {
      backgroundColor: '#f8f8f8',
      opacity: 0.6,
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

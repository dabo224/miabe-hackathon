import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const TopAppBar: React.FC = () => {
  return (
    <SafeAreaView className="bg-white border-b border-outline-variant">
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons name="waves" size={28} color="#006a40" />
          <Text className="font-jakarta-extrabold text-xl tracking-[0.1em] text-primary uppercase">
            NaissanceChain
          </Text>
        </View>
        
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
          <MaterialCommunityIcons name="translate" size={20} color="#3d4a41" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

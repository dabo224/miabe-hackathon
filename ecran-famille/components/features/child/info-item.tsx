import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InfoItemProps {
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  className?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon, className = '' }) => {
  return (
    <View className={`flex-row items-center gap-5 ${className}`}>
      <View className="p-4 bg-primary/5 rounded-2xl shadow-soft">
        <MaterialCommunityIcons name={icon} size={26} color="#006a40" />
      </View>
      <View className="flex-1">
        <Text className="text-on-surface-variant text-[10px] font-vietnam-bold uppercase tracking-[0.15em] mb-1">
          {label}
        </Text>
        <Text className="text-on-surface font-vietnam-bold text-lg leading-tight">
          {value}
        </Text>
      </View>
    </View>
  );
};

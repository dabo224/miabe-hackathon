import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TonalCard } from '@/components/ui/tonal-card';

interface ActionCardProps {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  bgIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  accentColor: string;
  buttonLabel: string;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  bgIcon,
  onPress,
  accentColor,
  buttonLabel,
  className = ''
}) => {
  return (
    <TonalCard className={`items-center text-center overflow-hidden h-72 justify-center ${className}`}>
      <View className="absolute -top-10 -right-10 p-4 opacity-[0.05]">
        <MaterialCommunityIcons name={bgIcon} size={200} color={accentColor} />
      </View>
      
      <View 
        className="w-20 h-20 rounded-3xl items-center justify-center mb-6 shadow-soft border border-black/5"
        style={{ backgroundColor: `${accentColor}08` }}
      >
        <MaterialCommunityIcons name={icon} size={38} color={accentColor} />
      </View>
      
      <Text className="text-xl font-jakarta-bold text-on-surface mb-3 text-center px-4 tracking-tight">
        {title}
      </Text>
      
      <Text className="text-sm font-jakarta text-on-surface-variant text-center px-8 leading-relaxed opacity-70">
        {description}
      </Text>
      
      <TouchableOpacity 
        className="mt-8 flex-row items-center gap-2 py-3 px-6 bg-surface-container-low rounded-2xl border border-black/5"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className="font-jakarta-bold text-xs uppercase tracking-widest" style={{ color: accentColor }}>
            {buttonLabel}
        </Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color={accentColor} />
      </TouchableOpacity>
    </TonalCard>
  );
};

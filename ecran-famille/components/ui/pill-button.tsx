import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tonal';
  icon?: React.ReactNode;
  className?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon,
  className = '' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary-container';
      case 'tonal':
        return 'bg-surface-container-low';
      default:
        return 'bg-primary';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-on-secondary-container';
      case 'tonal':
        return 'text-on-surface';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`rounded-full py-4 px-8 flex-row items-center justify-center gap-3 shadow-lg shadow-black/5 ${getVariantStyles()} ${className}`}
    >
      {icon}
      <Text className={`font-jakarta-bold text-base tracking-wide ${getTextStyle()}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

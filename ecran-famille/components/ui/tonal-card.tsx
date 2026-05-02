import React from 'react';
import { View, ViewProps } from 'react-native';

interface TonalCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const TonalCard: React.FC<TonalCardProps> = ({ children, className = '', ...props }) => {
  return (
    <View
      className={`bg-white p-6 rounded-3xl border border-black/5 shadow-soft ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

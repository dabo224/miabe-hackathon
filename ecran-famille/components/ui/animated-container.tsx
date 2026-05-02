import React from 'react';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(600).springify()}
      layout={Layout.springify()}
      className={className}
    >
      {children}
    </Animated.View>
  );
};

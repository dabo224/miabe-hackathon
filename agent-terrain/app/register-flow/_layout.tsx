import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step2" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="success" />
    </Stack>
  );
}

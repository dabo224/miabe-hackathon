import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Retour à l'accueil</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#FAFAFA' },
  title: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: '#191c1d', marginBottom: 16 },
  link: { paddingVertical: 12 },
  linkText: { fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#006a40' },
});

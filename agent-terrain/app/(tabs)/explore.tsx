import { Redirect } from 'expo-router';

// Ce fichier redirige l'ancien onglet Explore vers Profil
export default function ExploreRedirect() {
  return <Redirect href="/(tabs)/profile" />;
}

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Landmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Config from '../constants/Config';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !establishment || !prefecture || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const url = `${Config.API_BASE_URL}/auth/register`;
      console.log('--- DEBUT APPEL API ---');
      console.log('URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({
          name,
          establishment,
          prefecture,
          password
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // DEBUG: Log the raw response
      console.log('Status Code:', response.status);
      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      if (!responseText) {
        throw new Error("Le serveur a renvoyé une réponse vide");
      }

      const result = JSON.parse(responseText);

      if (result.success) {
        await login(result.data);
        Alert.alert(
          'Compte Créé ! ✅', 
          `Bienvenue M. ${name}. Votre matricule officiel est : ${result.data.identifier}.\n\nUtilisez-le pour vous connecter.`, 
          [{ text: 'Se connecter', onPress: () => router.replace('/login') }]
        );
      } else {
        Alert.alert('Erreur', result.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.log('--- ERREUR RESEAU ---');
      console.log('Message:', error.message);
      Alert.alert('Erreur', `Impossible de contacter le serveur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 28, paddingVertical: 48 }}>

            {/* Header */}
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 32 }}>
               <Text style={{ color: '#006a40', fontFamily: 'PlusJakartaSans_700Bold' }}>← Retour</Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 28, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#191c1d', marginBottom: 8 }}>
                Nouvel Agent
              </Text>
              <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#6d7a70' }}>
                Rejoignez le réseau national. Votre identifiant sera généré après l'inscription.
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: 20, marginBottom: 40 }}>
              
              <View>
                <Text style={labelStyle}>Nom Complet</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex. Mamadou Diallo"
                  placeholderTextColor="#bccabe"
                  style={inputStyle}
                />
              </View>

              <View>
                <Text style={labelStyle}>Votre Établissement</Text>
                <TextInput
                  value={establishment}
                  onChangeText={setEstablishment}
                  placeholder="Ex. Hôpital de Kindia"
                  placeholderTextColor="#bccabe"
                  style={inputStyle}
                />
              </View>

              <View>
                <Text style={labelStyle}>Préfecture d'affectation</Text>
                <TextInput
                  value={prefecture}
                  onChangeText={setPrefecture}
                  placeholder="Ex. Kindia"
                  placeholderTextColor="#bccabe"
                  style={inputStyle}
                />
              </View>

              <View>
                <Text style={labelStyle}>Mot de passe</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#bccabe"
                  secureTextEntry
                  style={inputStyle}
                />
              </View>

            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
              style={{
                height: 56, backgroundColor: '#006a40', borderRadius: 16,
                alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1,
                marginBottom: 24,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>
                {loading ? 'Inscription...' : 'Finaliser mon inscription'}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={{ alignItems: 'center', gap: 12 }}>
                <Landmark size={20} color="#bccabe" strokeWidth={1.5} />
                <Text style={{ textAlign: 'center', fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: '#bccabe', letterSpacing: 1, textTransform: 'uppercase' }}>
                Ministère de la Santé — République de Guinée
                </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const labelStyle = { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#6d7a70', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 };

const inputStyle = {
  height: 52, backgroundColor: '#fff', borderWidth: 1,
  borderColor: '#e4e8e5', borderRadius: 12, paddingHorizontal: 16,
  fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#191c1d',
};

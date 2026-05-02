import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, ArrowRight, Landmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Config from '../constants/Config';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        return;
    };
    
    setLoading(true);
    try {
      const url = `${Config.API_BASE_URL}/auth/login`;
      console.log('--- DEBUT APPEL API (LOGIN) ---');
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
        body: JSON.stringify({ identifier, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const result = await response.json();
      
      if (result.success) {
        await login(result.agent);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur', result.message || 'Identifiant ou mot de passe incorrect');
      }
    } catch (error) {
       console.log('--- ERREUR RESEAU (LOGIN) ---');
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
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 48 }}>

            {/* Logo */}
            <View style={{ alignItems: 'center', marginBottom: 56 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: '#006a40', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Landmark size={28} color="white" strokeWidth={1.5} />
              </View>
              <Text style={{ fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', letterSpacing: 3, color: '#191c1d', textTransform: 'uppercase' }}>
                NaissanceChain
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#6d7a70', marginTop: 4, letterSpacing: 1 }}>
                Système National de Vitalité
              </Text>
            </View>

            {/* Form */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold', color: '#191c1d', marginBottom: 28 }}>
                Connexion
              </Text>

              {/* Identifiant */}
              <View style={{ marginBottom: 16 }}>
                <Text style={labelStyle}>Identifiant agent</Text>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="Ex. AG-2026-XXXX"
                  placeholderTextColor="#bccabe"
                  style={inputStyle}
                />
              </View>

              {/* Mot de passe */}
              <View style={{ marginBottom: 32 }}>
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

              {/* Bouton */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
                style={{
                  height: 52, backgroundColor: '#006a40', borderRadius: 12,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Text style={{ color: 'white', fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold' }}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Text>
                {!loading && <ArrowRight size={18} color="white" strokeWidth={2} />}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/signup')}
                style={{ alignSelf: 'center', marginTop: 24 }}
              >
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#006a40' }}>
                  Pas encore de compte ? <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>S'inscrire</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={{ textAlign: 'center', fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: '#bccabe', letterSpacing: 1, textTransform: 'uppercase' }}>
              Ministère de la Santé — République de Guinée
            </Text>

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

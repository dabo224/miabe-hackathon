import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Config from '../../constants/Config';
import { useAuth } from '../../context/AuthContext';
import { AnimatedContainer } from '@/components/ui/animated-container';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (Nom, Téléphone, Mot de passe)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${Config.API_BASE_URL}/auth/parent/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const result = await response.json();

      if (result.success) {
        const parentData = result.data || result.parent || { name, phone, email, _id: 'new-id' };
        await login(parentData);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur', result.message || 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (error: any) {
      Alert.alert('Erreur réseau', 'Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-4 ml-2"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#191c1d" />
          </TouchableOpacity>

          <View className="px-8 pb-12">
            <AnimatedContainer delay={100} className="mb-10">
              <Text className="text-3xl font-jakarta-bold text-on-surface mb-2">
                Créer un compte
              </Text>
              <Text className="text-sm font-jakarta text-on-surface-variant opacity-60">
                Créez votre espace famille pour gérer les actes de naissance.
              </Text>
            </AnimatedContainer>

            <AnimatedContainer delay={300}>
              <InputGroup 
                label="Nom Complet" 
                icon="account-outline" 
                value={name} 
                onChangeText={setName} 
                placeholder="Ex: Mariama Bah" 
              />
              
              <InputGroup 
                label="Numéro de Téléphone" 
                icon="phone-outline" 
                value={phone} 
                onChangeText={setPhone} 
                placeholder="Ex: +224..." 
                keyboardType="phone-pad"
              />

              <InputGroup 
                label="Email (Optionnel)" 
                icon="email-outline" 
                value={email} 
                onChangeText={setEmail} 
                placeholder="votre@email.com" 
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputGroup 
                label="Mot de passe" 
                icon="lock-outline" 
                value={password} 
                onChangeText={setPassword} 
                placeholder="••••••••" 
                secureTextEntry
              />

              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
                className={`h-16 bg-primary rounded-3xl flex-row items-center justify-center shadow-soft mt-6 ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-jakarta-bold text-base uppercase tracking-widest mr-2">
                      S'inscrire
                    </Text>
                    <MaterialCommunityIcons name="check-bold" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.replace('/login')} 
                className="mt-8 self-center"
              >
                <Text className="text-sm font-jakarta text-on-surface-variant">
                  Déjà un compte ? <Text className="font-jakarta-bold text-primary">Se connecter</Text>
                </Text>
              </TouchableOpacity>
            </AnimatedContainer>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputGroup({ label, icon, value, onChangeText, placeholder, ...props }: any) {
  return (
    <View className="mb-6">
      <Text className="text-[10px] font-jakarta-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
        {label}
      </Text>
      <View className="flex-row items-center bg-white border border-outline-variant rounded-2xl px-4 h-14">
        <MaterialCommunityIcons name={icon} size={20} color="#6d7a70" />
        <TextInput
          className="flex-1 ml-3 font-jakarta text-on-surface text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#bccabe"
          {...props}
        />
      </View>
    </View>
  );
}

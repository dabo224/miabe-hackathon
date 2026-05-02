import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';

const S = {
  bg: '#FAFAFA',
  white: '#ffffff',
  border: '#EFEFEF',
  label: '#9eaaa1',
  text: '#191c1d',
  muted: '#6d7a70',
  accent: '#006a40',
  accentLight: '#EAF3EE',
  danger: '#b91c1c',
  dangerLight: '#FEF2F2',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { parent, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(parent?.name || '');
  const [email, setEmail] = useState(parent?.email || '');
  const [phone, setPhone] = useState(parent?.phone || '');

  function handleSave() {
    setEditing(false);
    Alert.alert('Profil mis à jour', 'Vos informations ont été sauvegardées.');
  }

  function handleLogout() {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
      ],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      {/* Header Identique */}
      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            Profil
          </Text>
          <TouchableOpacity
            onPress={editing ? handleSave : () => setEditing(true)}
            style={{
              paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
              backgroundColor: editing ? S.accent : S.accentLight,
            }}
          >
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
              color: editing ? '#fff' : S.accent }}>
              {editing ? 'Sauvegarder' : 'Modifier'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

        {/* Avatar Area Identique */}
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: S.accentLight,
            alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 28, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent }}>
              {parent ? parent.name.substring(0, 2).toUpperCase() : 'PA'}
            </Text>
          </View>
          <Text style={{ fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            {name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
            backgroundColor: S.accentLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
            <MaterialCommunityIcons name="shield-check" size={13} color={S.accent} />
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
              Citoyen Authentifié
            </Text>
          </View>
        </View>

        {/* Sections Groupées Identiques */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={sectionTitle}>Informations personnelles</Text>
          <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden' }}>
            <ProfileField
              icon="account-outline"
              label="Nom complet"
              value={name}
              editing={editing}
              onChange={setName}
            />
            <ProfileField
              icon="email-outline"
              label="Email"
              value={email}
              editing={editing}
              onChange={setEmail}
              keyboardType="email-address"
            />
            <ProfileField
              icon="phone-outline"
              label="Téléphone"
              value={phone}
              editing={editing}
              onChange={setPhone}
              keyboardType="phone-pad"
              last
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={sectionTitle}>Paramètres</Text>
          <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden' }}>
            <SettingsRow icon="lock-outline" label="Changer le mot de passe" />
            <SettingsRow icon="bell-outline" label="Notifications" />
            <SettingsRow icon="help-circle-outline" label="Aide & Support" last />
          </View>
        </View>

        {/* Logout Identique */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={{ height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 8, backgroundColor: S.dangerLight,
              borderWidth: 1, borderColor: '#FEE2E2' }}
          >
            <MaterialCommunityIcons name="logout" size={18} color={S.danger} />
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.danger }}>
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', marginTop: 28, fontSize: 10,
          fontFamily: 'PlusJakartaSans_400Regular', color: S.label, letterSpacing: 0.5 }}>
          NaissanceChain v1.0.4 · République de Guinée
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

function ProfileField({ icon, label, value, editing, onChange, keyboardType, last }: any) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 14,
      borderBottomWidth: last ? 0 : 1, borderBottomColor: S.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <MaterialCommunityIcons name={icon} size={16} color={S.label} />
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label,
          letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>
      {editing ? (
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType || 'default'}
          style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text,
            borderBottomWidth: 1, borderBottomColor: S.accent, paddingVertical: 4, paddingHorizontal: 0 }}
        />
      ) : (
        <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }}>
          {value || '-'}
        </Text>
      )}
    </View>
  );
}

function SettingsRow({ icon, label, last }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ paddingHorizontal: 20, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        borderBottomWidth: last ? 0 : 1, borderBottomColor: S.border }}
    >
      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: S.bg,
        alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name={icon} size={16} color={S.label} />
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }}>
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={16} color={S.label} />
    </TouchableOpacity>
  );
}

const sectionTitle: any = {
  fontSize: 11,
  fontFamily: 'PlusJakartaSans_700Bold',
  color: '#9eaaa1',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 10,
};

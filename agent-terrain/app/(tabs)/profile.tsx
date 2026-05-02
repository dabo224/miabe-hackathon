import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User, Mail, Phone, MapPin, ShieldCheck,
  ChevronRight, LogOut, Bell, Lock, HelpCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import { RegionPicker } from '../../components/ui/RegionPicker';
import { PrefecturePicker } from '../../components/ui/PrefecturePicker';

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
  const { agent, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(agent?.name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState(''); // Need to infer from prefecture or set default
  const [prefecture, setPrefecture] = useState(agent?.prefecture || '');
  const [establishment, setEstablishment] = useState(agent?.establishment || '');

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setPrefecture(''); // Reset prefecture when region changes
  };

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
        { text: 'Déconnecter', style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } },
      ],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      {/* Header */}
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

        {/* Avatar + badge */}
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: S.accentLight,
            alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 28, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent }}>
              {agent ? agent.name.substring(0, 2).toUpperCase() : 'AG'}
            </Text>
          </View>
          <Text style={{ fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            {name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
            backgroundColor: S.accentLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
            <ShieldCheck size={13} color={S.accent} strokeWidth={2} />
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
              Agent agréé · {agent ? agent.identifier : 'Chargement...'}
            </Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={sectionTitle}>Informations personnelles</Text>
          <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden' }}>
            <ProfileField
              icon={<User size={16} color={S.label} strokeWidth={1.8} />}
              label="Nom complet"
              value={name}
              editing={editing}
              onChange={setName}
            />
            <ProfileField
              icon={<Mail size={16} color={S.label} strokeWidth={1.8} />}
              label="Email"
              value={email}
              editing={editing}
              onChange={setEmail}
              keyboardType="email-address"
            />
            <ProfileField
              icon={<Phone size={16} color={S.label} strokeWidth={1.8} />}
              label="Téléphone"
              value={phone}
              editing={editing}
              onChange={setPhone}
              keyboardType="phone-pad"
            />
            <ProfileField
              icon={<MapPin size={16} color={S.label} strokeWidth={1.8} />}
              label="Région"
              value={region}
              editing={editing}
              onChange={handleRegionChange}
              pickerType="region"
            />
            <ProfileField
              icon={<MapPin size={16} color={S.label} strokeWidth={1.8} />}
              label="Préfecture"
              value={prefecture}
              editing={editing}
              onChange={setPrefecture}
              pickerType="prefecture"
              region={region}
            />
            <ProfileField
              icon={<ShieldCheck size={16} color={S.label} strokeWidth={1.8} />}
              label="Établissement"
              value={establishment}
              editing={editing}
              onChange={setEstablishment}
              last
            />
          </View>
        </View>

        {/* Paramètres */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={sectionTitle}>Paramètres</Text>
          <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden' }}>
            <SettingsRow icon={<Lock size={16} color={S.label} strokeWidth={1.8} />} label="Changer le mot de passe" />
            <SettingsRow icon={<Bell size={16} color={S.label} strokeWidth={1.8} />} label="Notifications" />
            <SettingsRow icon={<HelpCircle size={16} color={S.label} strokeWidth={1.8} />} label="Aide & Support" last />
          </View>
        </View>

        {/* Déconnexion */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={{ height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 8, backgroundColor: S.dangerLight,
              borderWidth: 1, borderColor: '#FEE2E2' }}
          >
            <LogOut size={18} color={S.danger} strokeWidth={1.8} />
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.danger }}>
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={{ textAlign: 'center', marginTop: 28, fontSize: 10,
          fontFamily: 'PlusJakartaSans_400Regular', color: S.label, letterSpacing: 0.5 }}>
          NaissanceChain v1.0.0 · Ministère de la Santé, Guinée
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

function ProfileField({ icon, label, value, editing, onChange, keyboardType, pickerType, region, last }: any) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 14,
      borderBottomWidth: last ? 0 : 1, borderBottomColor: S.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {icon}
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label,
          letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>
      {editing ? (
        pickerType === 'region' ? (
          <View style={{ marginTop: 8 }}>
            <RegionPicker value={value} onSelect={onChange} />
          </View>
        ) : pickerType === 'prefecture' ? (
          <View style={{ marginTop: 8 }}>
            <PrefecturePicker value={value} onSelect={onChange} region={region} />
          </View>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType || 'default'}
            style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text,
              borderBottomWidth: 1, borderBottomColor: S.accent, paddingVertical: 4, paddingHorizontal: 0 }}
          />
        )
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
        {icon}
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }}>
        {label}
      </Text>
      <ChevronRight size={16} color={S.label} strokeWidth={1.8} />
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

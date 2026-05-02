import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MapPin, Home as HomeIcon, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRegistration } from '../../context/RegistrationContext';
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
};

export default function RegisterStep3() {
  const router = useRouter();
  const { formData, updateData } = useRegistration();
  const { agent } = useAuth();

  // Déclarant
  const [nomDeclarant, setNomDeclarant] = useState(formData.declarant.nom);
  const [idDeclarant, setIdDeclarant] = useState(formData.declarant.id);
  const [lienDeclarant, setLienDeclarant] = useState(formData.declarant.lien);

  // Localisation
  const [telephone, setTelephone] = useState(formData.contact.telephone);
  const [quartier, setQuartier] = useState(formData.contact.quartier);
  const [secteur, setSecteur] = useState(formData.contact.secteur);

  const handleNext = () => {
    updateData({
      declarant: { nom: nomDeclarant, id: idDeclarant, lien: lienDeclarant },
      contact: { telephone, quartier, secteur }
    });
    router.push('/register-flow/confirm');
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          {/* Stepper */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 3 sur 4
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Déclarant & Localisation
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 100, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

        {/* Section Déclarant */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>Le Déclarant</Text>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Nom complet du déclarant</Text>
          <TextInput value={nomDeclarant} onChangeText={setNomDeclarant} placeholder="Prénom et nom" placeholderTextColor="#bccabe" style={inputStyle} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Lien de parenté</Text>
                <TextInput value={lienDeclarant} onChangeText={setLienDeclarant} placeholder="Ex: PÈRE" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={labelStyle}>N° Identité (CNI)</Text>
                <TextInput value={idDeclarant} onChangeText={setIdDeclarant} placeholder="N° CNI" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
        </View>

        {/* Séparateur */}
        <View style={{ height: 1, backgroundColor: S.border, marginVertical: 20 }} />

        {/* Localisation Parents */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>Localisation des Parents</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Téléphone de contact</Text>
          <View style={{ ...inputStyle, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Phone size={16} color={S.label} strokeWidth={1.8} />
            <TextInput value={telephone} onChangeText={setTelephone} placeholder="+224 6XX XXX XXX" placeholderTextColor="#bccabe" keyboardType="phone-pad"
              style={{ flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }} />
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
            <Text style={labelStyle}>Préfecture / Commune</Text>
            <View style={{ ...inputStyle, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} color={S.label} strokeWidth={1.8} />
                <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }}>{agent?.prefecture || 'Kindia'}</Text>
              </View>
              <ChevronDown size={16} color={S.label} strokeWidth={1.8} />
            </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
          <View style={{ flex: 1 }}>
            <Text style={labelStyle}>Quartier / District</Text>
            <View style={{ ...inputStyle, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color={S.label} strokeWidth={1.8} />
              <TextInput value={quartier} onChangeText={setQuartier} placeholder="Quartier" placeholderTextColor="#bccabe"
                style={{ flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={labelStyle}>Secteur / Village</Text>
            <View style={{ ...inputStyle, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HomeIcon size={16} color={S.label} strokeWidth={1.8} />
              <TextInput value={secteur} onChangeText={setSecteur} placeholder="Secteur" placeholderTextColor="#bccabe"
                style={{ flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: S.text }} />
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
              backgroundColor: S.white, borderWidth: 1, borderColor: S.border }}
          >
            <ArrowLeft size={18} color={S.muted} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={{ flex: 1, height: 52, backgroundColor: S.accent, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>Suivant</Text>
            <ArrowRight size={18} color="white" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

const sectionLabel: any = {
  fontSize: 13,
  fontFamily: 'PlusJakartaSans_700Bold',
  color: '#191c1d',
  marginBottom: 16,
};

const labelStyle: any = {
  fontSize: 11,
  fontFamily: 'PlusJakartaSans_700Bold',
  color: '#9eaaa1',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 8,
};

const inputStyle: any = {
  height: 52,
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#EFEFEF',
  borderRadius: 12,
  paddingHorizontal: 16,
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_400Regular',
  color: '#191c1d',
};

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

export default function RegisterStep2() {
  const router = useRouter();
  const { formData, updateData } = useRegistration();

  // Mère
  const [nomMere, setNomMere] = useState(formData.mere.nom);
  const [idMere, setIdMere] = useState(formData.mere.id);
  const [dateMere, setDateMere] = useState(formData.mere.dateNaissance);
  const [profMere, setProfMere] = useState(formData.mere.profession);
  const [natMere, setNatMere] = useState(formData.mere.nationalite);

  // Père
  const [nomPere, setNomPere] = useState(formData.pere.nom);
  const [idPere, setIdPere] = useState(formData.pere.id);
  const [datePere, setDatePere] = useState(formData.pere.dateNaissance);
  const [profPere, setProfPere] = useState(formData.pere.profession);
  const [natPere, setNatPere] = useState(formData.pere.nationalite);

  const handleNext = () => {
    updateData({
      mere: { nom: nomMere, id: idMere, dateNaissance: dateMere, profession: profMere, nationalite: natMere },
      pere: { nom: nomPere, id: idPere, dateNaissance: datePere, profession: profPere, nationalite: natPere }
    });
    router.push('/register-flow/step3');
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
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 2 sur 4
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Informations des parents
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 100, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

        {/* Section Mère */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>Informations de la Mère</Text>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Nom complet</Text>
          <TextInput value={nomMere} onChangeText={setNomMere} placeholder="Prénom et nom" placeholderTextColor="#bccabe" style={inputStyle} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Date de naissance</Text>
                <TextInput value={dateMere} onChangeText={setDateMere} placeholder="JJ/MM/AAAA" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Nationalité</Text>
                <TextInput value={natMere} onChangeText={setNatMere} placeholder="Nationalité" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Profession</Text>
          <TextInput value={profMere} onChangeText={setProfMere} placeholder="Ex: Commerçante" placeholderTextColor="#bccabe" style={inputStyle} />
        </View>

        <View style={{ marginBottom: 28 }}>
          <Text style={labelStyle}>Numéro d'identité (CNI)</Text>
          <TextInput value={idMere} onChangeText={setIdMere} placeholder="N° de carte d'identité" placeholderTextColor="#bccabe" style={inputStyle} />
        </View>

        {/* Séparateur */}
        <View style={{ height: 1, backgroundColor: S.border, marginBottom: 28 }} />

        {/* Section Père */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>Informations du Père</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Nom complet</Text>
          <TextInput value={nomPere} onChangeText={setNomPere} placeholder="Prénom et nom" placeholderTextColor="#bccabe" style={inputStyle} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Date de naissance</Text>
                <TextInput value={datePere} onChangeText={setDatePere} placeholder="JJ/MM/AAAA" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Nationalité</Text>
                <TextInput value={natPere} onChangeText={setNatPere} placeholder="Nationalité" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Profession</Text>
          <TextInput value={profPere} onChangeText={setProfPere} placeholder="Ex: Enseignant" placeholderTextColor="#bccabe" style={inputStyle} />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={labelStyle}>Numéro d'identité (CNI)</Text>
          <TextInput value={idPere} onChangeText={setIdPere} placeholder="N° de carte d'identité" placeholderTextColor="#bccabe" style={inputStyle} />
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

import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRegistration } from '../../context/RegistrationContext';
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
};

export default function RegisterStep1() {
  const router = useRouter();
  const { formData, updateData } = useRegistration();

  const [prenom, setPrenom] = useState(formData.prenom);
  const [nom, setNom] = useState(formData.nom);
  const [sexe, setSexe] = useState<'M' | 'F'>(formData.sexe);
  const [dateNaissance, setDateNaissance] = useState(formData.dateNaissance);
  const [heure, setHeure] = useState(formData.heure);
  const [nationalite, setNationalite] = useState(formData.nationaliteEnfant);
  
  // Lieu de naissance
  const [region, setRegion] = useState(formData.lieuNaissance.region);
  const [prefecture, setPrefecture] = useState(formData.lieuNaissance.prefecture);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setPrefecture(''); // Reset prefecture when region changes
  };
  const [sousPrefecture, setSousPrefecture] = useState(formData.lieuNaissance.sousPrefecture);

  const handleNext = () => {
    updateData({ 
        prenom, 
        nom, 
        sexe, 
        dateNaissance, 
        heure, 
        nationaliteEnfant: nationalite,
        lieuNaissance: { region, prefecture, sousPrefecture }
    });
    router.push('/register-flow/step2');
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          {/* Stepper */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 1 sur 4
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Informations de l'enfant
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 100, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          {/* Prénom & Nom */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Prénom</Text>
                  <TextInput value={prenom} onChangeText={setPrenom} placeholder="Prénom" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Nom</Text>
                  <TextInput value={nom} onChangeText={setNom} placeholder="Nom" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
          </View>

          {/* Nationalité */}
          <View style={{ marginBottom: 24 }}>
            <Text style={labelStyle}>Nationalité</Text>
            <TextInput value={nationalite} onChangeText={setNationalite} placeholder="Ex: GUINÉENNE" placeholderTextColor="#bccabe" style={inputStyle} />
          </View>

          {/* Sexe */}
          <View style={{ marginBottom: 24 }}>
            <Text style={labelStyle}>Sexe</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setSexe('M')}
                style={{
                  flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: sexe === 'M' ? S.accent : S.white,
                  borderWidth: 1, borderColor: sexe === 'M' ? S.accent : S.border,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: sexe === 'M' ? 'white' : S.muted }}>
                  Masculin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSexe('F')}
                style={{
                  flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: sexe === 'F' ? S.accent : S.white,
                  borderWidth: 1, borderColor: sexe === 'F' ? S.accent : S.border,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: sexe === 'F' ? 'white' : S.muted }}>
                  Féminin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date & Heure */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <View style={{ flex: 1.5 }}>
              <Text style={labelStyle}>Date de naissance</Text>
              <TextInput value={dateNaissance} onChangeText={setDateNaissance} placeholder="JJ/MM/AAAA" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Heure</Text>
              <TextInput value={heure} onChangeText={setHeure} placeholder="HH:MM" placeholderTextColor="#bccabe" style={inputStyle} />
            </View>
          </View>

          {/* Lieu Détayé */}
          <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginBottom: 12 }}>
                  Lieu de naissance
              </Text>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={labelStyle}>Région</Text>
            <RegionPicker value={region} onSelect={handleRegionChange} />
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Préfecture</Text>
                  <PrefecturePicker value={prefecture} onSelect={setPrefecture} region={region} />
              </View>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Sous-préfecture</Text>
                  <TextInput value={sousPrefecture} onChangeText={setSousPrefecture} placeholder="Commune" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.85}
            style={{ height: 52, backgroundColor: S.accent, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
              Suivant
            </Text>
            <ArrowRight size={18} color="white" strokeWidth={2} />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

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

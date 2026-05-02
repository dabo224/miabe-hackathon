import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeclaration } from '../../context/DeclarationContext';
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

export default function DeclareStep1() {
  const router = useRouter();
  const { formData, updateData } = useDeclaration();

  const [prenom, setPrenom] = useState(formData.prenom);
  const [nom, setNom] = useState(formData.nom);
  const [sexe, setSexe] = useState<'M' | 'F'>(formData.sexe);
  const [dateNaissance, setDateNaissance] = useState(formData.dateNaissance);
  const [heure, setHeure] = useState(formData.heure);
  const [region, setRegion] = useState(formData.lieuNaissance.region);
  const [prefecture, setPrefecture] = useState(formData.lieuNaissance.prefecture);
  const [sousPrefecture, setSousPrefecture] = useState(formData.lieuNaissance.sousPrefecture);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setPrefecture('');
  };

  const handleNext = () => {
    updateData({ 
        prenom, 
        nom, 
        sexe, 
        dateNaissance, 
        heure, 
        lieuNaissance: { region, prefecture, sousPrefecture }
    });
    router.push('/declare-flow/step2');
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 1 sur 3
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Informations de l'enfant
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1.2 }}>
                  <Text style={labelStyle}>Prénoms de l'enfant</Text>
                  <TextInput value={prenom} onChangeText={setPrenom} placeholder="Prénoms" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Nom</Text>
                  <TextInput value={nom} onChangeText={setNom} placeholder="Nom" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={labelStyle}>Sexe de l'enfant</Text>
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

          <View style={{ marginBottom: 16 }}>
            <Text style={labelStyle}>Région de naissance</Text>
            <RegionPicker value={region} onSelect={handleRegionChange} />
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Préfecture</Text>
                  <PrefecturePicker value={prefecture} onSelect={setPrefecture} region={region} />
              </View>
              <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Sous-préfecture</Text>
                  <TextInput value={sousPrefecture} onChangeText={setSousPrefecture} placeholder="Commune" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
          </View>

          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.85}
            style={{ height: 56, backgroundColor: S.accent, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
              Suivant
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const labelStyle: any = {
  fontSize: 11,
  fontFamily: 'PlusJakartaSans_700Bold',
  color: S.label,
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 8,
};

const inputStyle: any = {
  height: 52,
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: S.border,
  borderRadius: 12,
  paddingHorizontal: 16,
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_400Regular',
  color: S.text,
};

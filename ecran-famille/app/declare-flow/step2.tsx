import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeclaration } from '../../context/DeclarationContext';
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

export default function DeclareStep2() {
  const router = useRouter();
  const { parent } = useAuth();
  const { formData, updateData } = useDeclaration();

  const [declarantRole, setDeclarantRole] = useState<'MÈRE' | 'PÈRE' | 'AUTRE'>(formData.declarant.lien as any || 'MÈRE');
  
  // Mère info
  const [mereNom, setMereNom] = useState(formData.mere.nom);
  const [mereId, setMereId] = useState(formData.mere.id);
  const [mereProfession, setMereProfession] = useState(formData.mere.profession);

  // Père info
  const [pereNom, setPereNom] = useState(formData.pere.nom);
  const [pereId, setPereId] = useState(formData.pere.id);
  const [pereProfession, setPereProfession] = useState(formData.pere.profession);

  // Pre-fill loggged in parent info
  useEffect(() => {
    if (parent) {
        if (declarantRole === 'MÈRE') {
            setMereNom(parent.name);
            setMereId(parent._id);
        } else if (declarantRole === 'PÈRE') {
            setPereNom(parent.name);
            setPereId(parent._id);
        }
    }
  }, [declarantRole, parent]);

  const handleNext = () => {
    updateData({ 
        mere: { ...formData.mere, nom: mereNom, id: mereId, profession: mereProfession },
        pere: { ...formData.pere, nom: pereNom, id: pereId, profession: pereProfession },
        declarant: { 
            nom: parent?.name || '', 
            id: parent?._id || '', 
            lien: declarantRole 
        }
    });
    router.push('/declare-flow/confirm');
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.border, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 2 sur 3
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Informations des parents
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

          <View style={{ marginBottom: 32 }}>
            <Text style={labelStyle}>Je fais cette déclaration en tant que :</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                {['MÈRE', 'PÈRE', 'AUTRE'].map((role) => (
                    <TouchableOpacity
                        key={role}
                        onPress={() => setDeclarantRole(role as any)}
                        style={{
                            flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                            backgroundColor: declarantRole === role ? S.accent : S.white,
                            borderWidth: 1, borderColor: declarantRole === role ? S.accent : S.border,
                        }}
                    >
                        <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: declarantRole === role ? 'white' : S.muted }}>
                            {role}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Section MÈRE */}
          <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF69B4' }} />
                  <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.text }}>LA MÈRE</Text>
              </View>
              
              <View style={{ marginBottom: 16 }}>
                  <Text style={labelStyle}>Nom complet de la mère</Text>
                  <TextInput value={mereNom} onChangeText={setMereNom} placeholder="Ex: Mariama Bah" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                      <Text style={labelStyle}>N° Identité / Passeport</Text>
                      <TextInput value={mereId} onChangeText={setMereId} placeholder="ID" placeholderTextColor="#bccabe" style={inputStyle} />
                  </View>
                  <View style={{ flex: 1 }}>
                      <Text style={labelStyle}>Profession</Text>
                      <TextInput value={mereProfession} onChangeText={setMereProfession} placeholder="Profession" placeholderTextColor="#bccabe" style={inputStyle} />
                  </View>
              </View>
          </View>

          {/* Section PÈRE */}
          <View style={{ marginBottom: 40 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4169E1' }} />
                  <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.text }}>LE PÈRE</Text>
              </View>
              
              <View style={{ marginBottom: 16 }}>
                  <Text style={labelStyle}>Nom complet du père</Text>
                  <TextInput value={pereNom} onChangeText={setPereNom} placeholder="Ex: Mamadou Diallo" placeholderTextColor="#bccabe" style={inputStyle} />
              </View>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                      <Text style={labelStyle}>N° Identité / Passeport</Text>
                      <TextInput value={pereId} onChangeText={setPereId} placeholder="ID" placeholderTextColor="#bccabe" style={inputStyle} />
                  </View>
                  <View style={{ flex: 1 }}>
                      <Text style={labelStyle}>Profession</Text>
                      <TextInput value={pereProfession} onChangeText={setPereProfession} placeholder="Profession" placeholderTextColor="#bccabe" style={inputStyle} />
                  </View>
              </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ flex: 1, height: 56, backgroundColor: S.white, borderRadius: 16, borderWith: 1, borderColor: S.border, alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: S.muted }}>Retour</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.85}
                style={{ flex: 2, height: 56, backgroundColor: S.accent, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
                <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>Suivant</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>

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

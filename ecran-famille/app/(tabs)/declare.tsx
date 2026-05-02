import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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

export default function DeclareEntryScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            Déclaration de Naissance
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginVertical: 40 }}>
            <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: S.accentLight, alignItems: 'center', justifyContent: 'center', marginBottom: 28, borderWidth: 1, borderColor: '#D1E7DD' }}>
                <MaterialCommunityIcons name="baby-face-outline" size={60} color={S.accent} />
            </View>
            <Text style={{ fontSize: 24, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.text, textAlign: 'center', marginBottom: 12 }}>
                Enregistrez votre enfant
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 }}>
                La déclaration de naissance est une étape obligatoire pour garantir les droits de votre enfant et lui permettre d'obtenir son acte de naissance sécurisé.
            </Text>
        </View>

        <View style={{ gap: 16, marginBottom: 40 }}>
            <FeatureItem 
                icon="shield-check-outline" 
                title="Données Sécurisées" 
                desc="Vos informations sont protégées par le système national de santé." 
            />
            <FeatureItem 
                icon="qrcode" 
                title="Génération d'Acte" 
                desc="Un QR code unique sera généré pour l'authentification officielle." 
            />
            <FeatureItem 
                icon="link-variant" 
                title="Preuve Blockchain" 
                desc="L'acte est enregistré de manière immuable sur la blockchain nationale." 
            />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/declare-flow/step1')}
          activeOpacity={0.85}
          style={{
            backgroundColor: S.accent,
            paddingVertical: 18,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            shadowColor: S.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
            Commencer la déclaration
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', color: S.label, fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', marginTop: 24, textTransform: 'uppercase', letterSpacing: 1 }}>
            Délai légal : 15 jours après la naissance
        </Text>
      </ScrollView>
    </View>
  );
}

function FeatureItem({ icon, title, desc }: any) {
    return (
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', backgroundColor: S.white, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: S.border }}>
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: S.accentLight, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name={icon} size={24} color={S.accent} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>{title}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>{desc}</Text>
            </View>
        </View>
    );
}

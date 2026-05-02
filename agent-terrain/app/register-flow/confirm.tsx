import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Baby, Users, MapPin, WifiOff, Landmark, PenTool, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegistration } from '../../context/RegistrationContext';
import { useAuth } from '../../context/AuthContext';
import Config from '../../constants/Config';
import { useState } from 'react';

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

export default function ConfirmScreen() {
  const router = useRouter();
  const { formData, clearData } = useRegistration();
  const { agent } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = `${Config.API_BASE_URL}/naissances`;
      
      const payload = {
        // Enfant
        prenom: formData.prenom,
        nom: formData.nom,
        sexe: formData.sexe,
        dateNaissance: formData.dateNaissance,
        heureNaissance: formData.heure,
        lieuNaissance: formData.lieuNaissance,
        nationaliteEnfant: formData.nationaliteEnfant,

        // Mère
        mere: formData.mere,
        
        // Père
        pere: formData.pere,

        // Localisation
        adresseParents: {
            region: formData.lieuNaissance.region,
            prefecture: agent?.prefecture || 'Kindia',
            sousPrefecture: formData.lieuNaissance.sousPrefecture,
            quartier: formData.contact.quartier,
            secteur: formData.contact.secteur
        },

        // Déclarant
        declarant: formData.declarant,

        // Méta
        agentId: agent?._id || agent?.identifier,
        prefecture: agent?.prefecture || 'Kindia'
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); 

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const result = await response.json();

      if (result.success) {
        const idActe = result.data.idActe;
        clearData(); // Clean state
        router.push(`/register-flow/success?id=${idActe}`);
      } else {
        Alert.alert('Erreur', result.message || "Impossible d'enregistrer l'acte");
      }
    } catch (error: any) {
      // OFFLINE MODE / NETWORK ERROR
      console.log("Offline mode detected, saving locally...");
      
      try {
        const PENDING_STORAGE_KEY = '@pending_registrations';
        const existingData = await AsyncStorage.getItem(PENDING_STORAGE_KEY);
        const pendingQueue = existingData ? JSON.parse(existingData) : [];
        
        // Create a local pseudo-record for the success screen
        const localId = `PENDING-${Date.now()}`;
        const offlineRecord = {
            ...payload,
            idActe: localId,
            createdAt: new Date().toISOString(),
            isOffline: true
        };
        
        pendingQueue.push(offlineRecord);
        await AsyncStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingQueue));
        
        clearData();
        Alert.alert(
            'Mode Hors-Ligne', 
            'Connexion impossible. L’acte a été enregistré localement sur votre appareil et devra être synchronisé plus tard.',
            [{ text: 'OK', onPress: () => router.push(`/register-flow/success?id=${localId}&offline=true`) }]
        );
      } catch (e) {
        Alert.alert('Erreur Critique', 'Impossible de sauvegarder l’acte localement.');
      }
    } finally {
      setLoading(false);
    }
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
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 4 sur 4 — Révision finale
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Vérification
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Récap Enfant */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>
            <Baby size={14} color={S.muted} strokeWidth={1.8} />
            {'  '}L'Enfant
          </Text>
        </View>
        <View style={{ backgroundColor: S.white, borderRadius: 14, borderWidth: 1, borderColor: S.border, padding: 20, marginBottom: 20 }}>
          <DataRow label="Prénom & Nom" value={`${formData.prenom} ${formData.nom}`} />
          <DataRow label="Sexe" value={formData.sexe === 'M' ? 'Masculin' : 'Féminin'} />
          <DataRow label="Né(e) le" value={`${formData.dateNaissance} à ${formData.heure}`} />
          <DataRow label="Nationalité" value={formData.nationaliteEnfant} />
          <DataRow label="Lieu" value={`${formData.lieuNaissance.sousPrefecture}, ${formData.lieuNaissance.prefecture}`} last />
        </View>

        {/* Récap Parents */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>
            <Users size={14} color={S.muted} strokeWidth={1.8} />
            {'  '}Les Parents
          </Text>
        </View>
        <View style={{ backgroundColor: S.white, borderRadius: 14, borderWidth: 1, borderColor: S.border, padding: 20, marginBottom: 20 }}>
          <Text style={subLabel}>Mère</Text>
          <DataRow label="Nom" value={formData.mere.nom || '-'} />
          <DataRow label="Profession" value={formData.mere.profession || '-'} />
          
          <View style={{ height: 10 }} />
          <Text style={subLabel}>Père</Text>
          <DataRow label="Nom" value={formData.pere.nom || 'Non déclaré'} />
          <DataRow label="Profession" value={formData.pere.profession || '-'} last />
        </View>

        {/* Récap Déclarant */}
        <View style={{ marginBottom: 8 }}>
          <Text style={sectionLabel}>
            <PenTool size={14} color={S.muted} strokeWidth={1.8} />
            {'  '}Déclarant & Adresse
          </Text>
        </View>
        <View style={{ backgroundColor: S.white, borderRadius: 14, borderWidth: 1, borderColor: S.border, padding: 20, marginBottom: 20 }}>
          <DataRow label="Déclarant" value={formData.declarant.nom} />
          <DataRow label="Lien" value={formData.declarant.lien} />
          <DataRow label="Quartier" value={formData.contact.quartier} />
          <DataRow label="Village/Secteur" value={formData.contact.secteur} last />
        </View>

        {/* Alerte offline */}
        <View style={{ flexDirection: 'row', gap: 12, backgroundColor: '#fffbeb',
          borderRadius: 12, padding: 16, marginBottom: 24,
          borderLeftWidth: 3, borderLeftColor: '#d97706' }}>
          <WifiOff size={18} color="#92400e" strokeWidth={1.8} style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#92400e', lineHeight: 20 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>Mode sécurisé. </Text>
            L'acte sera certifié par la blockchain après votre signature.
          </Text>
        </View>

        {/* Signature */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
            Signature de l'agent (Digitale)
          </Text>
          <View style={{ height: 100, backgroundColor: S.white, borderRadius: 14, borderWidth: 1,
            borderColor: S.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <PenTool size={24} color={S.border} strokeWidth={1.5} />
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.label }}>
              {agent?.name}
            </Text>
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
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
            style={{ flex: 1, height: 52, backgroundColor: S.accent, borderRadius: 14,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1 }}
          >
            <Landmark size={18} color="white" strokeWidth={1.8} />
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
              {loading ? 'Certification...' : 'Signer & Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const subLabel: any = {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: S.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
};

function DataRow({ label, value, mono, last }: any) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      paddingVertical: 10, borderBottomWidth: last ? 0 : 1, borderBottomColor: '#EFEFEF' }}>
      <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#9eaaa1', flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontFamily: mono ? 'PlusJakartaSans_400Regular' : 'PlusJakartaSans_700Bold',
        color: '#191c1d', flex: 2, textAlign: 'right', letterSpacing: mono ? 0.5 : 0 }}>
        {value}
      </Text>
    </View>
  );
}

const sectionLabel: any = {
  fontSize: 13,
  fontFamily: 'PlusJakartaSans_700Bold',
  color: '#6d7a70',
  marginBottom: 10,
  flexDirection: 'row',
  alignItems: 'center',
};

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDeclaration } from '../../context/DeclarationContext';
import { useAuth } from '../../context/AuthContext';
import { FamilyService } from '../../services/FamilyService';
import Config from '../../constants/Config';

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

export default function DeclareConfirm() {
  const router = useRouter();
  const { parent } = useAuth();
  const { formData, clearData } = useDeclaration();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        agentId: `PARENT-${parent?._id || 'GUESTS'}`, // Marker for citizen declaration
        prefecture: formData.lieuNaissance.prefecture
      };

      const response = await fetch(`${Config.API_BASE_URL}/naissances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        const isPending = result.data.status === 'PENDING';

        Alert.alert(
            isPending ? "Déclaration enregistrée" : "Déclaration réussie",
            isPending 
                ? `Votre déclaration a été enregistrée avec le N° ${result.data.idActe}. Elle est en attente de validation par un administrateur.`
                : `Félicitations ! L'acte N° ${result.data.idActe} a été généré et sécurisé sur la blockchain.`,
            [{ text: "Compris", onPress: () => {
                clearData();
                router.replace('/(tabs)');
            }}]
        );
      } else {
        Alert.alert("Erreur", result.message || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur réseau", "Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
            <View style={{ height: 3, flex: 1, backgroundColor: S.accent, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
            Étape 3 sur 3
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginTop: 4 }}>
            Confirmation finale
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ backgroundColor: S.white, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: S.border, marginBottom: 32 }}>
            <SummarySection title="L'ENFANT" icon="baby-face-outline">
                <SummaryRow label="Prénoms" value={formData.prenom} />
                <SummaryRow label="Nom" value={formData.nom} />
                <SummaryRow label="Sexe" value={formData.sexe === 'M' ? 'Masculin' : 'Féminin'} />
                <SummaryRow label="Né le" value={`${formData.dateNaissance} à ${formData.heure}`} />
                <SummaryRow label="Lieu" value={`${formData.lieuNaissance.sousPrefecture}, ${formData.lieuNaissance.prefecture}`} />
            </SummarySection>

            <View style={{ height: 1, backgroundColor: S.border, marginVertical: 20 }} />

            <SummarySection title="LES PARENTS" icon="account-group-outline">
                <SummaryRow label="Mère" value={formData.mere.nom} />
                <SummaryRow label="Père" value={formData.pere.nom || 'Non déclaré'} />
            </SummarySection>

            <View style={{ height: 1, backgroundColor: S.border, marginVertical: 20 }} />

            <SummarySection title="DÉCLARANT" icon="signature">
                <SummaryRow label="Nom" value={formData.declarant.nom} />
                <SummaryRow label="Lien" value={formData.declarant.lien} />
            </SummarySection>
        </View>

        <View style={{ backgroundColor: '#FFF9E6', padding: 20, borderRadius: 20, borderLeftWidth: 4, borderLeftColor: '#F59E0B', marginBottom: 40 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#F59E0B" />
                <Text style={{ flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#92400E', lineHeight: 20 }}>
                    En validant, vous certifiez sur l'honneur l'exactitude des informations fournies. Toute fausse déclaration est passible de sanctions.
                </Text>
            </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
                onPress={() => router.back()}
                disabled={loading}
                style={{ flex: 1, height: 56, backgroundColor: S.white, borderRadius: 16, borderWith: 1, borderColor: S.border, alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: S.muted }}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
                style={{ flex: 2, height: 56, backgroundColor: S.accent, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>Valider & Enregistrer</Text>
                        <MaterialCommunityIcons name="check-bold" size={20} color="white" />
                    </>
                )}
            </TouchableOpacity>
          </View>

      </ScrollView>
    </View>
  );
}

function SummarySection({ title, icon, children }: any) {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MaterialCommunityIcons name={icon} size={20} color="#006a40" />
                <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#006a40', letterSpacing: 1 }}>{title}</Text>
            </View>
            <View style={{ gap: 12 }}>
                {children}
            </View>
        </View>
    );
}

function SummaryRow({ label, value }: any) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#9eaaa1' }}>{label}</Text>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#191c1d' }}>{value || '-'}</Text>
        </View>
    );
}

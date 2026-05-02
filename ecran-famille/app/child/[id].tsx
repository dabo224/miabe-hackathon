import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Alert, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { PillButton } from '@/components/ui/pill-button';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { FamilyService } from '@/services/FamilyService';
import Config from '../../constants/Config';

const S = {
  bg: '#f8f9fa',
  white: '#ffffff',
  border: '#e7e8e9',
  label: '#6d7a70',
  text: '#191c1d',
  muted: '#bccabe',
  accent: '#006a40',
  headerBg: '#f3f4f5',
};

export default function ChildProfileScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);
  const [relation, setRelation] = useState<string | null>(null);

  useEffect(() => {
    fetchRecordAndRelation();
  }, [id]);

  const fetchRecordAndRelation = async () => {
    try {
      setLoading(true);
      
      // Get relation from local storage
      const rel = await FamilyService.getMemberRelation(id as string);
      setRelation(rel);

      const response = await fetch(`${Config.API_BASE_URL}/naissances/${id}`, {
        headers: {
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      const result = await response.json();

      if (result.success) {
        setRecord(result.data);
      } else {
        Alert.alert('Erreur', result.message || 'Impossible de trouver cet acte de naissance.');
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getFullRelationName = (rel: string | null) => {
    switch (rel) {
        case 'enfant': return 'Mon Enfant';
        case 'moi': return 'Moi-même';
        case 'conjoint': return 'Mon Conjoint';
        case 'autre': return 'Famille';
        default: return null;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: S.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={S.accent} />
        <Text style={{ marginTop: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.label, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.5 }}>
            Vérification sécurisée...
        </Text>
      </View>
    );
  }

  if (!record) return null;

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <TopAppBar />
      
      <ScrollView 
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 60, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedContainer delay={200}>
            {/* Badge de Certification */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#006a40', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
                    <MaterialCommunityIcons name="check-decagram" size={36} color={S.accent} />
                </View>
                
                {relation && (
                    <View style={{ backgroundColor: '#EAF3EE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8 }}>
                        <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent, textTransform: 'uppercase', letterSpacing: 1 }}>
                            {getFullRelationName(relation)}
                        </Text>
                    </View>
                )}

                <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
                    Document Authentifié
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: S.label, marginTop: 4, textAlign: 'center', opacity: 0.8 }}>
                    Certifié par la blockchain nationale guinéenne
                </Text>
            </View>

            {/* Document Container */}
            <View style={s.certContainer}>
                {/* En-tête Institutionnel */}
                <View style={{ alignItems: 'center', padding: 24, borderBottomWidth: 1.5, borderBottomColor: '#191c1d' }}>
                    <Text style={s.country}>RÉPUBLIQUE DE GUINÉE</Text>
                    <Text style={s.motto}>TRAVAIL - JUSTICE - SOLIDARITÉ</Text>
                    <View style={{ height: 20 }} />
                    <Text style={s.title}>ACTE DE NAISSANCE</Text>
                    <View style={{ backgroundColor: '#191c1d', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, marginTop: 12 }}>
                        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_800ExtraBold', color: 'white', letterSpacing: 1 }}>N° {record.idActe}</Text>
                    </View>
                </View>

                {/* Section L'ENFANT */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionHeaderText}>I. L'ENFANT</Text>
                </View>
                <DataRow label="Prénoms" value={record.prenom} />
                <DataRow label="Nom" value={record.nom} />
                <DataRow label="Sexe" value={record.sexe === 'M' ? 'MASCULIN' : 'FÉMININ'} />
                <DataRow label="Né(e) le" value={record.dateNaissance} secondValue={`à ${record.heureNaissance || '--:--'}`} />
                <DataRow label="Lieu" value={`${record.lieuNaissance.sousPrefecture}, ${record.lieuNaissance.prefecture}`} />

                {/* Section LES PARENTS */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionHeaderText}>II. LES PARENTS</Text>
                </View>
                <View style={s.subSection}>
                    <Text style={s.subSectionTitle}>PÈRE</Text>
                </View>
                <DataRow label="Prénom & Nom" value={record.pere?.nom || 'NON DÉCLARÉ'} />
                <DataRow label="Profession" value={record.pere?.profession || '-'} />
                
                <View style={s.subSection}>
                    <Text style={s.subSectionTitle}>MÈRE</Text>
                </View>
                <DataRow label="Prénom & Nom" value={record.mere.nom} />
                <DataRow label="Profession" value={record.mere.profession || '-'} />

                {/* Pied de page: Validation & Signature */}
                <View style={{ flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: S.border, padding: 20 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                         {/* QR Code */}
                         <View style={{ width: 100, height: 100, backgroundColor: 'white', borderWidth: 1, borderColor: S.border, borderRadius: 8, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }}>
                             {record.qrCode ? (
                                 <Image source={{ uri: record.qrCode }} style={{ flex: 1 }} resizeMode="contain" />
                             ) : (
                                 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                     <MaterialCommunityIcons name="qrcode" size={48} color={S.muted} />
                                 </View>
                             )}
                        </View>
                        <Text style={{ fontSize: 7, fontFamily: 'PlusJakartaSans_700Bold', color: S.muted, marginTop: 6, opacity: 0.6 }}>ID ACTE: {record.idActe}</Text>
                    </View>
                    <View style={{ flex: 1.5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 9, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.label, marginBottom: 6, letterSpacing: 0.5 }}>OFFICIER D'ÉTAT CIVIL</Text>
                        <View style={{ height: 40, borderBottomWidth: 1, borderBottomStyle: 'dashed', borderBottomColor: S.muted, marginBottom: 10, justifyContent: 'center' }}>
                             <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: S.accent, fontStyle: 'italic', opacity: 0.8 }}>Certifié Digitalement</Text>
                        </View>
                        <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>ID AGENT {record.agentId}</Text>
                    </View>
                </View>

                {/* Blockchain Info */}
                <View style={{ backgroundColor: S.headerBg, padding: 16, borderTopWidth: 1, borderTopColor: S.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <MaterialCommunityIcons name="shield-check" size={16} color={S.accent} />
                        <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent, letterSpacing: 1 }}>
                            EMPREINTE BLOCKCHAIN (HASH)
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={{ fontSize: 9, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: S.label, opacity: 0.7 }}>
                        {record.txHash || record.hashDonnees}
                    </Text>
                </View>
            </View>

            {/* Actions */}
            <View style={{ marginTop: 32, gap: 14 }}>
                <PillButton 
                    title="Télécharger Certificat PDF" 
                    onPress={() => {}} 
                    icon={<MaterialCommunityIcons name="file-pdf-box" size={24} color="white" />}
                />
                <PillButton 
                    title="Partager l'acte numérique" 
                    variant="secondary"
                    onPress={() => {}} 
                    icon={<MaterialCommunityIcons name="share-variant-outline" size={22} color="#705d00" />}
                />
            </View>
        </AnimatedContainer>
      </ScrollView>
    </View>
  );
}

function DataRow({ label, value, secondValue }: any) {
    return (
        <View style={s.dataRow}>
            <View style={s.labelCell}>
                <Text style={s.labelText}>{label}</Text>
            </View>
            <View style={s.valueCell}>
                <Text style={s.valueText}>{value || '---'}</Text>
                {secondValue && <Text style={s.secondValueText}>{secondValue}</Text>}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    certContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e7e8e9',
        overflow: 'hidden',
        shadowColor: '#191c1d',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    country: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        letterSpacing: 2,
        color: '#191c1d',
        textAlign: 'center'
    },
    motto: {
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_400Regular',
        letterSpacing: 3,
        color: '#6d7a70',
        marginTop: 6,
        textAlign: 'center'
    },
    title: {
        fontSize: 22,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#191c1d',
        letterSpacing: 3,
        textAlign: 'center'
    },
    sectionHeader: {
        backgroundColor: '#f3f4f5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e7e8e9',
    },
    sectionHeaderText: {
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#191c1d',
        letterSpacing: 1.5,
    },
    subSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 6,
    },
    subSectionTitle: {
        fontSize: 9,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#006a40',
        letterSpacing: 1,
    },
    dataRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f5',
    },
    labelCell: {
        width: 110,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#f3f4f5',
    },
    labelText: {
        fontSize: 9,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#6d7a70',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    valueCell: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'center',
    },
    valueText: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#191c1d',
    },
    secondValueText: {
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#6d7a70',
        marginTop: 2,
        opacity: 0.8,
    },
});

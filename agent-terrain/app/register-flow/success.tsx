import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Download, UserPlus, ExternalLink } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../constants/Config';
import { generateCertificatePDF } from '../../utils/pdfGenerator';

const S = {
  bg: '#FAFAFA',
  white: '#ffffff',
  border: '#D1D5DB', // Slightly darker for certificate feel
  label: '#9eaaa1',
  text: '#191c1d',
  muted: '#6d7a70',
  accent: '#006a40',
  accentLight: '#EAF3EE',
};

export default function SuccessScreen() {
  const router = useRouter();
  const { id, offline } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [record, setRecord] = useState<any>(null);

  const handleDownload = async () => {
    if (!record) return;
    setGenerating(true);
    try {
        await generateCertificatePDF(record);
    } catch (error) {
        Alert.alert('Erreur', 'Impossible de générer le fichier PDF');
    } finally {
        setGenerating(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    
    const fetchRecord = async () => {
      try {
        if (offline === 'true') {
            // Load from local storage
            const pendingData = await AsyncStorage.getItem('@pending_registrations');
            if (pendingData) {
                const queue = JSON.parse(pendingData);
                const localRecord = queue.find((r: any) => r.idActe === id);
                if (localRecord) {
                    setRecord(localRecord);
                    setLoading(false);
                    return;
                }
            }
        }

        const response = await fetch(`${Config.API_BASE_URL}/naissances/${id}`, {
            headers: { 
              'ngrok-skip-browser-warning': 'true',
              'Bypass-Tunnel-Reminder': 'true'
            }
        });
        const result = await response.json();
        if (result.success) {
          setRecord(result.data);
        } else {
          Alert.alert('Erreur', 'Impossible de charger les détails de l\'acte');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, offline]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: S.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={S.accent} />
        <Text style={{ marginTop: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted }}>Génération du certificat...</Text>
      </View>
    );
  }

  const prefecture = (record?.lieuNaissance?.prefecture || 'N/A').toUpperCase();
  const sousPref   = (record?.lieuNaissance?.sousPrefecture || 'N/A').toUpperCase();
  const agent      = (record?.agentId?.identifier || record?.agentId || 'OFFICIER NAISSANCECHAIN').toUpperCase();
  const certNum    = `B${record?.idActe?.replace(/\D/g,'') || '0000000000'}`;

  return (
    <View style={{ flex: 1, backgroundColor: '#F0EFF5' }}>
      <StatusBar style="dark" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 70 }} showsVerticalScrollIndicator={false}>

        {/* Success header badge */}
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <CheckCircle size={30} color={S.accent} />
          </View>
          <Text style={{ fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#191c1d' }}>Enregistrement Réussi</Text>
          <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#6d7a70', marginTop: 3 }}>L'acte a été certifié sur la blockchain</Text>
        </View>

        {/* ═══ CERTIFICATE WITH OFFICIAL BACKGROUND ═══ */}
        <View style={cs.certContainer}>
          <View style={{ padding: 20, paddingTop: 18 }}>

            {/* Barcode + meta */}
            <View style={{ alignSelf: 'flex-end', alignItems: 'flex-end', marginBottom: 4 }}>
              <View style={{ width: 120, height: 14, backgroundColor: '#000', marginBottom: 3 }} />
              <Text style={cs.metaText}>Numéro de certificat : {certNum}</Text>
              <Text style={cs.metaText}>République de Guinée</Text>
            </View>

            {/* Titles */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text style={cs.titleMain}>Acte de Naissance</Text>
              <Text style={cs.titleCert}>Certificate of Birth</Text>
              <Text style={cs.titleActe}>Acte De Naissance</Text>
            </View>

            {/* Ville / Soussigné */}
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}>
                <Text style={cs.b}>Ville / Préfecture : {prefecture}</Text>
                <Text style={cs.b}>Commune : {sousPref}</Text>
              </View>
              <View style={[cs.cell, { alignItems: 'flex-end' }]}>
                <Text style={cs.b}>Je Soussigné : {agent}</Text>
              </View>
            </View>

            {/* ENFANT */}
            <SecHead title="ENFANT" />
            <FullRow label="Prénoms" value={record?.prenom} />
            <FullRow label="Nom" value={record?.nom} />
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}>
                <Text style={cs.l}>Lieu de naissance :</Text>
                <Text style={cs.l}>  Région : <Text style={cs.b}>{prefecture}</Text></Text>
                <Text style={cs.l}>  Préfecture : <Text style={cs.b}>{prefecture}</Text></Text>
                <Text style={cs.l}>  Sous-préf. : <Text style={cs.b}>{sousPref}</Text></Text>
              </View>
              <View style={cs.cell}>
                <Text style={cs.l}>Date et Heure de Naissance :</Text>
                <Text style={cs.b}>{record?.dateNaissance} {record?.heureNaissance || '--:--'}</Text>
              </View>
            </View>
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}>
                <Text style={cs.l}>Sexe : <Text style={cs.b}>{record?.sexe === 'M' ? 'MASCULIN' : 'FÉMININ'}</Text></Text>
              </View>
              <View style={cs.cell}>
                <Text style={cs.l}>Nationalité : <Text style={cs.b}>{record?.nationaliteEnfant || 'GUINÉENNE'}</Text></Text>
              </View>
            </View>

            {/* PÈRE */}
            <SecHead title="PÈRE" />
            <FullRow label="Nom" value={record?.pere?.nom || 'NON DÉCLARÉ'} />
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Date naissance : {record?.pere?.dateNaissance || 'N/A'}</Text></View>
              <View style={cs.cell}><Text style={cs.l}>CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</Text></View>
            </View>
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Numéro d'identification : NA</Text></View>
              <View style={cs.cell} />
            </View>
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Nationalité : GUINÉENNE</Text></View>
              <View style={cs.cell}><Text style={cs.l}>Profession : <Text style={cs.b}>{record?.pere?.profession || 'N/A'}</Text></Text></View>
            </View>

            {/* MÈRE */}
            <SecHead title="MÈRE" />
            <FullRow label="Nom" value={record?.mere?.nom || 'NON DÉCLARÉ'} />
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Date naissance : {record?.mere?.dateNaissance || 'N/A'}</Text></View>
              <View style={cs.cell}><Text style={cs.l}>CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</Text></View>
            </View>
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Numéro d'identification : NA</Text></View>
              <View style={cs.cell} />
            </View>
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Nationalité : GUINÉENNE</Text></View>
              <View style={cs.cell}><Text style={cs.l}>Profession : <Text style={cs.b}>{record?.mere?.profession || 'N/A'}</Text></Text></View>
            </View>

            {/* DÉCLARANT */}
            <SecHead title="DÉCLARANT" />
            <FullRow label="Nom" value={record?.declarant?.nom || record?.pere?.nom || 'N/A'} />
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Numéro d'identification : NA</Text></View>
              <View style={cs.cell}><Text style={cs.l}>CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</Text></View>
            </View>
            <View style={cs.twoCol}>
              <View style={[cs.cell, cs.borderR]}><Text style={cs.l}>Lien de Parenté : <Text style={cs.b}>{record?.declarant?.lien || 'PÈRE'}</Text></Text></View>
              <View style={cs.cell} />
            </View>

            {/* APPROUVÉ PAR */}
            <SecHead title="APPROUVÉ PAR" />
            <View style={[cs.twoCol, { height: 28 }]}><View style={[cs.cell, { flex: 1 }]} /></View>

            {/* Footer */}
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 9, color: '#111', lineHeight: 16 }}>Dressé le : {new Date().toLocaleDateString('fr-FR')}</Text>
              <Text style={{ fontSize: 9, color: '#111', marginBottom: 10 }}>Officier de l'Etat Civil Délégué</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 10 }}>
                <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#1a3a6e', fontWeight: '600' }}>~Certifié~</Text>
                <View style={{ alignItems: 'center', gap: 3 }}>
                  {record?.qrCode
                    ? <Image source={{ uri: record.qrCode }} style={{ width: 64, height: 64, borderWidth: 1, borderColor: '#777' }} resizeMode="contain" />
                    : <View style={{ width: 64, height: 64, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#999' }}>
                        <Text style={{ fontSize: 10, color: '#555', fontWeight: '700' }}>QR</Text>
                      </View>
                  }
                  <Text style={{ fontSize: 7, fontFamily: 'monospace', color: '#333' }}>{record?.idActe}</Text>
                </View>
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.2)', marginTop: 8, paddingTop: 5 }}>
                <Text style={{ fontSize: 7, fontWeight: '700', color: record?.isOffline ? '#92400e' : '#006a40' }}>
                  {record?.isOffline ? '⚠ EN ATTENTE DE SYNCHRONISATION' : '✓ CERTIFIÉ NAISSANCECHAIN | BLOCKCHAIN SEPOLIA'}
                </Text>
                <Text numberOfLines={2} style={{ fontSize: 7, color: '#555', marginTop: 2, fontFamily: 'monospace' }}>
                  {record?.txHash || (record?.isOffline ? 'En attente de connexion réseau...' : 'Certifiant sur le réseau...')}
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* Actions */}
        <View style={{ marginTop: 18, gap: 12 }}>
          <TouchableOpacity
            onPress={handleDownload}
            disabled={generating}
            style={{ ...actionBtn, backgroundColor: S.accent, opacity: generating ? 0.7 : 1 }}
          >
            {generating ? <ActivityIndicator color="white" size="small" /> : <Download size={18} color="white" />}
            <Text style={actionBtnText}>{generating ? 'Génération du PDF...' : 'Télécharger le certificat'}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/register')} style={{ ...actionBtn, flex: 1, backgroundColor: S.white, borderWidth: 1, borderColor: S.border }}>
              <UserPlus size={18} color={S.text} />
              <Text style={{ ...actionBtnText, color: S.text }}>Nouveau</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ ...actionBtn, flex: 1, backgroundColor: S.white, borderWidth: 1, borderColor: S.border }}>
              <ExternalLink size={18} color={S.text} />
              <Text style={{ ...actionBtnText, color: S.text }}>Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}


// ─── Shared Certificate Components ───
function SecHead({ title }: { title: string }) {
  return (
    <View style={cs.secHead}>
      <Text style={cs.secHeadText}>{title}</Text>
    </View>
  );
}

function FullRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={cs.fullRow}>
      <Text style={cs.l}>{label} : <Text style={cs.b}>{value || '---'}</Text></Text>
    </View>
  );
}

// ─── Certificate StyleSheet ───
const cs = StyleSheet.create({
  metaText: { fontSize: 8, color: '#111', textAlign: 'right', lineHeight: 12 },
  titleMain: { fontSize: 20, fontStyle: 'italic', fontWeight: '700', color: '#111' },
  titleCert: { fontSize: 10, fontStyle: 'italic', color: '#444' },
  titleActe: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#000', marginTop: 2 },

  // Certificate container
  certContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cell: { flex: 1, padding: 4 },
  borderR: { borderRightWidth: 1, borderColor: '#555' },
  twoCol: {
    flexDirection: 'row',
    borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1,
    borderColor: '#555',
    backgroundColor: '#fff',
  },
  fullRow: {
    borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1,
    borderColor: '#555',
    backgroundColor: '#fff',
    padding: 4,
  },
  secHead: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1, borderColor: '#555',
    paddingVertical: 4, alignItems: 'center',
  },
  secHeadText: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: '#000' },
  l: { fontSize: 9, color: '#333', lineHeight: 13 },
  b: { fontSize: 9, fontWeight: '700', color: '#000' },
});

const actionBtn: any = {
  height: 52,
  borderRadius: 14,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
};

const actionBtnText: any = {
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_700Bold',
  color: 'white',
};

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, StyleSheet, Share, Image, ImageBackground
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, FileDown, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateCertificatePDF } from '../../utils/pdfGenerator';
import Config from '../../constants/Config';

export default function VerificationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchRecord(); }, [id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${Config.API_BASE_URL}/naissances/verify/${id}`, {
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Bypass-Tunnel-Reminder': 'true',
        },
      });
      const result = await res.json();
      if (result.success && result.valide) {
        setRecord(result.data);
      } else {
        Alert.alert('Erreur', result.message || 'Impossible de vérifier cet acte.');
        router.back();
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de joindre la blockchain.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!record) return;
    setGenerating(true);
    try { await generateCertificatePDF(record); }
    catch { Alert.alert('Erreur', 'Impossible de générer le PDF.'); }
    finally { setGenerating(false); }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✓ NaissanceChain — Acte N°${record?.idActe} (${record?.prenom} ${record?.nom}) certifié authentique sur la Blockchain Nationale Guinéenne.`,
      });
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <View style={s.loadingBox}>
        <ActivityIndicator size="large" color="#006a40" />
        <Text style={s.loadingText}>Vérification blockchain en cours...</Text>
      </View>
    );
  }

  if (!record) return null;

  const prefecture = (record.lieuNaissance?.prefecture || 'N/A').toUpperCase();
  const sousPref   = (record.lieuNaissance?.sousPrefecture || 'N/A').toUpperCase();
  const agent      = (record.agentId?.identifier || record.agentId || 'OFFICIER NAISSANCECHAIN').toUpperCase();
  const certNum    = `B${record.idActe?.replace(/\D/g,'') || '0000000000'}`;

  return (
    <View style={s.root}>
      {/* ─── Top Navigation Bar ─── */}
      <SafeAreaView style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={s.topTitle}>Vérification Officielle</Text>
        <View style={{ width: 36 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════
            CERTIFICATE — image as background
        ═══════════════════════════════════════ */}
        <View style={s.certContainer}>
          <View style={s.certOverlay}>

            {/* ── Barcode + N° Certificat (top right) ── */}
            <View style={s.topMeta}>
              <View style={s.barcode} />
              <Text style={s.metaText}>Numéro de certificat : {certNum}</Text>
              <Text style={s.metaText}>République de Guinée</Text>
            </View>

            {/* ── Titles ── */}
            <View style={s.titlesBlock}>
              <Text style={s.titleMain}>Acte de Naissance</Text>
              <Text style={s.titleCert}>Certificate of Birth</Text>
              <Text style={s.titleActe}>Acte De Naissance</Text>
            </View>

            {/* ─────────── TABLE ─────────── */}

            {/* Ville / Je soussigné */}
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.bold}>Ville / Préfecture : {prefecture}</Text>
                <Text style={s.bold}>Commune : {sousPref}</Text>
              </View>
              <View style={[s.colCell, { alignItems: 'flex-end' }]}>
                <Text style={s.bold}>Je Soussigné : {agent}</Text>
              </View>
            </View>

            {/* ENFANT */}
            <SecHead title="ENFANT" />
            <FullRow label="Prénoms" value={record.prenom} />
            <FullRow label="Nom" value={record.nom} />
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Lieu de naissance :</Text>
                <Text style={s.lbl}>  Région de : <Text style={s.bold}>{prefecture}</Text></Text>
                <Text style={s.lbl}>  Préfecture : <Text style={s.bold}>{prefecture}</Text></Text>
                <Text style={s.lbl}>  Sous-préf. : <Text style={s.bold}>{sousPref}</Text></Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>Date et Heure de Naissance :</Text>
                <Text style={s.bold}>{record.dateNaissance} {record.heureNaissance || '--:--'}</Text>
              </View>
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Sexe : <Text style={s.bold}>{record.sexe === 'M' ? 'MASCULIN' : 'FÉMININ'}</Text></Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>Nationalité : <Text style={s.bold}>{record.nationaliteEnfant || 'GUINÉENNE'}</Text></Text>
              </View>
            </View>

            {/* PÈRE */}
            <SecHead title="PÈRE" />
            <FullRow label="Nom" value={record.pere?.nom || 'NON DÉCLARÉ'} />
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Date de naissance : {record.pere?.dateNaissance || 'N/A'}</Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</Text>
              </View>
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Numéro d'identification : NA</Text>
              </View>
              <View style={s.colCell} />
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Nationalité : GUINÉENNE</Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>Profession : <Text style={s.bold}>{record.pere?.profession || 'N/A'}</Text></Text>
              </View>
            </View>

            {/* MÈRE */}
            <SecHead title="MÈRE" />
            <FullRow label="Nom" value={record.mere?.nom || 'NON DÉCLARÉ'} />
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Date de naissance : {record.mere?.dateNaissance || 'N/A'}</Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</Text>
              </View>
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Numéro d'identification : NA</Text>
              </View>
              <View style={s.colCell} />
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Nationalité : GUINÉENNE</Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>Profession : <Text style={s.bold}>{record.mere?.profession || 'N/A'}</Text></Text>
              </View>
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Adresses du parent :</Text>
                <Text style={s.lbl}>  Région de : <Text style={s.bold}>{prefecture}</Text></Text>
                <Text style={s.lbl}>  Préfecture : <Text style={s.bold}>{prefecture}</Text></Text>
                <Text style={s.lbl}>  Sous-préf. : <Text style={s.bold}>{sousPref}</Text></Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>Quartier/District : N/A</Text>
                <Text style={s.lbl}>Secteur/Village : N/A</Text>
              </View>
            </View>

            {/* DÉCLARANT */}
            <SecHead title="DÉCLARANT" />
            <FullRow label="Nom" value={record.declarant?.nom || record.pere?.nom || 'N/A'} />
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Numéro d'identification : NA</Text>
              </View>
              <View style={s.colCell}>
                <Text style={s.lbl}>CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</Text>
              </View>
            </View>
            <View style={s.twoCol}>
              <View style={[s.colCell, s.borderRight]}>
                <Text style={s.lbl}>Lien de Parenté : <Text style={s.bold}>{record.declarant?.lien || 'PÈRE'}</Text></Text>
              </View>
              <View style={s.colCell} />
            </View>

            {/* APPROUVÉ PAR */}
            <SecHead title="APPROUVÉ PAR" />
            <View style={[s.twoCol, { height: 28 }]}>
              <View style={[s.colCell, { flex: 1 }]} />
            </View>

            {/* ─────────── FOOTER ─────────── */}
            <View style={s.footer}>
              <Text style={s.footerText}>Dressé le : {new Date().toLocaleDateString('fr-FR')}</Text>
              <Text style={s.footerText}>Officier de l'Etat Civil Délégué</Text>

              <View style={s.stampsRow}>
                {/* Signature */}
                <Text style={s.sigText}>~Certifié~</Text>

                {/* QR Code */}
                <View style={s.qrArea}>
                  {record.qrCode
                    ? <Image source={{ uri: record.qrCode }} style={s.qrImg} resizeMode="contain" />
                    : <View style={s.qrPlaceholder}><Text style={s.qrPlaceholderText}>QR</Text></View>
                  }
                  <Text style={s.qrNum}>{record.idActe}</Text>
                </View>
              </View>

              {/* Blockchain hash */}
              <View style={s.hashBox}>
                <Text style={s.hashLabel}>✓ CERTIFIÉ NAISSANCECHAIN | BLOCKCHAIN SEPOLIA</Text>
                <Text style={s.hashValue} numberOfLines={2}>
                  {record.txHash || record.hashDonnees || 'En attente de certification...'}
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* ─── Action Buttons ─── */}
        <View style={s.actions}>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: '#006a40', opacity: generating ? 0.7 : 1 }]}
            onPress={handleDownloadPDF}
            disabled={generating}
          >
            {generating
              ? <ActivityIndicator color="#fff" size="small" />
              : <FileDown size={18} color="#fff" />}
            <Text style={s.btnText}>
              {generating ? 'Génération PDF...' : "Télécharger l'Extrait (PDF)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#EFEFEF' }]}
            onPress={handleShare}
          >
            <Share2 size={18} color="#191c1d" />
            <Text style={[s.btnText, { color: '#191c1d' }]}>Partager la vérification</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Small Components ───
function SecHead({ title }: { title: string }) {
  return (
    <View style={s.secHead}>
      <Text style={s.secHeadText}>{title}</Text>
    </View>
  );
}

function FullRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.fullRow}>
      <Text style={s.lbl}>{label} : <Text style={s.bold}>{value || '---'}</Text></Text>
    </View>
  );
}

// ─── Styles ───
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0EFF5' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
  loadingText: { marginTop: 12, color: '#6d7a70', fontSize: 13 },

  topBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 6 },
  topTitle: { fontSize: 15, fontWeight: '700', color: '#191c1d' },

  scroll: { padding: 14, paddingBottom: 60 },

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

  // Semi-transparent content overlay
  certOverlay: {
    padding: 20,
    paddingTop: 18,
  },

  // Barcode top-right
  topMeta: { alignSelf: 'flex-end', alignItems: 'flex-end', marginBottom: 4 },
  barcode: {
    width: 120,
    height: 14,
    backgroundColor: '#000',
    marginBottom: 3,
  },
  metaText: { fontSize: 8, color: '#111', textAlign: 'right', lineHeight: 12 },

  // Titles
  titlesBlock: { alignItems: 'center', marginBottom: 10 },
  titleMain: { fontSize: 22, fontStyle: 'italic', fontWeight: '700', color: '#111', fontVariant: ['small-caps'] },
  titleCert: { fontSize: 10, fontStyle: 'italic', color: '#444' },
  titleActe: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#000', marginTop: 2 },

  // Table rows
  twoCol: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#555',
    backgroundColor: '#fff',
  },
  colCell: { flex: 1, padding: 4 },
  borderRight: { borderRightWidth: 1, borderColor: '#555' },

  fullRow: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#555',
    backgroundColor: '#fff',
    padding: 4,
  },

  secHead: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#555',
    paddingVertical: 4,
    alignItems: 'center',
  },
  secHeadText: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: '#000' },

  lbl: { fontSize: 9, color: '#333', lineHeight: 13 },
  bold: { fontSize: 9, fontWeight: '700', color: '#000' },

  // Footer
  footer: { marginTop: 10, paddingTop: 6 },
  footerText: { fontSize: 9, color: '#111', lineHeight: 16 },

  stampsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingRight: 10,
  },

  sigText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#1a3a6e',
    fontWeight: '600',
  },

  qrArea: { alignItems: 'center', gap: 3 },
  qrImg: { width: 64, height: 64, borderWidth: 1, borderColor: '#777' },
  qrPlaceholder: {
    width: 64, height: 64,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  qrPlaceholderText: { fontSize: 10, color: '#555', fontWeight: '700' },
  qrNum: { fontSize: 7, fontFamily: 'monospace', color: '#333', textAlign: 'center' },

  hashBox: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.2)', marginTop: 8, paddingTop: 5 },
  hashLabel: { fontSize: 7, fontWeight: '700', color: '#006a40', letterSpacing: 0.5 },
  hashValue: { fontSize: 7, color: '#555', marginTop: 2, fontFamily: 'monospace' },

  // Action buttons
  actions: { marginTop: 18, gap: 12 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 10,
  },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

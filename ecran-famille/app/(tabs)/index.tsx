import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import { FamilyService, FamilyMember } from '../../services/FamilyService';
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

export default function DashboardScreen() {
  const router = useRouter();
  const { parent } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  const loadMembers = async () => {
    const data = await FamilyService.getMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMembers();
    setRefreshing(false);
  }, []);

  const getRelationLabel = (relation: string) => {
    switch (relation) {
        case 'enfant': return 'ENFANT';
        case 'moi': return 'MOI';
        case 'conjoint': return 'CONJOINT';
        default: return 'FAMILLE';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      {/* Header Identique */}
      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
              Bienvenue,
            </Text>
            <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
              {parent ? parent.name : 'Chargement...'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: S.accentLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: S.accent }} />
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
              Compte Actif
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[S.accent]} />
        }
      >
        {/* Stats Section */}
        <View style={{ flexDirection: 'row', gap: 12, padding: 20 }}>
          <View style={{ flex: 1, backgroundColor: S.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: S.border }}>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              Famille
            </Text>
            <Text style={{ fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent }}>
                {loading ? '...' : members.length}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
              actes liés
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: S.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: S.border }}>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              Certification
            </Text>
            <Text style={{ fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent }}>
                100%
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
              Blockchain
            </Text>
          </View>
        </View>

        {/* CTA Principal */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <TouchableOpacity
            onPress={() => router.push('/scan')}
            activeOpacity={0.85}
            style={{
              backgroundColor: S.accent, borderRadius: 16, padding: 20,
              flexDirection: 'row', alignItems: 'center', gap: 14,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
                Lier un nouvel acte
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                Scannez ou saisissez un numéro d'acte
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Membres de la famille (Réel) */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
              Membres de la famille
            </Text>
          </View>

          <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden' }}>
            {loading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator color={S.accent} />
                </View>
            ) : members.length > 0 ? (
                members.map((member, index) => (
                    <TouchableOpacity
                        key={member.idActe}
                        onPress={() => router.push(`/child/${member.idActe}`)}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14,
                            borderBottomWidth: index === members.length - 1 ? 0 : 1, borderBottomColor: S.border,
                        }}
                    >
                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: S.accentLight, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
                                {member.prenom[0]}{member.nom[0]}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
                                    {member.prenom} {member.nom}
                                </Text>
                                <View style={{ backgroundColor: S.bg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: S.border }}>
                                    <Text style={{ fontSize: 8, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.muted }}>
                                        {getRelationLabel(member.relation)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
                                {member.idActe}
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={S.border} />
                    </TouchableOpacity>
                ))
            ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <MaterialCommunityIcons name="family-tree" size={48} color={S.border} style={{ marginBottom: 12 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, textAlign: 'center' }}>
                        Aucun acte n'est lié. Scannez un QR code pour commencer.
                    </Text>
                </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
            onPress={() => router.push('/manual-entry')}
            style={{ alignSelf: 'center', marginTop: 24, padding: 10 }}
        >
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
                Saisie manuelle du numéro d'acte
            </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

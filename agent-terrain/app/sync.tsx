import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, ArrowLeft, CloudUpload, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../constants/Config';

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

const PENDING_STORAGE_KEY = '@pending_registrations';

export default function SyncScreen() {
  const router = useRouter();
  const [pendingRecords, setPendingRecords] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState<{ success: number, failed: number }>({ success: 0, failed: 0 });

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const data = await AsyncStorage.getItem(PENDING_STORAGE_KEY);
      if (data) setPendingRecords(JSON.parse(data));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncAll = async () => {
    if (pendingRecords.length === 0) return;
    
    setSyncing(true);
    let successCount = 0;
    let failedCount = 0;
    const remaining: any[] = [];

    for (const record of pendingRecords) {
      try {
        // Remove offline-specific keys before sending
        const { isOffline, idActe, createdAt, ...payload } = record;
        
        const response = await fetch(`${Config.API_BASE_URL}/naissances`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Bypass-Tunnel-Reminder': 'true'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
          successCount++;
        } else {
          failedCount++;
          remaining.push(record);
        }
      } catch (error) {
        failedCount++;
        remaining.push(record);
      }
    }

    // Update Storage
    await AsyncStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(remaining));
    setPendingRecords(remaining);
    setSyncing(false);
    setResults({ success: successCount, failed: failedCount });

    if (failedCount === 0) {
      Alert.alert('Succès', `${successCount} actes ont été synchronisés avec succès.`);
    } else {
      Alert.alert('Synchronisation partielle', `${successCount} réussis, ${failedCount} en échec. Vérifiez votre connexion.`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 20, height: 60, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} color={S.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            Synchronisation
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Stats */}
        <View style={{ backgroundColor: S.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: S.border, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, textTransform: 'uppercase', letterSpacing: 1 }}>En attente</Text>
                    <Text style={{ fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.text, marginTop: 4 }}>
                        {pendingRecords.length}
                    </Text>
                </View>
                <CloudUpload size={40} color={S.accent} strokeWidth={1.5} />
            </View>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 8 }}>
                Actes enregistrés localement sur cet appareil.
            </Text>
        </View>

        {/* Action Button */}
        {pendingRecords.length > 0 && (
            <TouchableOpacity 
                onPress={handleSyncAll}
                disabled={syncing}
                style={{ height: 56, backgroundColor: S.accent, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28 }}
            >
                {syncing ? <ActivityIndicator color="white" /> : <RefreshCw size={20} color="white" />}
                <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
                    {syncing ? 'Synchronisation...' : 'Synchroniser tout'}
                </Text>
            </TouchableOpacity>
        )}

        {/* Records List */}
        <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: S.text, marginBottom: 12 }}>
            File d'attente
        </Text>

        {pendingRecords.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                <CheckCircle size={48} color={S.accent} strokeWidth={1} style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>Tout est à jour</Text>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 4, textAlign: 'center' }}>
                    Aucun acte en attente de synchronisation.
                </Text>
            </View>
        ) : (
            <View style={{ gap: 12 }}>
                {pendingRecords.map((item, index) => (
                    <View key={item.idActe} style={{ backgroundColor: S.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: S.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={20} color="#92400e" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>{item.prenom} {item.nom}</Text>
                            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
                                {item.lieuNaissance.sousPrefecture} · Local ID: {item.idActe.split('-').pop()}
                            </Text>
                        </View>
                        <ChevronRight size={16} color={S.border} />
                    </View>
                ))}
            </View>
        )}

      </ScrollView>
    </View>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, CheckCircle2, Clock, CloudUpload } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../constants/Config';
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
  warning: '#92400e',
  warningBg: '#fffbeb',
};

const STORAGE_KEYS = {
    PENDING: '@pending_registrations',
    DASHBOARD: '@dashboard_cache', // Contient { stats: { totalCount } }
    LAST_SYNC: '@last_sync_time'
};

export default function SyncScreen() {
  const { agent } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState({ synced: 0, pending: 0 });
  const [lastSync, setLastSync] = useState<string | null>(null);

  const loadLocalData = useCallback(async () => {
    try {
        const [pendingData, dashData, lastTime] = await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.PENDING),
            AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD),
            AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC)
        ]);

        const pending = pendingData ? JSON.parse(pendingData) : [];
        const dash = dashData ? JSON.parse(dashData) : { stats: { totalCount: 0 } };

        setStats({
            synced: dash.stats?.totalCount || 0,
            pending: pending.length
        });
        setLastSync(lastTime);
    } catch (e) {
        console.error('Erreur chargement synchro:', e);
    }
  }, []);

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);

    try {
        const pendingData = await AsyncStorage.getItem(STORAGE_KEYS.PENDING);
        const pendingQueue = pendingData ? JSON.parse(pendingData) : [];

        if (pendingQueue.length === 0) {
            Alert.alert('Info', 'Toutes les données sont déjà synchronisées.');
            setSyncing(false);
            return;
        }

        let successCount = 0;
        let failedQueue = [];

        // Tentative de synchro de chaque item
        for (const record of pendingQueue) {
            try {
                // On retire les champs locaux auto-générés pour le backend
                const { idActe, isOffline, createdAt, ...payload } = record;
                
                const response = await fetch(`${Config.API_BASE_URL}/naissances`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Bypass-Tunnel-Reminder': 'true'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.success) {
                    successCount++;
                } else {
                    failedQueue.push(record);
                }
            } catch (err) {
                console.error('Sync failed for item:', err);
                failedQueue.push(record);
            }
        }

        // Mettre à jour le stockage local
        await AsyncStorage.setItem(STORAGE_KEYS.PENDING, JSON.stringify(failedQueue));
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        const lastSyncLabel = `${dateStr} · ${timeStr}`;
        
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastSyncLabel);
        setLastSync(lastSyncLabel);

        // Recharger les stats (on pourrait aussi refetch le dashboard ici)
        await loadLocalData();

        if (failedQueue.length === 0) {
            Alert.alert('Succès', `${successCount} enregistrement(s) synchronisé(s) avec succès.`);
        } else {
            Alert.alert('Attention', `${successCount} synchronisé(s), ${failedQueue.length} échec(s). Vérifiez votre connexion.`);
        }

    } catch (error) {
        console.error('Erreur globale synchro:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de la synchronisation.');
    } finally {
        setSyncing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            Synchronisation
          </Text>
          <CloudUpload size={20} color={S.muted} strokeWidth={1.8} />
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* État global */}
        <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: S.accentLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <RefreshCw size={28} color={S.accent} strokeWidth={1.8} />
          </View>
          <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
            Dernière sync
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 4 }}>
            {lastSync ? lastSync : 'Jamais synchronisé'}
          </Text>
        </View>

        {/* Statut des modules */}
        <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden', marginBottom: 20 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
              État des données
            </Text>
          </View>
          <SyncRow 
            icon={<CheckCircle2 size={18} color={S.accent} strokeWidth={1.8} />} 
            label="Registres Naissances" 
            count={stats.synced.toString()} 
            status="À jour" 
            ok={true} 
            last={false} 
          />
          <SyncRow 
            icon={<Clock size={18} color={stats.pending > 0 ? "#92400e" : S.muted} strokeWidth={1.8} />} 
            label="En attente" 
            count={stats.pending.toString()} 
            status={stats.pending > 0 ? "Synchronisation requise" : "Vide"} 
            ok={stats.pending === 0} 
            last={true} 
          />
        </View>

        {/* Bouton */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={syncing}
          onPress={handleSync}
          style={{
            height: 52, borderRadius: 14, backgroundColor: syncing ? S.muted : S.accent,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
        >
          {syncing && <ActivityIndicator color="white" />}
          <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
            {syncing ? 'Synchronisation...' : 'Lancer la synchronisation'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function SyncRow({ icon, label, count, status, ok, last }: any) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 14,
      borderTopWidth: 1, borderTopColor: S.border,
    }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: ok ? S.accentLight : '#fffbeb', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>{label}</Text>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>{count} éléments</Text>
      </View>
      <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: ok ? S.accent : '#92400e' }}>
        {status}
      </Text>
    </View>
  );
}

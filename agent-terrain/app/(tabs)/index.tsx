import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Baby, Wifi, WifiOff, PlusCircle, ChevronRight, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
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
  warning: '#92400e',
  warningBg: '#fffbeb',
};

const CACHE_KEY = '@dashboard_cache';

export default function DashboardScreen() {
  const router = useRouter();
  const { agent } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalCount: 0, pendingCount: 0 });
  const [recentRecords, setRecentRecords] = useState([]);
  const [pendingLocal, setPendingLocal] = useState([]);

  // Load cache and local pending on mount
  useEffect(() => {
    const loadCache = async () => {
        try {
            // Load dashboard cache
            const cachedData = await AsyncStorage.getItem(CACHE_KEY);
            let initialRecords: any[] = [];
            let initialStats = { totalCount: 0, pendingCount: 0 };
            
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                initialStats = parsed.stats;
                initialRecords = parsed.records;
            }

            // Load local pending registrations
            const pendingData = await AsyncStorage.getItem('@pending_registrations');
            const localPending = pendingData ? JSON.parse(pendingData) : [];
            setPendingLocal(localPending);

            // Merge stats and records
            setStats({
                totalCount: initialStats.totalCount + localPending.length,
                pendingCount: initialStats.pendingCount + localPending.length
            });
            setRecentRecords([...localPending, ...initialRecords].slice(0, 5));
            
            setLoading(false);
        } catch (e) {
            console.error('Erreur chargement cache:', e);
        }
    };
    loadCache();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!agent?._id) return;
    
    try {
      // Fetch local pending first to merge
      const pendingData = await AsyncStorage.getItem('@pending_registrations');
      const localPending = pendingData ? JSON.parse(pendingData) : [];
      setPendingLocal(localPending);

      const response = await fetch(`${Config.API_BASE_URL}/naissances/stats/${agent._id}`, {
        headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Bypass-Tunnel-Reminder': 'true'
        }
      });
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Raw response from server:', responseText);
        throw jsonError;
      }
      
      if (result.success) {
        const serverStats = {
          totalCount: result.data.totalCount,
          pendingCount: result.data.pendingCount
        };
        const serverRecords = result.data.recentRecords;

        // Merge with local
        const mergedStats = {
            totalCount: serverStats.totalCount + localPending.length,
            pendingCount: serverStats.pendingCount + localPending.length
        };
        const mergedRecords = [...localPending, ...serverRecords].slice(0, 5);

        setStats(mergedStats);
        setRecentRecords(mergedRecords);

        // Save server part to cache
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
            stats: serverStats,
            records: serverRecords,
            timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [agent?._id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Aujourd'hui, ${time}`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + `, ${time}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: S.bg }}>
      <StatusBar style="dark" />

      {/* Header */}
      <SafeAreaView style={{ backgroundColor: S.white, borderBottomWidth: 1, borderBottomColor: S.border }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: S.label, letterSpacing: 1, textTransform: 'uppercase' }}>
              Bonjour,
            </Text>
            <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
              {agent ? agent.name : 'Chargement...'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: S.accentLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: S.accent }} />
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
              En ligne
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

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, padding: 20 }}>
          <View style={{ flex: 1, backgroundColor: S.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: S.border }}>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              Total
            </Text>
            <Text style={{ fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: S.accent }}>
                {loading ? '...' : stats.totalCount}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
              naissances
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: S.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: S.border }}>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: S.label, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              En attente
            </Text>
            <Text style={{ fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#92400e' }}>
                {loading ? '...' : stats.pendingCount}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
              à synchroniser
            </Text>
          </View>
        </View>

        {/* CTA Principal */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/register')}
            activeOpacity={0.85}
            style={{
              backgroundColor: S.accent, borderRadius: 16, padding: 20,
              flexDirection: 'row', alignItems: 'center', gap: 14,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Baby size={22} color="white" strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
                Enregistrer une naissance
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                {agent ? `${agent.prefecture} · ${agent.establishment}` : 'Chargement...'}
              </Text>
            </View>
            <ChevronRight size={20} color="rgba(255,255,255,0.7)" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Derniers enregistrements */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>
              Récents
            </Text>
            <TouchableOpacity onPress={() => router.push('/sync')}>
              <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: S.accent }}>
                Gérer la synchronisation
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: S.white, borderRadius: 16, borderWidth: 1, borderColor: S.border, overflow: 'hidden' }}>
            {loading && !refreshing ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator color={S.accent} />
                </View>
            ) : recentRecords.length > 0 ? (
                recentRecords.map((item: any, index: number) => (
                    <RegistrationItem 
                        key={item._id || item.idActe}
                        idActe={item.idActe}
                        name={`${item.prenom} ${item.nom}`} 
                        time={formatTime(item.createdAt)} 
                        location={item.lieuNaissance} 
                        sync={item.isOffline ? false : item.blockchainValidated} 
                        last={index === recentRecords.length - 1} 
                        onPress={() => item.idActe ? router.push(`/verify/${item.idActe}`) : Alert.alert('Attente de Synchronisation', 'Cet acte n\'est pas encore validé sur la blockchain.')}
                    />
                ))
            ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted }}>
                        Aucun enregistrement trouvé
                    </Text>
                </View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function RegistrationItem({ idActe, name, time, location, sync, last, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14,
        borderBottomWidth: last ? 0 : 1, borderBottomColor: S.border,
      }}
    >
      <View style={{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: sync ? S.accentLight : '#fffbeb',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: sync ? S.accent : '#92400e' }}>
          {name.split(' ').filter(Boolean).map((n: string) => n[0]).join('')}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: S.text }}>{name}</Text>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: S.muted, marginTop: 2 }}>
          {time} · {typeof location === 'object' ? `${location.sousPrefecture}, ${location.prefecture}` : location}
        </Text>
      </View>
      {sync
        ? <Wifi size={16} color={S.accent} strokeWidth={1.8} />
        : <RefreshCw size={16} color="#92400e" strokeWidth={1.8} />
      }
    </TouchableOpacity>
  );
}

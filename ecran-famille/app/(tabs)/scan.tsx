import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, ScrollView, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { PillButton } from '@/components/ui/pill-button';
import { RelationSelector } from '@/components/features/search/relation-selector';
import { FamilyService } from '@/services/FamilyService';
import Config from '@/constants/Config';
import * as Device from 'expo-device';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isSimulator, setIsSimulator] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [detectedId, setDetectedId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setIsSimulator(!Device.isDevice);
  }, []);

  if (!permission) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#006a40" />
        <Text className="mt-4 font-jakarta text-on-surface-variant uppercase text-[10px] tracking-widest">Chargement...</Text>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    let extractedId = data;
    if (data.includes('/')) {
        const parts = data.split('/');
        extractedId = parts[parts.length - 1];
    }

    setDetectedId(extractedId);
    setShowSelector(true);
  };

  const handleRelationSelect = async (relation: string) => {
    if (!detectedId) return;
    
    setFetching(true);
    try {
      // Fetch basic info to save name on dashboard
      const response = await fetch(`${Config.API_BASE_URL}/naissances/${detectedId}`, {
        headers: { 'Bypass-Tunnel-Reminder': 'true' }
      });
      const result = await response.json();

      if (result.success) {
        const record = result.data;
        await FamilyService.addMember({
          idActe: detectedId,
          relation,
          prenom: record.prenom,
          nom: record.nom,
          dateNaissance: record.dateNaissance,
          addedAt: new Date().toISOString()
        });
        
        setShowSelector(false);
        router.push(`/child/${detectedId}`);
      } else {
        Alert.alert('Erreur', 'Acte non trouvé sur le serveur.');
        setScanned(false);
        setShowSelector(false);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Connexion au serveur impossible.');
      setScanned(false);
      setShowSelector(false);
    } finally {
      setFetching(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 120, paddingHorizontal: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedContainer delay={100} className="items-center w-full">
            <View className="bg-primary/5 p-8 rounded-full mb-8 shadow-soft border border-emerald-50">
                <MaterialCommunityIcons name="qrcode-scan" size={64} color="#006a40" />
            </View>
            
            <Text className="text-3xl font-jakarta-extrabold text-on-surface text-center mb-4 tracking-tight">
                Authentification
            </Text>
            
            <Text className="text-base font-jakarta text-on-surface-variant text-center opacity-70 leading-relaxed mb-10 px-4">
                {permission.granted 
                    ? "Positionnez l'acte au centre du cadre pour une lecture sécurisée." 
                    : "L'autorisation de la caméra est nécessaire pour scanner les documents."
                }
            </Text>

            <View 
                className="w-full max-w-[320px] rounded-[3rem] items-center justify-center relative bg-black/5 mb-10 overflow-hidden shadow-ambient"
                style={{ height: 320, width: 320 }}
            >
                {permission.granted ? (
                    <>
                        <CameraView
                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                            barcodeScannerSettings={{
                                barcodeTypes: ["qr", "pdf417", "code128", "code39", "ean13"],
                            }}
                            style={StyleSheet.absoluteFill}
                            facing="back"
                        />
                        {isSimulator && (
                            <View className="absolute inset-0 bg-black/60 items-center justify-center p-6">
                                <MaterialCommunityIcons name="cellphone-remove" size={48} color="white" />
                                <Text className="text-white text-center mt-4 font-jakarta-bold">
                                    Utilisez un appareil physique pour tester le scanner.
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View className="items-center px-12">
                        <MaterialCommunityIcons name="camera-off" size={64} color="#006a4020" />
                        <Text className="text-center mt-6 text-sm font-jakarta-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
                            Scanner inactif
                        </Text>
                    </View>
                )}
                
                <View className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                    <View className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-primary rounded-tl-[3rem]" />
                    <View className="absolute top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-primary rounded-tr-[3rem]" />
                    <View className="absolute bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-primary rounded-bl-[3rem]" />
                    <View className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-primary rounded-br-[3rem]" />
                </View>
                
                {(scanned || fetching) && (
                    <View className="absolute inset-0 bg-primary/60 items-center justify-center" style={{ zIndex: 20 }}>
                        {fetching ? (
                            <ActivityIndicator color="white" size="large" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="check-decagram" size={100} color="white" />
                                <Text className="text-white font-jakarta-bold mt-4 uppercase tracking-widest">Identifié !</Text>
                            </>
                        )}
                    </View>
                )}
            </View>

            <View className="w-full gap-5">
                {!permission.granted && (
                    <PillButton 
                        title="Autoriser la caméra"
                        onPress={requestPermission} 
                        icon={<MaterialCommunityIcons name="camera" size={24} color="white" />}
                    />
                )}
                <TouchableOpacity 
                    className="py-5 items-center bg-white border border-outline-variant rounded-3xl"
                    onPress={() => router.push('/manual-entry')}
                >
                    <Text className="font-jakarta-bold text-primary uppercase text-[11px] tracking-widest">Saisie manuelle</Text>
                </TouchableOpacity>
            </View>
        </AnimatedContainer>
      </ScrollView>

      <RelationSelector 
        visible={showSelector}
        onSelect={handleRelationSelect}
        onClose={() => {
            setShowSelector(false);
            setScanned(false);
        }}
      />
    </View>
  );
}

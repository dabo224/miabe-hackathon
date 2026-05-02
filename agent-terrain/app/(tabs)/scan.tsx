import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, usePathname } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { QrCode, X, Zap } from 'lucide-react-native';
import { AnimatedContainer } from '@/components/ui/animated-container';

const S = {
  primary: '#006a40',
  white: '#ffffff',
  bg: '#FAFAFA',
  text: '#191c1d',
  muted: '#6d7a70'
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const isFocused = useIsFocused();
  const isProcessing = useRef(false);

  // Reset processing when screen focus changes
  useEffect(() => {
    if (isFocused) {
      isProcessing.current = false;
      setScanned(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    // Check ref immediately (synchronous block)
    if (isProcessing.current) return;
    isProcessing.current = true;
    setScanned(true);

    console.log(`[Scanner] Code détecté: ${data}`);

    // Extraction de l'ID via Regex pour être plus flexible (supporte GN-2024, GN-2025, etc.)
    const idPattern = /GN-\d{4}-\d+/;
    const match = data.match(idPattern);
    
    if (match) {
      const extractedId = match[0];
      router.push(`/verify/${extractedId}`);
      // Note: Scanned state will be reset when the user returns to this screen (isFocused effect)
    } else {
      // Si on ne trouve pas le pattern standard, on tente de voir si c'est l'ID brut (cas de test)
      if (data && data.length > 5 && (data.includes('-') || data.length > 10)) {
         router.push(`/verify/${data}`);
      } else {
        Alert.alert(
          "Format Invalide",
          "Le QR code scanné n'est pas un acte de naissance NaissanceChain valide.",
          [{ text: "Réessayer", onPress: () => {
              isProcessing.current = false;
              setScanned(false);
          }}]
        );
      }
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { padding: 40, justifyContent: 'center', alignItems: 'center' }]}>
        <QrCode size={60} color={S.muted} />
        <Text style={styles.permissionText}>L'accès à la caméra est nécessaire pour scanner les extraits.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la Caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={torch}
        />
      )}
      
      {/* Overlay moved outside CameraView with absolute positioning */}
      <View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <X size={24} color={S.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner un Extrait</Text>
          <TouchableOpacity onPress={() => setTorch(!torch)} style={styles.iconBtn}>
            <Zap size={24} color={torch ? '#fcd116' : S.white} fill={torch ? '#fcd116' : 'none'} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Area */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
             <View style={[styles.corner, styles.topLeft]} />
             <View style={[styles.corner, styles.topRight]} />
             <View style={[styles.corner, styles.bottomLeft]} />
             <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.hint}>Placez le QR Code dans le cadre</Text>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <View style={styles.infoCard}>
              <View style={styles.badge}>
                  <Text style={styles.badgeText}>SÉCURISÉ</Text>
              </View>
              <Text style={styles.infoText}>Vérification instantanée via le registre national Blockchain.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    color: S.muted,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    fontSize: 15,
  },
  button: {
    backgroundColor: S.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: 250,
    height: 250,
    borderWidth: 0,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
  hint: {
    color: '#fff',
    marginTop: 30,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: S.primary,
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: 1,
  },
  infoText: {
    color: S.text,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
  }
});

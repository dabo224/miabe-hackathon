import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TopAppBar } from '@/components/ui/top-app-bar';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { PillButton } from '@/components/ui/pill-button';
import { TonalCard } from '@/components/ui/tonal-card';
import { RelationSelector } from '@/components/features/search/relation-selector';
import { FamilyService } from '@/services/FamilyService';
import Config from '@/constants/Config';

export default function ManualEntryScreen() {
  const [nin, setNin] = useState('');
  const [error, setError] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!nin.trim()) {
      setError('Veuillez saisir un numéro d\'acte');
      return;
    }
    
    if (nin.length < 3) { // Petit assouplissement pour les tests
      setError('Le numéro saisi est trop court');
      return;
    }

    setShowSelector(true);
  };

  const handleRelationSelect = async (relation: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${Config.API_BASE_URL}/naissances/${nin.trim()}`, {
        headers: { 'Bypass-Tunnel-Reminder': 'true' }
      });
      const result = await response.json();

      if (result.success) {
        const record = result.data;
        await FamilyService.addMember({
          idActe: nin.trim(),
          relation,
          prenom: record.prenom,
          nom: record.nom,
          dateNaissance: record.dateNaissance,
          addedAt: new Date().toISOString()
        });
        
        setShowSelector(false);
        router.push(`/child/${nin.trim()}`);
      } else {
        Alert.alert('Erreur', 'Acte non trouvé sur le registre.');
        setShowSelector(false);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Connexion au serveur impossible.');
      setShowSelector(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <TopAppBar />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-8"
        >
          <AnimatedContainer delay={100} className="items-center">
            <View className="bg-secondary/5 p-8 rounded-full mb-10 shadow-soft border border-yellow-50">
              <MaterialCommunityIcons name="identifier" size={64} color="#705d00" />
            </View>
            
            <Text className="text-3xl font-jakarta-extrabold text-on-surface text-center mb-6 tracking-tight leading-tight">
              Saisie manuelle
            </Text>
            
            <Text className="text-base font-jakarta text-on-surface-variant text-center opacity-70 leading-relaxed mb-12 px-2">
              Chaque acte de naissance possède un identifiant unique à 12 caractères situé en hauteurs du document officiel.
            </Text>

            <TonalCard className="w-full p-8 mb-8 border border-outline-variant">
              <Text className="text-[10px] font-jakarta-bold text-on-surface-variant uppercase tracking-widest mb-4">
                Numéro d'acte unique
              </Text>
              
              <TextInput
                value={nin}
                onChangeText={(text) => {
                    setNin(text);
                    if (error) setError('');
                }}
                placeholder="Ex: GN-2023-18290"
                placeholderTextColor="#bccabe"
                className="text-2xl font-jakarta-bold text-on-surface py-2 border-b-2 border-primary/20"
                autoFocus
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleVerify}
              />
              
              {error ? (
                <Text className="text-red-500 text-xs font-jakarta-bold mt-3">
                  {error}
                </Text>
              ) : (
                <Text className="text-slate-400 text-[10px] font-jakarta-bold mt-3 uppercase tracking-widest opacity-40">
                  Format standard : GN-AAAA-XXXXX
                </Text>
              )}
            </TonalCard>

            <View className="w-full gap-5">
              <PillButton 
                title={loading ? "Vérification..." : "Vérifier l'acte"} 
                onPress={handleVerify} 
                icon={loading ? <ActivityIndicator color="white" size="small" /> : <MaterialCommunityIcons name="shield-search" size={24} color="white" />}
              />
              
              <View className="bg-white p-6 rounded-3xl flex-row items-center gap-5 border border-outline-variant shadow-soft">
                <View className="w-12 h-12 bg-secondary/5 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons name="information-outline" size={24} color="#705d00" />
                </View>
                <Text className="flex-1 text-[11px] font-jakarta-bold text-on-surface-variant leading-snug opacity-40 uppercase tracking-widest">
                    Vérifiez l'identifiant inscrit sous le titre principal du document.
                </Text>
              </View>
            </View>
          </AnimatedContainer>
        </ScrollView>
      </KeyboardAvoidingView>

      <RelationSelector 
        visible={showSelector}
        onSelect={handleRelationSelect}
        onClose={() => setShowSelector(false)}
      />
    </View>
  );
}

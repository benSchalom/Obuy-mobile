import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import CarteProduit from '../../composants/ui/CarteProduit.ui'
import MessageErreur from '../../composants/ui/MessageErreur.ui'
import { rechercherProduits } from '../../services/api/catalogue.service'
import type { Produit } from '../../types/catalogue.types'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

export default function EcranRecherche() {
  const [recherche,   setRecherche]   = useState('')
  const [produits,    setProduits]    = useState<Produit[]>([])
  const [chargement,  setChargement]  = useState(false)
  const [erreur,      setErreur]      = useState<string | null>(null)
  const [aRecherche,  setARecherche]  = useState(false)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!recherche.trim()) {
      setProduits([])
      setARecherche(false)
      return
    }
    const timer = setTimeout(() => {
      lanceRecherche(recherche)
    }, 500)
    return () => clearTimeout(timer)
  }, [recherche])

  async function lanceRecherche(terme: string) {
    try {
      setChargement(true)
      setErreur(null)
      setARecherche(true)
      const resultats = await rechercherProduits(terme)
      setProduits(resultats)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur de recherche.')
    } finally {
      setChargement(false)
    }
  }

  function surAjoutPanier(produit: Produit) {
    router.push('/(panier)/panier')
  }

  return (
    <View style={styles.conteneur}>

      {/* Barre de recherche */}
      <View style={styles.barreRecherche}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retour}>←</Text>
        </TouchableOpacity>

        <View style={styles.inputConteneur}>
          <Text style={styles.searchIcone}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={recherche}
            onChangeText={setRecherche}
            placeholder="Rechercher un produit..."
            placeholderTextColor={couleurs.texteTertiaire}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {recherche.length > 0 && (
            <TouchableOpacity onPress={() => setRecherche('')}>
              <Text style={styles.effacer}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenu */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MessageErreur message={erreur} />

        {/* Chargement */}
        {chargement && (
          <View style={styles.centrer}>
            <ActivityIndicator size="large" color={couleurs.primaire} />
          </View>
        )}

        {/* État initial */}
        {!chargement && !aRecherche && (
          <View style={styles.centrer}>
            <Text style={styles.indiceIcone}>🔍</Text>
            <Text style={styles.indiceTitre}>Rechercher un produit</Text>
            <Text style={styles.indiceTexte}>
              Tapez le nom d'un produit, d'une catégorie ou d'un vendeur
            </Text>
          </View>
        )}

        {/* Aucun résultat */}
        {!chargement && aRecherche && produits.length === 0 && (
          <View style={styles.centrer}>
            <Text style={styles.indiceIcone}>😕</Text>
            <Text style={styles.indiceTitre}>Aucun résultat</Text>
            <Text style={styles.indiceTexte}>
              Aucun produit ne correspond à "{recherche}"
            </Text>
          </View>
        )}

        {/* Résultats */}
        {!chargement && produits.length > 0 && (
          <>
            <Text style={styles.nbResultats}>
              {produits.length} résultat{produits.length > 1 ? 's' : ''} pour "{recherche}"
            </Text>
            <View style={styles.grille}>
              {produits.map(produit => (
                <CarteProduit
                  key={produit.id}
                  produit={produit}
                  surAjoutPanier={surAjoutPanier}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flex:            1,
    backgroundColor: '#F0F2F5',
  },
  barreRecherche: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   couleurs.fond,
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.md,
    gap:               espacements.md,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  retour: {
    fontSize:   tailles.xl,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  inputConteneur: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   couleurs.surface,
    borderRadius:      rayons.pill,
    paddingHorizontal: espacements.md,
    borderWidth:       1,
    borderColor:       couleurs.bordure,
    gap:               espacements.xs,
  },
  searchIcone: {
    fontSize: 16,
  },
  input: {
    flex:       1,
    height:     44,
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
  },
  effacer: {
    fontSize: 14,
    color:    couleurs.texteTertiaire,
    padding:  espacements.xs,
  },
  scroll: {
    flexGrow: 1,
    padding:  espacements.lg,
  },
  centrer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingTop:     espacements.xxxl,
  },
  indiceIcone: {
    fontSize:     48,
    marginBottom: espacements.md,
  },
  indiceTitre: {
    fontSize:     tailles.lg,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: espacements.sm,
  },
  indiceTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
    textAlign:  'center',
    lineHeight: 22,
  },
  nbResultats: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    marginBottom: espacements.md,
  },
  grille: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           espacements.md,
  },
})
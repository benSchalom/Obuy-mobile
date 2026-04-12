import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import CarteProduit from '../../composants/ui/CarteProduit.ui'
import { mockProduits } from '../../mocks/catalogue.mock'
import type { Produit } from '../../types/catalogue.types'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

export default function EcranWishlist() {
  // En mode mock on prend 2 produits comme favoris
  const [favoris, setFavoris] = useState<Produit[]>(
    appConfig.dev?.useMock ? mockProduits.slice(0, 2) : []
  )

  function surRetrait(produit: Produit) {
    setFavoris(f => f.filter(p => p.id !== produit.id))
  }

  function surAjoutPanier(produit: Produit) {
    router.push('/(panier)/panier')
  }

  return (
    <View style={styles.conteneur}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retour}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Mes favoris</Text>
        <Text style={styles.compte}>{favoris.length} article{favoris.length > 1 ? 's' : ''}</Text>
      </View>

      {favoris.length === 0 ? (
        <View style={styles.vide}>
          <Text style={styles.videIcone}>🤍</Text>
          <Text style={styles.videtitre}>Votre liste est vide</Text>
          <Text style={styles.videTexte}>
            Ajoutez des produits à vos favoris en appuyant sur le cœur.
          </Text>
          <TouchableOpacity
            style={styles.boutonShop}
            onPress={() => router.push('/(catalogue)/shop.catalogue')}
          >
            <Text style={styles.boutonShopTexte}>Découvrir la boutique</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grille}>
            {favoris.map(produit => (
              <View key={produit.id} style={styles.carteConteneur}>
                <CarteProduit
                  produit={produit}
                  surAjoutPanier={surAjoutPanier}
                />
                <TouchableOpacity
                  style={styles.boutonRetrait}
                  onPress={() => surRetrait(produit)}
                >
                  <Text style={styles.boutonRetraitTexte}>✕ Retirer</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flex:            1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   couleurs.fond,
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.md,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  retour: {
    fontSize:   tailles.xl,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  titre: {
    fontSize:   tailles.lg,
    fontFamily: appConfig.theme.polices.titre,
    color:      couleurs.textePrincipal,
    fontWeight: '700',
  },
  compte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  vide: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        espacements.xxxl,
  },
  videIcone: {
    fontSize:     64,
    marginBottom: espacements.lg,
  },
  videtitre: {
    fontSize:     tailles.xl,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: espacements.sm,
  },
  videTexte: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    textAlign:    'center',
    lineHeight:   22,
    marginBottom: espacements.xl,
  },
  boutonShop: {
    backgroundColor:   couleurs.primaire,
    borderRadius:      rayons.sm,
    paddingVertical:   espacements.md,
    paddingHorizontal: espacements.xxl,
  },
  boutonShopTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '600',
  },
  scroll: {
    padding: espacements.lg,
  },
  grille: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           espacements.md,
  },
  carteConteneur: {
    position: 'relative',
  },
  boutonRetrait: {
    alignItems:      'center',
    paddingVertical: espacements.xs,
    marginTop:       -espacements.sm,
  },
  boutonRetraitTexte: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.erreur,
    fontWeight: '500',
  },
})
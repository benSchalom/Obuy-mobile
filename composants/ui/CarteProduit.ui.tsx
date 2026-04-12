import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import type { Produit } from '../../types/catalogue.types'

const { couleurs, tailles, espacements, rayons } = appConfig.theme
const LARGEUR_CARTE = (Dimensions.get('window').width - espacements.xl * 2 - espacements.md) / 2

type PropsCarteProduit = {
  produit:        Produit
  surAjoutPanier: (produit: Produit) => void
}

export default function CarteProduit({ produit, surAjoutPanier }: PropsCarteProduit) {
  return (
    <TouchableOpacity
      style={styles.carte}
      onPress={() => router.push(`/(catalogue)/produit/${produit.slug}`)}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={styles.imageConteneur}>
        <Image
          source={{ uri: produit.image || 'https://obuy.cloud/wp-content/uploads/woocommerce-placeholder-300x450.webp' }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badge réduction */}
        {produit.pourcentageRemise && (
          <View style={styles.badgeRemise}>
            <Text style={styles.badgeRemiseTexte}>-{produit.pourcentageRemise}%</Text>
          </View>
        )}

        {/* Badge rupture de stock */}
        {!produit.enStock && (
          <View style={styles.badgeRupture}>
            <Text style={styles.badgeRuptureTexte}>Rupture de stock</Text>
          </View>
        )}
      </View>

      {/* Infos */}
      <View style={styles.infos}>

        {/* Badge vendeur */}
        {produit.vendeur && (
          <View style={styles.badgeVendeur}>
            <Text style={styles.badgeVendeurTexte} numberOfLines={1}>
              {produit.vendeur.nom}
            </Text>
          </View>
        )}

        {/* Nom */}
        <Text style={styles.nom} numberOfLines={2}>{produit.nom}</Text>

        {/* Prix */}
        <View style={styles.prixConteneur}>
          {produit.enSolde && (
            <Text style={styles.prixBarre}>{produit.prixRegulier} CFA</Text>
          )}
          <Text style={styles.prix}>{produit.prix} CFA</Text>
        </View>

        {/* Bouton */}
        <TouchableOpacity
          style={[styles.bouton, !produit.enStock && styles.boutonDesactive]}
          onPress={() => produit.enStock && surAjoutPanier(produit)}
          disabled={!produit.enStock}
          activeOpacity={0.8}
        >
          <Text style={styles.boutonTexte}>
            {produit.enStock ? 'Ajouter au panier' : 'Indisponible'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  carte: {
    width:           LARGEUR_CARTE,
    backgroundColor: couleurs.fond,
    borderRadius:    rayons.md,
    marginBottom:    espacements.md,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    6,
    elevation:       2,
    overflow:        'hidden',
  },
  imageConteneur: {
    width:  '100%',
    height: LARGEUR_CARTE * 1.2,
    position: 'relative',
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  badgeRemise: {
    position:        'absolute',
    top:             espacements.sm,
    left:            espacements.sm,
    backgroundColor: couleurs.primaire,
    borderRadius:    rayons.pill,
    paddingVertical:   2,
    paddingHorizontal: espacements.sm,
  },
  badgeRemiseTexte: {
    fontSize:   tailles.xs,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '700',
  },
  badgeRupture: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: espacements.sm,
    alignItems:      'center',
  },
  badgeRuptureTexte: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '500',
  },
  infos: {
    padding: espacements.sm,
  },
  badgeVendeur: {
    alignSelf:         'flex-start',
    borderWidth:       1,
    borderColor:       couleurs.bordure,
    borderRadius:      rayons.pill,
    paddingVertical:   2,
    paddingHorizontal: espacements.sm,
    marginBottom:      espacements.xs,
  },
  badgeVendeurTexte: {
    fontSize:   tailles.xs,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  nom: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.textePrincipal,
    fontWeight:   '500',
    marginBottom: espacements.xs,
    lineHeight:   20,
  },
  prixConteneur: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           espacements.xs,
    marginBottom:  espacements.sm,
    flexWrap:      'wrap',
  },
  prixBarre: {
    fontSize:          tailles.sm,
    fontFamily:        appConfig.theme.polices.corps,
    color:             couleurs.texteTertiaire,
    textDecorationLine: 'line-through',
  },
  prix: {
    fontSize:   tailles.md,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
    fontWeight: '700',
  },
  bouton: {
    backgroundColor: couleurs.primaire,
    borderRadius:    rayons.sm,
    paddingVertical: espacements.sm,
    alignItems:      'center',
  },
  boutonDesactive: {
    backgroundColor: couleurs.surface2,
  },
  boutonTexte: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '600',
  },
})
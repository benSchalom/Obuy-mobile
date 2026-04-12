import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import { useAuth } from '../../contextes/auth.contexte'
import Chargement from '../../composants/ui/Chargement.ui'
import MessageErreur from '../../composants/ui/MessageErreur.ui'
import CarteProduit from '../../composants/ui/CarteProduit.ui'
import {
  obtenirProduitsPopulaires,
  obtenirCategories,
} from '../../services/api/catalogue.service'
import { mockBannieres } from '../../mocks/catalogue.mock'
import type { Produit, Categorie, Banniere } from '../../types/catalogue.types'

const { couleurs, tailles, espacements, rayons } = appConfig.theme
const { width } = Dimensions.get('window')

export default function EcranAccueil() {
  const { utilisateur } = useAuth()

  const [produits,    setProduits]    = useState<Produit[]>([])
  const [categories,  setCategories]  = useState<Categorie[]>([])
  const [banniereIdx, setBanniereIdx] = useState(0)
  const [chargement,  setChargement]  = useState(true)
  const [erreur,      setErreur]      = useState<string | null>(null)

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    try {
      setChargement(true)
      const [prods, cats] = await Promise.all([
        obtenirProduitsPopulaires(),
        obtenirCategories(),
      ])
      setProduits(prods)
      setCategories(cats)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur de chargement.')
    } finally {
      setChargement(false)
    }
  }

  function surAjoutPanier(produit: Produit) {
    router.push('/(panier)/panier')
  }

  if (chargement) return <Chargement pleinEcran message="Chargement..." />

  return (
    <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo1.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerDroite}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/(catalogue)/recherche.catalogue')}
          >
            <Text style={styles.searchTexte}>Rechercher un produit...</Text>
          </TouchableOpacity>
        </View>
      </View>

      <MessageErreur message={erreur} />

      {/* Bannières hero */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width)
          setBanniereIdx(idx)
        }}
        style={styles.banniereConteneur}
      >
        {mockBannieres.map((banniere: Banniere) => (
          <TouchableOpacity
            key={banniere.id}
            style={[styles.banniere, { width }]}
            onPress={() => router.push('/(catalogue)/shop.catalogue')}
            activeOpacity={0.9}
          >
            <View style={styles.banniereContenu}>
              <View style={styles.banniereTextes}>
                <Text style={styles.banniereSousTitre}>{banniere.sousTitre}</Text>
                <Text style={styles.banniereTitre}>{banniere.titre}</Text>
                <Text style={styles.banniereDescription} numberOfLines={2}>
                  {banniere.description}
                </Text>
                <TouchableOpacity style={styles.banniereBouton}>
                  <Text style={styles.banniereBoutonTexte}>Acheter →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicateurs bannière */}
      <View style={styles.indicateurs}>
        {mockBannieres.map((_, i) => (
          <View
            key={i}
            style={[styles.indicateur, i === banniereIdx && styles.indicateurActif]}
          />
        ))}
      </View>

      {/* Garanties */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.garantiesConteneur}
      >
        {[
          { icone: '🚚', titre: 'Livraison rapide',   sousTitre: 'Livraison ultra-rapide' },
          { icone: '🔒', titre: 'Paiement sécurisé',  sousTitre: 'Achetez en toute confiance' },
          { icone: '✓',  titre: 'Retour sous 7 jours', sousTitre: 'Livraison ultra-rapide' },
          { icone: '🎧', titre: 'Support 24/7',        sousTitre: 'Toujours là pour vous' },
        ].map((g, i) => (
          <View key={i} style={styles.garantie}>
            <Text style={styles.garantieIcone}>{g.icone}</Text>
            <View>
              <Text style={styles.garantieTitre}>{g.titre}</Text>
              <Text style={styles.garantieSousTitre}>{g.sousTitre}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Catégories populaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitre}>Catégories populaires</Text>
          <TouchableOpacity onPress={() => router.push('/(catalogue)/shop.catalogue')}>
            <Text style={styles.voirTout}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categorie}
              onPress={() => router.push(`/(catalogue)/shop.catalogue?categorie=${cat.slug}`)}
            >
              <Text style={styles.categorieTexte}>{cat.nom}</Text>
              <Text style={styles.categorieCount}>{cat.count} produits</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Produits populaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitre}>Produits populaires</Text>
          <TouchableOpacity onPress={() => router.push('/(catalogue)/shop.catalogue')}>
            <Text style={styles.voirTout}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grilleProduits}>
          {produits.map(produit => (
            <CarteProduit
              key={produit.id}
              produit={produit}
              surAjoutPanier={surAjoutPanier}
            />
          ))}
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flex:            1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: couleurs.fond,
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.md,
    gap:             espacements.md,
  },
  logo: {
    width:  40,
    height: 40,
  },
  headerDroite: {
    flex: 1,
  },
  searchBar: {
    backgroundColor:   couleurs.surface,
    borderRadius:      rayons.pill,
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.sm,
    borderWidth:       1,
    borderColor:       couleurs.bordure,
  },
  searchTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
  },
  banniereConteneur: {
    marginTop: espacements.md,
  },
  banniere: {
    backgroundColor: '#FFF3E8',
    padding:         espacements.xl,
    minHeight:       200,
    justifyContent:  'center',
  },
  banniereContenu: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  banniereTextes: {
    flex: 1,
  },
  banniereSousTitre: {
    fontSize:     tailles.sm,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.primaire,
    fontWeight:   '600',
    marginBottom: espacements.xs,
  },
  banniereTitre: {
    fontSize:     tailles.xl,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: espacements.sm,
    lineHeight:   32,
  },
  banniereDescription: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    marginBottom: espacements.lg,
    lineHeight:   22,
  },
  banniereBouton: {
    alignSelf:         'flex-start',
    backgroundColor:   couleurs.primaire,
    borderRadius:      rayons.sm,
    paddingVertical:   espacements.sm,
    paddingHorizontal: espacements.xl,
  },
  banniereBoutonTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '600',
  },
  indicateurs: {
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            espacements.xs,
    marginTop:      espacements.sm,
    marginBottom:   espacements.md,
  },
  indicateur: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: couleurs.bordure,
  },
  indicateurActif: {
    backgroundColor: couleurs.primaire,
    width:           16,
  },
  garantiesConteneur: {
    paddingHorizontal: espacements.lg,
    gap:               espacements.md,
    paddingVertical:   espacements.md,
  },
  garantie: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: couleurs.fond,
    borderRadius:    rayons.md,
    padding:         espacements.md,
    gap:             espacements.md,
    minWidth:        160,
    borderWidth:     1,
    borderColor:     couleurs.bordure,
  },
  garantieIcone: {
    fontSize: 24,
  },
  garantieTitre: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  garantieSousTitre: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  section: {
    padding:      espacements.lg,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   espacements.md,
  },
  sectionTitre: {
    fontSize:   tailles.lg,
    fontFamily: appConfig.theme.polices.titre,
    color:      couleurs.textePrincipal,
    fontWeight: '700',
  },
  voirTout: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '600',
  },
  categorie: {
    backgroundColor:   couleurs.fond,
    borderRadius:      rayons.md,
    padding:           espacements.md,
    marginRight:       espacements.sm,
    borderWidth:       1,
    borderColor:       couleurs.bordure,
    minWidth:          100,
    alignItems:        'center',
  },
  categorieTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  categorieCount: {
    fontSize:   tailles.xs,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
    marginTop:  2,
  },
  grilleProduits: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           espacements.md,
  },
})
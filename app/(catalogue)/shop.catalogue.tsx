import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import Chargement from '../../composants/ui/Chargement.ui'
import MessageErreur from '../../composants/ui/MessageErreur.ui'
import CarteProduit from '../../composants/ui/CarteProduit.ui'
import { obtenirProduits, obtenirCategories } from '../../services/api/catalogue.service'
import type { Produit, Categorie, FiltreShop } from '../../types/catalogue.types'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

const OPTIONS_TRI = [
  { label: 'Par défaut',        valeur: 'default'    },
  { label: 'Prix croissant',    valeur: 'price'      },
  { label: 'Prix décroissant',  valeur: 'price-desc' },
  { label: 'Plus récents',      valeur: 'date'       },
  { label: 'Mieux notés',       valeur: 'rating'     },
]

export default function EcranShop() {
  const params = useLocalSearchParams<{ categorie?: string }>()

  const [produits,      setProduits]      = useState<Produit[]>([])
  const [categories,    setCategories]    = useState<Categorie[]>([])
  const [total,         setTotal]         = useState(0)
  const [chargement,    setChargement]    = useState(true)
  const [erreur,        setErreur]        = useState<string | null>(null)
  const [afficherTri,   setAfficherTri]   = useState(false)

  const [filtres, setFiltres] = useState<FiltreShop>({
    tri:       'default',
    categorie: params.categorie || null,
    page:      1,
    parPage:   16,
  })

  useEffect(() => {
    chargerProduits()
    chargerCategories()
  }, [filtres])

  async function chargerProduits() {
    try {
      setChargement(true)
      const resultat = await obtenirProduits(filtres)
      setProduits(resultat.donnees)
      setTotal(resultat.total)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur de chargement.')
    } finally {
      setChargement(false)
    }
  }

  async function chargerCategories() {
    try {
      const cats = await obtenirCategories()
      setCategories(cats)
    } catch {}
  }

  function surChangementTri(tri: FiltreShop['tri']) {
    setFiltres(f => ({ ...f, tri, page: 1 }))
    setAfficherTri(false)
  }

  function surChangementCategorie(slug: string | null) {
    setFiltres(f => ({ ...f, categorie: slug, page: 1 }))
  }

  function surAjoutPanier(produit: Produit) {
    router.push('/(panier)/panier')
  }

  const triActuel = OPTIONS_TRI.find(o => o.valeur === filtres.tri)?.label || 'Par défaut'

  return (
    <SafeAreaView style={styles.conteneur} edges={['top']}>
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retour}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Boutique</Text>
        <TouchableOpacity onPress={() => router.push('/(catalogue)/recherche.catalogue')}>
          <Text style={styles.rechercheIcone}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesConteneur}
      >
        <TouchableOpacity
          style={[styles.categorieTag, !filtres.categorie && styles.categorieTagActif]}
          onPress={() => surChangementCategorie(null)}
        >
          <Text style={[styles.categorieTagTexte, !filtres.categorie && styles.categorieTagTexteActif]}>
            Tous
          </Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categorieTag, filtres.categorie === cat.slug && styles.categorieTagActif]}
            onPress={() => surChangementCategorie(cat.slug)}
          >
            <Text style={[styles.categorieTagTexte, filtres.categorie === cat.slug && styles.categorieTagTexteActif]}>
              {cat.nom}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Barre tri + résultats */}
      <View style={styles.barreOptions}>
        <Text style={styles.nbResultats}>
          {total} résultat{total > 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          style={styles.boutonTri}
          onPress={() => setAfficherTri(v => !v)}
        >
          <Text style={styles.boutonTriTexte}>{triActuel} ▾</Text>
        </TouchableOpacity>
      </View>

      {/* Menu tri déroulant */}
      {afficherTri && (
        <View style={styles.menuTri}>
          {OPTIONS_TRI.map(option => (
            <TouchableOpacity
              key={option.valeur}
              style={[styles.menuTriItem, filtres.tri === option.valeur && styles.menuTriItemActif]}
              onPress={() => surChangementTri(option.valeur as FiltreShop['tri'])}
            >
              <Text style={[styles.menuTriTexte, filtres.tri === option.valeur && styles.menuTriTexteActif]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Liste produits */}
      {chargement ? (
        <Chargement message="Chargement des produits..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.grille}
          showsVerticalScrollIndicator={false}
        >
          <MessageErreur message={erreur} />
          {produits.length === 0 ? (
            <View style={styles.vide}>
              <Text style={styles.videTexte}>Aucun produit trouvé.</Text>
            </View>
          ) : (
            <View style={styles.grilleProduits}>
              {produits.map(produit => (
                <CarteProduit
                  key={produit.id}
                  produit={produit}
                  surAjoutPanier={surAjoutPanier}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
    </SafeAreaView>
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
  rechercheIcone: {
    fontSize: 20,
  },
  categoriesConteneur: {
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.md,
    gap:               espacements.sm,
    backgroundColor:   couleurs.fond,
  },
  categorieTag: {
    paddingVertical:   espacements.xs,
    paddingHorizontal: espacements.md,
    borderRadius:      rayons.pill,
    borderWidth:       1,
    borderColor:       couleurs.bordure,
    backgroundColor:   couleurs.fond,
  },
  categorieTagActif: {
    backgroundColor: couleurs.primaire,
    borderColor:     couleurs.primaire,
  },
  categorieTagTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  categorieTagTexteActif: {
    color:      couleurs.texteInverse,
    fontWeight: '600',
  },
  barreOptions: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.sm,
    backgroundColor:   couleurs.fond,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  nbResultats: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  boutonTri: {
    paddingVertical:   espacements.xs,
    paddingHorizontal: espacements.md,
    borderRadius:      rayons.sm,
    borderWidth:       1,
    borderColor:       couleurs.bordure,
  },
  boutonTriTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
  },
  menuTri: {
    position:          'absolute',
    top:               140,
    right:             espacements.lg,
    backgroundColor:   couleurs.fond,
    borderRadius:      rayons.md,
    borderWidth:       1,
    borderColor:       couleurs.bordure,
    zIndex:            100,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.1,
    shadowRadius:      8,
    elevation:         5,
    minWidth:          180,
  },
  menuTriItem: {
    paddingVertical:   espacements.md,
    paddingHorizontal: espacements.lg,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  menuTriItemActif: {
    backgroundColor: couleurs.primaireClair,
  },
  menuTriTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
  },
  menuTriTexteActif: {
    color:      couleurs.primaire,
    fontWeight: '600',
  },
  grille: {
    padding: espacements.lg,
  },
  grilleProduits: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           espacements.md,
  },
  vide: {
    alignItems:  'center',
    paddingTop:  espacements.xxxl,
  },
  videTexte: {
    fontSize:   tailles.lg,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
  },
})
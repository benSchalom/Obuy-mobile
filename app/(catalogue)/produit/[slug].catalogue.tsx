import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { appConfig } from '../../../config/appConfig'
import Chargement from '../../../composants/ui/Chargement.ui'
import MessageErreur from '../../../composants/ui/MessageErreur.ui'
import CarteProduit from '../../../composants/ui/CarteProduit.ui'
import {
  obtenirProduit,
  obtenirProduitsSimilaires,
  obtenirAvis,
} from '../../../services/api/catalogue.service'
import type { Produit, Avis } from '../../../types/catalogue.types'

const { couleurs, tailles, espacements, rayons } = appConfig.theme
const { width } = Dimensions.get('window')

type Onglet = 'description' | 'avis' | 'similaires'

export default function EcranProduit() {
  const { slug } = useLocalSearchParams<{ slug: string }>()

  const [produit,    setProduit]    = useState<Produit | null>(null)
  const [similaires, setSimilaires] = useState<Produit[]>([])
  const [avis,       setAvis]       = useState<Avis[]>([])
  const [quantite,   setQuantite]   = useState(1)
  const [onglet,     setOnglet]     = useState<Onglet>('description')
  const [chargement, setChargement] = useState(true)
  const [erreur,     setErreur]     = useState<string | null>(null)
  const [enWishlist, setEnWishlist] = useState(false)

  useEffect(() => {
    if (slug) chargerProduit()
  }, [slug])

  async function chargerProduit() {
    try {
      setChargement(true)
      const prod = await obtenirProduit(slug)
      setProduit(prod)

      const [sim, avs] = await Promise.all([
        obtenirProduitsSimilaires(prod.id, prod.categories[0]?.slug || ''),
        obtenirAvis(prod.id),
      ])
      setSimilaires(sim)
      setAvis(avs)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Produit introuvable.')
    } finally {
      setChargement(false)
    }
  }

  function surAjoutPanier(prod: Produit) {
    router.push('/(panier)/panier')
  }

  if (chargement) return <Chargement pleinEcran message="Chargement du produit..." />
  if (erreur || !produit) return (
    <View style={styles.conteneur}>
      <MessageErreur message={erreur || 'Produit introuvable.'} />
    </View>
  )

  return (
    <View style={styles.conteneur}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retour}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitre} numberOfLines={1}>{produit.nom}</Text>
        <TouchableOpacity onPress={() => setEnWishlist(v => !v)}>
          <Text style={styles.wishlistIcone}>{enWishlist ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Image principale */}
        <View style={styles.imageConteneur}>
          <Image
            source={{ uri: produit.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {produit.pourcentageRemise && (
            <View style={styles.badgePromo}>
              <Text style={styles.badgePromoTexte}>Promo !</Text>
            </View>
          )}
          {!produit.enStock && (
            <View style={styles.badgeRupture}>
              <Text style={styles.badgeRuptureTexte}>Rupture de stock</Text>
            </View>
          )}
        </View>

        <View style={styles.contenu}>

          {/* Nom + Prix */}
          <Text style={styles.nom}>{produit.nom}</Text>

          <View style={styles.prixConteneur}>
            {produit.enSolde && (
              <Text style={styles.prixBarre}>{produit.prixRegulier} CFA</Text>
            )}
            <Text style={styles.prix}>{produit.prix} CFA</Text>
          </View>

          {/* Description courte */}
          {produit.descriptionCourte !== '' && (
            <Text style={styles.descriptionCourte}>{produit.descriptionCourte}</Text>
          )}

          {/* Catégorie */}
          <Text style={styles.categorie}>
            Catégorie : {produit.categories.map(c => c.nom).join(', ') || 'Non classé'}
          </Text>

          {/* Sélecteur quantité + Bouton panier */}
          <View style={styles.actionConteneur}>
            <View style={styles.quantiteConteneur}>
              <TouchableOpacity
                style={styles.quantiteBtn}
                onPress={() => setQuantite(q => Math.max(1, q - 1))}
              >
                <Text style={styles.quantiteBtnTexte}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantiteValeur}>{quantite}</Text>
              <TouchableOpacity
                style={styles.quantiteBtn}
                onPress={() => setQuantite(q => q + 1)}
              >
                <Text style={styles.quantiteBtnTexte}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.boutonPanier, !produit.enStock && styles.boutonPanierDesactive]}
              onPress={() => produit.enStock && surAjoutPanier(produit)}
              disabled={!produit.enStock}
              activeOpacity={0.8}
            >
              <Text style={styles.boutonPanierTexte}>
                {produit.enStock ? 'Ajouter au panier' : 'Indisponible'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wishlist */}
          <TouchableOpacity
            style={styles.wishlistBouton}
            onPress={() => setEnWishlist(v => !v)}
          >
            <Text style={styles.wishlistTexte}>
              {enWishlist ? '❤️ Retiré des favoris' : '🤍 Ajouter aux favoris'}
            </Text>
          </TouchableOpacity>

          {/* Onglets */}
          <View style={styles.onglets}>
            {([
              { id: 'description', label: 'Description' },
              { id: 'avis',        label: `Avis (${avis.length})` },
              { id: 'similaires',  label: 'Similaires' },
            ] as { id: Onglet, label: string }[]).map(o => (
              <TouchableOpacity
                key={o.id}
                style={[styles.onglet, onglet === o.id && styles.ongletActif]}
                onPress={() => setOnglet(o.id)}
              >
                <Text style={[styles.ongletTexte, onglet === o.id && styles.ongletTexteActif]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contenu onglet Description */}
          {onglet === 'description' && (
            <View style={styles.ongletContenu}>
              <Text style={styles.descriptionTexte}>
                {produit.description || 'Aucune description disponible.'}
              </Text>
            </View>
          )}

          {/* Contenu onglet Avis */}
          {onglet === 'avis' && (
            <View style={styles.ongletContenu}>
              {avis.length === 0 ? (
                <Text style={styles.videTexte}>Aucun avis pour ce produit.</Text>
              ) : (
                avis.map(a => (
                  <View key={a.id} style={styles.avisItem}>
                    <View style={styles.avisHeader}>
                      <Text style={styles.avisAuteur}>{a.auteur}</Text>
                      <Text style={styles.avisNote}>{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</Text>
                    </View>
                    <Text style={styles.avisCommentaire}>{a.commentaire}</Text>
                    <Text style={styles.avisDate}>{a.date}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Contenu onglet Similaires */}
          {onglet === 'similaires' && (
            <View style={styles.ongletContenu}>
              {similaires.length === 0 ? (
                <Text style={styles.videTexte}>Aucun produit similaire.</Text>
              ) : (
                <View style={styles.grilleSimilaires}>
                  {similaires.map(p => (
                    <CarteProduit
                      key={p.id}
                      produit={p}
                      surAjoutPanier={surAjoutPanier}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flex:            1,
    backgroundColor: couleurs.fond,
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: espacements.lg,
    paddingVertical:   espacements.md,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
    backgroundColor:   couleurs.fond,
  },
  retour: {
    fontSize:   tailles.xl,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  headerTitre: {
    flex:       1,
    fontSize:   tailles.md,
    fontFamily: appConfig.theme.polices.titre,
    color:      couleurs.textePrincipal,
    fontWeight: '700',
    textAlign:  'center',
    marginHorizontal: espacements.md,
  },
  wishlistIcone: {
    fontSize: 22,
  },
  imageConteneur: {
    width:    '100%',
    height:   width * 0.8,
    position: 'relative',
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  badgePromo: {
    position:          'absolute',
    top:               espacements.md,
    left:              espacements.md,
    backgroundColor:   couleurs.primaire,
    borderRadius:      rayons.sm,
    paddingVertical:   espacements.xs,
    paddingHorizontal: espacements.md,
  },
  badgePromoTexte: {
    fontSize:   tailles.sm,
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
    paddingVertical: espacements.md,
    alignItems:      'center',
  },
  badgeRuptureTexte: {
    fontSize:   tailles.md,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '600',
  },
  contenu: {
    padding: espacements.lg,
  },
  nom: {
    fontSize:     tailles.xxl,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: espacements.sm,
  },
  prixConteneur: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           espacements.sm,
    marginBottom:  espacements.md,
  },
  prixBarre: {
    fontSize:           tailles.md,
    fontFamily:         appConfig.theme.polices.corps,
    color:              couleurs.texteTertiaire,
    textDecorationLine: 'line-through',
  },
  prix: {
    fontSize:   tailles.xl,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '700',
  },
  descriptionCourte: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    lineHeight:   22,
    marginBottom: espacements.md,
  },
  categorie: {
    fontSize:     tailles.sm,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteTertiaire,
    marginBottom: espacements.lg,
  },
  actionConteneur: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           espacements.md,
    marginBottom:  espacements.md,
  },
  quantiteConteneur: {
    flexDirection:   'row',
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     couleurs.bordure,
    borderRadius:    rayons.sm,
    overflow:        'hidden',
  },
  quantiteBtn: {
    width:           40,
    height:          44,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: couleurs.surface,
  },
  quantiteBtnTexte: {
    fontSize:   tailles.xl,
    color:      couleurs.textePrincipal,
    fontWeight: '500',
  },
  quantiteValeur: {
    width:      48,
    textAlign:  'center',
    fontSize:   tailles.md,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  boutonPanier: {
    flex:            1,
    height:          44,
    backgroundColor: couleurs.primaire,
    borderRadius:    rayons.sm,
    alignItems:      'center',
    justifyContent:  'center',
  },
  boutonPanierDesactive: {
    backgroundColor: couleurs.surface2,
  },
  boutonPanierTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteInverse,
    fontWeight: '600',
  },
  wishlistBouton: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: espacements.sm,
    marginBottom:   espacements.lg,
  },
  wishlistTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  onglets: {
    flexDirection:     'row',
    borderBottomWidth: 2,
    borderBottomColor: couleurs.bordure,
    marginBottom:      espacements.lg,
  },
  onglet: {
    flex:            1,
    paddingVertical: espacements.md,
    alignItems:      'center',
  },
  ongletActif: {
    borderBottomWidth: 2,
    borderBottomColor: couleurs.topbar,
    marginBottom:      -2,
  },
  ongletTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
  },
  ongletTexteActif: {
    color:      couleurs.topbar,
    fontWeight: '700',
  },
  ongletContenu: {
    marginBottom: espacements.xl,
  },
  descriptionTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
    lineHeight: 24,
  },
  videTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
    textAlign:  'center',
    paddingVertical: espacements.xl,
  },
  avisItem: {
    paddingVertical:   espacements.md,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  avisHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   espacements.xs,
  },
  avisAuteur: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  avisNote: {
    fontSize: tailles.normale,
    color:    '#F59E0B',
  },
  avisCommentaire: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    lineHeight:   22,
    marginBottom: espacements.xs,
  },
  avisDate: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
  },
  grilleSimilaires: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           espacements.md,
  },
})
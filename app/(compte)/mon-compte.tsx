import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import { useAuth } from '../../contextes/auth.contexte'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

const MENU = [
  { icone: '📦', label: 'Mes commandes',     route: null },
  { icone: '🤍', label: 'Mes favoris',        route: '/(catalogue)/wishlist.catalogue' },
  { icone: '📍', label: 'Mes adresses',       route: null },
  { icone: '🔒', label: 'Sécurité',           route: null },
  { icone: '🔔', label: 'Notifications',      route: null },
  { icone: '❓', label: 'Aide & support',     route: null },
]

export default function MonCompte() {
  const { utilisateur, deconnecter } = useAuth()

  const roleLabel = {
    client:  'Client',
    vendeur: 'Vendeur',
    livreur: 'Livreur',
  }[utilisateur?.role ?? 'client']

  return (
    <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>

      {/* Header profil */}
      <View style={styles.header}>
        <Image
          source={{ uri: utilisateur?.avatar || 'https://obuy.cloud/wp-content/uploads/woocommerce-placeholder-300x450.webp' }}
          style={styles.avatar}
        />
        <View style={styles.infos}>
          <Text style={styles.nom}>{utilisateur?.prenom} {utilisateur?.nom}</Text>
          <Text style={styles.email}>{utilisateur?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>{roleLabel}</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.carte}>
        {MENU.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.ligne, i < MENU.length - 1 && styles.ligneSeparateur]}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={item.route ? 0.7 : 1}
          >
            <Text style={styles.ligneIcone}>{item.icone}</Text>
            <Text style={styles.ligneLabel}>{item.label}</Text>
            {item.route && <Text style={styles.ligneChevron}>›</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Déconnexion */}
      <TouchableOpacity style={styles.boutonDeconnexion} onPress={deconnecter}>
        <Text style={styles.boutonDeconnexionTexte}>Se déconnecter</Text>
      </TouchableOpacity>

      <Text style={styles.version}>OBUY v1.0.0</Text>

    </ScrollView>
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
    backgroundColor:   couleurs.fond,
    padding:           espacements.xl,
    gap:               espacements.lg,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  avatar: {
    width:        72,
    height:       72,
    borderRadius: 36,
    backgroundColor: couleurs.surface,
  },
  infos: {
    flex: 1,
  },
  nom: {
    fontSize:     tailles.lg,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: 2,
  },
  email: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    marginBottom: espacements.sm,
  },
  badge: {
    alignSelf:         'flex-start',
    backgroundColor:   couleurs.primaireClair,
    borderRadius:      rayons.pill,
    paddingVertical:   2,
    paddingHorizontal: espacements.sm,
  },
  badgeTexte: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '600',
  },
  carte: {
    backgroundColor: couleurs.fond,
    borderRadius:    rayons.md,
    margin:          espacements.lg,
    overflow:        'hidden',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.05,
    shadowRadius:    4,
    elevation:       2,
  },
  ligne: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   espacements.lg,
    paddingHorizontal: espacements.lg,
    gap:               espacements.md,
  },
  ligneSeparateur: {
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  ligneIcone: {
    fontSize: 20,
    width:    28,
  },
  ligneLabel: {
    flex:       1,
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
    fontWeight: '500',
  },
  ligneChevron: {
    fontSize:   tailles.xl,
    color:      couleurs.texteTertiaire,
    fontWeight: '300',
  },
  boutonDeconnexion: {
    marginHorizontal: espacements.lg,
    marginTop:        espacements.xs,
    paddingVertical:  espacements.md,
    borderRadius:     rayons.sm,
    borderWidth:      1,
    borderColor:      couleurs.erreur,
    alignItems:       'center',
  },
  boutonDeconnexionTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.erreur,
    fontWeight: '600',
  },
  version: {
    textAlign:    'center',
    fontSize:     tailles.sm,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteTertiaire,
    marginTop:    espacements.xl,
    marginBottom: espacements.xxxl,
  },
})

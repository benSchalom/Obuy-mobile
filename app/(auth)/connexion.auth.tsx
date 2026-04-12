import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import { useAuth } from '../../contextes/auth.contexte'
import InputObuy from '../../composants/ui/InputObuy.ui'
import BoutonObuy from '../../composants/ui/BoutonObuy.ui'
import MessageErreur from '../../composants/ui/MessageErreur.ui'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

export default function EcranConnexion() {
  const { connecter, chargement, erreur } = useAuth()

  const [email, setEmail]               = useState('')
  const [motDePasse, setMotDePasse]     = useState('')
  const [sesouvenir, setSeSouvenir]     = useState(false)
  const [erreurLocale, setErreurLocale] = useState<string | null>(null)

  async function gererConnexion() {
    setErreurLocale(null)

    if (!email.trim()) {
      setErreurLocale('Veuillez saisir votre adresse email.')
      return
    }
    if (!motDePasse.trim()) {
      setErreurLocale('Veuillez saisir votre mot de passe.')
      return
    }

    await connecter({ email: email.trim(), motDePasse })
  }

  return (
    <KeyboardAvoidingView
      style={styles.conteneur}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Carte principale */}
        <View style={styles.carte}>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>👋 Bon retour</Text>
          </View>

          {/* Titre */}
          <Text style={styles.titre}>Content de vous revoir</Text>
          <Text style={styles.sousTitre}>
            Connectez-vous pour accéder à votre espace OBUY.
          </Text>

          {/* Onglets Connexion / Inscription */}
          <View style={styles.onglets}>
            <View style={[styles.onglet, styles.ongletActif]}>
              <Text style={[styles.ongletTexte, styles.ongletTexteActif]}>
                Connexion
              </Text>
            </View>
            <TouchableOpacity
              style={styles.onglet}
              onPress={() => router.replace('/(auth)/inscription.auth')}
            >
              <Text style={styles.ongletTexte}>Inscription</Text>
            </TouchableOpacity>
          </View>

          {/* Formulaire */}
          <View style={styles.formulaire}>
            <MessageErreur message={erreurLocale ?? erreur} />

            <InputObuy
              label="ADRESSE EMAIL"
              valeur={email}
              surChangement={setEmail}
              placeholder="exemple@email.com"
              typeClavier="email-address"
              obligatoire
            />

            <InputObuy
              label="MOT DE PASSE"
              valeur={motDePasse}
              surChangement={setMotDePasse}
              placeholder="Votre mot de passe"
              estMotDePasse
              obligatoire
            />

            {/* Se souvenir + Mot de passe oublié */}
            <View style={styles.rangeeOptions}>
              <TouchableOpacity
                style={styles.souvenir}
                onPress={() => setSeSouvenir(v => !v)}
              >
                <View style={[styles.checkbox, sesouvenir && styles.checkboxActif]} />
                <Text style={styles.souvenirTexte}>Se souvenir de moi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/mot-de-passe-oublie.auth')}
              >
                <Text style={styles.lienOrange}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton connexion */}
            <BoutonObuy
              texte="→  Se connecter"
              surAppui={gererConnexion}
              chargement={chargement}
              pleineLargeur
            />

            {/* Lien inscription */}
            <View style={styles.lienInscription}>
              <Text style={styles.texteGris}>Pas encore membre ? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/inscription.auth')}
              >
                <Text style={styles.lienOrange}>Créer un compte</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flex:            1,
    backgroundColor: '#F0F2F5',
  },
  scroll: {
    flexGrow:        1,
    justifyContent:  'center',
    padding:         espacements.xl,
  },
  carte: {
    backgroundColor: couleurs.fond,
    borderRadius:    rayons.xl,
    padding:         espacements.xxl,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.08,
    shadowRadius:    12,
    elevation:       4,
  },
  badge: {
    alignSelf:       'flex-start',
    backgroundColor: '#FFF3E8',
    borderRadius:    rayons.pill,
    paddingVertical:   espacements.xs,
    paddingHorizontal: espacements.md,
    marginBottom:    espacements.md,
  },
  badgeTexte: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '600',
  },
  titre: {
    fontSize:     tailles.xxl,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: espacements.xs,
  },
  sousTitre: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    marginBottom: espacements.xl,
    lineHeight:   22,
  },
  onglets: {
    flexDirection:   'row',
    backgroundColor: '#F0F2F5',
    borderRadius:    rayons.sm,
    padding:         4,
    marginBottom:    espacements.xl,
  },
  onglet: {
    flex:            1,
    paddingVertical: espacements.sm,
    alignItems:      'center',
    borderRadius:    rayons.sm - 2,
  },
  ongletActif: {
    backgroundColor: couleurs.fond,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.05,
    shadowRadius:    4,
    elevation:       2,
  },
  ongletTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
    fontWeight: '500',
  },
  ongletTexteActif: {
    color:      couleurs.textePrincipal,
    fontWeight: '600',
  },
  formulaire: {
    marginTop: espacements.xs,
  },
  rangeeOptions: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   espacements.xl,
    marginTop:      -espacements.sm,
  },
  souvenir: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           espacements.xs,
  },
  checkbox: {
    width:        18,
    height:       18,
    borderRadius: 100,
    borderWidth:  1.5,
    borderColor:  couleurs.bordure,
  },
  checkboxActif: {
    backgroundColor: couleurs.primaire,
    borderColor:     couleurs.primaire,
  },
  souvenirTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
  lienOrange: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '600',
  },
  lienInscription: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    marginTop:      espacements.xl,
  },
  texteGris: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
  },
})
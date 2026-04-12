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
import InputObuy from '../../composants/ui/InputObuy.ui'
import BoutonObuy from '../../composants/ui/BoutonObuy.ui'
import MessageErreur from '../../composants/ui/MessageErreur.ui'
import { motDePasseOublie } from '../../services/api/auth.service'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

export default function EcranMotDePasseOublie() {
  const [email, setEmail]               = useState('')
  const [chargement, setChargement]     = useState(false)
  const [erreurLocale, setErreurLocale] = useState<string | null>(null)
  const [succes, setSucces]             = useState(false)

  async function gererReinitialisation() {
    setErreurLocale(null)

    if (!email.trim()) {
      setErreurLocale('Veuillez saisir votre adresse email.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErreurLocale('Adresse email invalide.')
      return
    }

    try {
      setChargement(true)
      await motDePasseOublie(email.trim())
      setSucces(true)
    } catch (e) {
      setErreurLocale(e instanceof Error ? e.message : 'Une erreur est survenue.')
    } finally {
      setChargement(false)
    }
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
        <View style={styles.carte}>

          {/* Titre */}
          <Text style={styles.titre}>Mot de passe oublié</Text>

          {!succes ? (
            <>
              {/* Description */}
              <Text style={styles.description}>
                Veuillez saisir votre adresse e-mail. Vous recevrez un lien pour créer un nouveau mot de passe.
              </Text>

              <MessageErreur message={erreurLocale} />

              <InputObuy
                label="IDENTIFIANT OU E-MAIL"
                valeur={email}
                surChangement={setEmail}
                placeholder="exemple@email.com"
                typeClavier="email-address"
                obligatoire
              />

              <BoutonObuy
                texte="Réinitialisation du mot de passe"
                surAppui={gererReinitialisation}
                chargement={chargement}
                pleineLargeur
              />
            </>
          ) : (
            /* Message de succès */
            <View style={styles.succes}>
              <Text style={styles.succesIcone}>✓</Text>
              <Text style={styles.succesTexte}>
                Un lien de réinitialisation a été envoyé à {email}.
              </Text>
              <Text style={styles.succesHint}>
                Vérifiez votre boîte mail et suivez les instructions.
              </Text>
            </View>
          )}

          {/* Lien retour connexion */}
          <TouchableOpacity
            style={styles.lienRetour}
            onPress={() => router.replace('/(auth)/connexion.auth')}
          >
            <Text style={styles.lienRetourTexte}>← Retour à la connexion</Text>
          </TouchableOpacity>

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
  titre: {
    fontSize:     tailles.xxl,
    fontFamily:   appConfig.theme.polices.titre,
    color:        couleurs.textePrincipal,
    fontWeight:   '700',
    marginBottom: espacements.md,
  },
  description: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    lineHeight:   22,
    marginBottom: espacements.xl,
  },
  succes: {
    alignItems:   'center',
    paddingVertical: espacements.xl,
  },
  succesIcone: {
    fontSize:     48,
    color:        couleurs.succes,
    marginBottom: espacements.lg,
  },
  succesTexte: {
    fontSize:     tailles.md,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.textePrincipal,
    fontWeight:   '600',
    textAlign:    'center',
    marginBottom: espacements.sm,
  },
  succesHint: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
    textAlign:  'center',
    lineHeight: 22,
  },
  lienRetour: {
    alignItems:  'center',
    marginTop:   espacements.xl,
  },
  lienRetourTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '500',
  },
})
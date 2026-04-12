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
import { validerCode, verifierEmail } from '../../services/api/auth.service'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

type Etape = 'email' | 'code' | 'infos'
type Role  = 'client' | 'vendeur'

export default function EcranInscription() {
  const { inscrire, chargement, erreur } = useAuth()

  // Moi j'ai adapter le long formulaire du site en 
  // 3 slides pour rentre les choses faciles sur ecrans de
  // telephones
  const [etape, setEtape]               = useState<Etape>('email')
  const [role, setRole]                 = useState<Role>('client')
  const [erreurLocale, setErreurLocale] = useState<string | null>(null)

  // Champs communs
  const [email, setEmail]               = useState('')
  const [code, setCode]                 = useState('')
  const [prenom, setPrenom]             = useState('')
  const [nom, setNom]                   = useState('')
  const [motDePasse, setMotDePasse]     = useState('')
  const [confirmMdp, setConfirmMdp]     = useState('')

  // Champs vendeur
  const [telephone, setTelephone]       = useState('')
  const [nomBoutique, setNomBoutique]   = useState('')
  const [urlBoutique, setUrlBoutique]   = useState('')

  // Étape 1 : vérification email 
  async function gererEnvoiEmail() {
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
      await verifierEmail(email.trim())
      setEtape('code')
    } catch (e) {
      setErreurLocale(e instanceof Error ? e.message : 'Erreur lors de l\'envoi.')
    }
  }

  // Étape 2 : validation du code 
  async function gererValidationCode() {
    setErreurLocale(null)
    if (!code.trim()) {
      setErreurLocale('Veuillez saisir le code reçu par email.')
      return
    }
    try {
      await validerCode(email.trim(), code.trim())
      setEtape('infos')
    } catch (e) {
      setErreurLocale(e instanceof Error ? e.message : 'Code incorrect.')
    }
  }

  // Étape 3 : création du compte 
  async function gererInscription() {
    setErreurLocale(null)

    if (!prenom.trim() || !nom.trim()) {
      setErreurLocale('Veuillez renseigner votre prénom et nom.')
      return
    }
    if (!motDePasse.trim()) {
      setErreurLocale('Veuillez saisir un mot de passe.')
      return
    }
    if (motDePasse !== confirmMdp) {
      setErreurLocale('Les mots de passe ne correspondent pas.')
      return
    }
    if (motDePasse.length < 8) {
      setErreurLocale('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (role === 'vendeur') {
      if (!telephone.trim() || !nomBoutique.trim() || !urlBoutique.trim()) {
        setErreurLocale('Veuillez renseigner tous les champs vendeur.')
        return
      }
    }

    const donnees = role === 'vendeur'
      ? { nom, prenom, email, motDePasse, confirmationMotDePasse: confirmMdp, telephone, nomBoutique, lienBoutique: urlBoutique }
      : { nom, prenom, email, motDePasse, confirmationMotDePasse: confirmMdp }

    await inscrire(donnees)
    router.replace('/(auth)/connexion.auth')
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

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>Nouveau ici ?</Text>
          </View>

          {/* Titre */}
          <Text style={styles.titre}>Créez votre compte gratuit</Text>
          <Text style={styles.sousTitre}>
            Rejoignez la marketplace africaine OBUY.
          </Text>

          {/* Onglets */}
          <View style={styles.onglets}>
            <TouchableOpacity
              style={styles.onglet}
              onPress={() => router.replace('/(auth)/connexion.auth')}
            >
              <Text style={styles.ongletTexte}>Connexion</Text>
            </TouchableOpacity>
            <View style={[styles.onglet, styles.ongletActif]}>
              <Text style={[styles.ongletTexte, styles.ongletTexteActif]}>
                Inscription
              </Text>
            </View>
          </View>

          {/* Indicateur d'étape */}
          <View style={styles.indicateurEtapes}>
            {(['email', 'code', 'infos'] as Etape[]).map((e, i) => (
              <View key={e} style={styles.indicateurRangee}>
                <View style={[
                  styles.indicateurPoint,
                  etape === e        && styles.indicateurActif,
                  etape === 'code'   && i === 0 && styles.indicateurFait,
                  etape === 'infos'  && i < 2   && styles.indicateurFait,
                ]} />
                {i < 2 && <View style={styles.indicateurLigne} />}
              </View>
            ))}
          </View>

          <MessageErreur message={erreurLocale ?? erreur} />

          {/*  Étape 1 : Email  */}
          {etape === 'email' && (
            <View>
              <InputObuy
                label="ADRESSE EMAIL"
                valeur={email}
                surChangement={setEmail}
                placeholder="exemple@email.com"
                typeClavier="email-address"
                obligatoire
              />
              <BoutonObuy
                texte="Continuer"
                surAppui={gererEnvoiEmail}
                chargement={chargement}
                pleineLargeur
              />
            </View>
          )}

          {/* Étape 2 : Code */}
          {etape === 'code' && (
            <View>
              <Text style={styles.infoEmail}>
                Un code de vérification a été envoyé à {email}
              </Text>
              <InputObuy
                label="CODE DE VÉRIFICATION"
                valeur={code}
                surChangement={setCode}
                placeholder="123456"
                typeClavier="numeric"
                obligatoire
              />
              <BoutonObuy
                texte="Vérifier le code"
                surAppui={gererValidationCode}
                chargement={chargement}
                pleineLargeur
              />
              <TouchableOpacity
                style={styles.lienRetour}
                onPress={() => setEtape('email')}
              >
                <Text style={styles.lienRetourTexte}>Modifier l'adresse email</Text>
              </TouchableOpacity>
            </View>
          )}

          {/*  Étape 3 : Infos  */}
          {etape === 'infos' && (
            <View>
              {/* Choix du rôle */}
              <Text style={styles.labelRole}>Je suis</Text>
              <View style={styles.rolesConteneur}>
                <TouchableOpacity
                  style={[styles.roleOption, role === 'client' && styles.roleActif]}
                  onPress={() => setRole('client')}
                >
                  <View style={[styles.radio, role === 'client' && styles.radioActif]} />
                  <Text style={styles.roleTexte}>Un client</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleOption, role === 'vendeur' && styles.roleActif]}
                  onPress={() => setRole('vendeur')}
                >
                  <View style={[styles.radio, role === 'vendeur' && styles.radioActif]} />
                  <Text style={styles.roleTexte}>Un vendeur</Text>
                </TouchableOpacity>
              </View>

              <InputObuy
                label="PRÉNOM"
                valeur={prenom}
                surChangement={setPrenom}
                placeholder="Votre prénom"
                obligatoire
              />
              <InputObuy
                label="NOM"
                valeur={nom}
                surChangement={setNom}
                placeholder="Votre nom"
                obligatoire
              />

              {role === 'vendeur' && (
                <>
                  <InputObuy
                    label="NOM DE LA BOUTIQUE"
                    valeur={nomBoutique}
                    surChangement={setNomBoutique}
                    placeholder="Ma boutique OBUY"
                    obligatoire
                  />
                  <InputObuy
                    label="URL DE LA BOUTIQUE"
                    valeur={urlBoutique}
                    surChangement={setUrlBoutique}
                    placeholder="ma-boutique"
                    obligatoire
                  />
                  <Text style={styles.urlHint}>
                    https://obuy.cloud/store/{urlBoutique || 'ma-boutique'}
                  </Text>
                  <InputObuy
                    label="NUMÉRO DE TÉLÉPHONE"
                    valeur={telephone}
                    surChangement={setTelephone}
                    placeholder="+237 6XX XXX XXX"
                    typeClavier="phone-pad"
                    obligatoire
                  />
                </>
              )}

              <InputObuy
                label="MOT DE PASSE"
                valeur={motDePasse}
                surChangement={setMotDePasse}
                placeholder="Minimum 8 caractères"
                estMotDePasse
                obligatoire
              />
              <InputObuy
                label="CONFIRMER LE MOT DE PASSE"
                valeur={confirmMdp}
                surChangement={setConfirmMdp}
                placeholder="Répétez votre mot de passe"
                estMotDePasse
                obligatoire
              />

              {/* Politique */}
              <Text style={styles.politique}>
                Vos données personnelles seront utilisées pour gérer votre compte et améliorer votre expérience sur OBUY.{' '}
                <Text
                  style={styles.lienOrange}
                  onPress={() => {}}
                >
                  Politique de confidentialité
                </Text>
              </Text>

              <BoutonObuy
                texte="Créer mon compte"
                surAppui={gererInscription}
                chargement={chargement}
                pleineLargeur
              />
            </View>
          )}

          {/* Lien connexion */}
          <View style={styles.lienConnexion}>
            <Text style={styles.texteGris}>Déjà membre ? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/connexion.auth')}>
              <Text style={styles.lienOrange}>Se connecter</Text>
            </TouchableOpacity>
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
    flexGrow:   1,
    padding:    espacements.xl,
    paddingTop: espacements.xxl,
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
    alignSelf:         'flex-start',
    backgroundColor:   '#FFF3E8',
    borderRadius:      rayons.pill,
    paddingVertical:   espacements.xs,
    paddingHorizontal: espacements.md,
    marginBottom:      espacements.md,
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
  indicateurEtapes: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    marginBottom:   espacements.xl,
  },
  indicateurRangee: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  indicateurPoint: {
    width:        12,
    height:       12,
    borderRadius: 6,
    borderWidth:  2,
    borderColor:  couleurs.bordure,
    backgroundColor: couleurs.fond,
  },
  indicateurActif: {
    borderColor:     couleurs.primaire,
    backgroundColor: couleurs.primaire,
  },
  indicateurFait: {
    borderColor:     couleurs.succes,
    backgroundColor: couleurs.succes,
  },
  indicateurLigne: {
    width:           32,
    height:          2,
    backgroundColor: couleurs.bordure,
    marginHorizontal: 4,
  },
  infoEmail: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    marginBottom: espacements.lg,
    lineHeight:   22,
  },
  lienRetour: {
    alignItems: 'center',
    marginTop:  espacements.lg,
  },
  lienRetourTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '500',
  },
  labelRole: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.textePrincipal,
    fontWeight:   '500',
    marginBottom: espacements.sm,
  },
  rolesConteneur: {
    marginBottom: espacements.lg,
    gap:          espacements.sm,
  },
  roleOption: {
    flexDirection:   'row',
    alignItems:      'center',
    padding:         espacements.md,
    borderRadius:    rayons.sm,
    borderWidth:     1,
    borderColor:     couleurs.bordure,
    gap:             espacements.sm,
  },
  roleActif: {
    borderColor:     couleurs.primaire,
    backgroundColor: '#FFF3E8',
  },
  radio: {
    width:        18,
    height:       18,
    borderRadius: 9,
    borderWidth:  2,
    borderColor:  couleurs.bordure,
  },
  radioActif: {
    borderColor:     couleurs.primaire,
    backgroundColor: couleurs.primaire,
  },
  roleTexte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.textePrincipal,
  },
  urlHint: {
    fontSize:     tailles.sm,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteTertiaire,
    marginTop:    -espacements.md,
    marginBottom: espacements.lg,
  },
  politique: {
    fontSize:     tailles.sm,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.texteSecondaire,
    lineHeight:   20,
    marginBottom: espacements.lg,
  },
  lienOrange: {
    color:      couleurs.primaire,
    fontWeight: '600',
  },
  lienConnexion: {
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
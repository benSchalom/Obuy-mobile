import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as SecureStore from 'expo-secure-store'
import type {
  Utilisateur,
  EtatAuth,
  DonneesConnexion,
  DonneesInscriptionClient,
  DonneesInscriptionLivreur,
  DonneesInscriptionVendeur,
} from '../types/auth.types'
import { appConfig } from '../config/appConfig'
import {
  mockUtilisateurClient,
  mockErreurs,
} from '../mocks/auth.mock'

// Clés de stockage sécurisé 
const CLE_JETON              = 'obuy_jeton'
const CLE_JETON_RAFRAICH     = 'obuy_jeton_rafraichissement'
const CLE_UTILISATEUR        = 'obuy_utilisateur'

// Type du contexte 
type ContexteAuthType = EtatAuth & {
  connecter:   (donnees: DonneesConnexion) => Promise<void>
  deconnecter: () => Promise<void>
  inscrire: (
    donnees:
      | DonneesInscriptionClient
      | DonneesInscriptionLivreur
      | DonneesInscriptionVendeur
  ) => Promise<void>
}

// Création du contexte
const ContexteAuth = createContext<ContexteAuthType | null>(null)

// Fournisseur du contexte 
export function FournisseurAuth({ children }: { children: React.ReactNode }) {
  const [etat, setEtat] = useState<EtatAuth>({
    utilisateur: null,
    estConnecte:  false,
    chargement:   true,
    erreur:       null,
  })

  // Vérification du jeton au démarrage
  useEffect(() => {
    verifierSession()
  }, [])

  async function verifierSession() {
    try {
      const utilisateurStocke = await SecureStore.getItemAsync(CLE_UTILISATEUR)
      if (utilisateurStocke) {
        const utilisateur: Utilisateur = JSON.parse(utilisateurStocke)
        setEtat({
          utilisateur,
          estConnecte: true,
          chargement:  false,
          erreur:      null,
        })
      } else {
        setEtat(e => ({ ...e, chargement: false }))
      }
    } catch {
      setEtat(e => ({ ...e, chargement: false }))
    }
  }

  async function connecter(donnees: DonneesConnexion) {
    setEtat(e => ({ ...e, chargement: true, erreur: null }))
    try {
      let utilisateur: Utilisateur

      if (appConfig.dev?.useMock) {
        // Mode mock simulation connexion
        await new Promise(r => setTimeout(r, 800))
        if (
          donnees.email     === appConfig.dev.utilisateurTest.email &&
          donnees.motDePasse === appConfig.dev.utilisateurTest.motDePasse
        ) {
          utilisateur = mockUtilisateurClient
        } else {
          throw new Error(mockErreurs.connexionInvalide)
        }
      } else {
        // Mode production appel API réel (à implémenter)
        throw new Error('Service API non encore configuré')
      }

      // Stockage sécurisé
      await SecureStore.setItemAsync(CLE_JETON, utilisateur.jeton)
      await SecureStore.setItemAsync(CLE_JETON_RAFRAICH, utilisateur.jetonRafraichissement)
      await SecureStore.setItemAsync(CLE_UTILISATEUR, JSON.stringify(utilisateur))

      setEtat({
        utilisateur,
        estConnecte: true,
        chargement:  false,
        erreur:      null,
      })
    } catch (erreur) {
      setEtat(e => ({
        ...e,
        chargement: false,
        erreur: erreur instanceof Error ? erreur.message : 'Erreur inconnue',
      }))
    }
  }

  async function deconnecter() {
    await SecureStore.deleteItemAsync(CLE_JETON)
    await SecureStore.deleteItemAsync(CLE_JETON_RAFRAICH)
    await SecureStore.deleteItemAsync(CLE_UTILISATEUR)
    setEtat({
      utilisateur: null,
      estConnecte:  false,
      chargement:   false,
      erreur:       null,
    })
  }

  async function inscrire(
    donnees:
      | DonneesInscriptionClient
      | DonneesInscriptionLivreur
      | DonneesInscriptionVendeur
  ) {
    setEtat(e => ({ ...e, chargement: true, erreur: null }))
    try {
      if (appConfig.dev?.useMock) {
        // Mode mock simulation inscription
        await new Promise(r => setTimeout(r, 1000))
        // Succès simulé en prod on connecterait l'utilisateur ici
      } else {
        throw new Error('Service API non encore configuré')
      }
      setEtat(e => ({ ...e, chargement: false }))
    } catch (erreur) {
      setEtat(e => ({
        ...e,
        chargement: false,
        erreur: erreur instanceof Error ? erreur.message : 'Erreur inconnue',
      }))
    }
  }

  return (
    <ContexteAuth.Provider value={{ ...etat, connecter, deconnecter, inscrire }}>
      {children}
    </ContexteAuth.Provider>
  )
}

// Hook d'accès au contexte 
export function useAuth(): ContexteAuthType {
  const contexte = useContext(ContexteAuth)
  if (!contexte) {
    throw new Error('useAuth doit être utilisé dans FournisseurAuth')
  }
  return contexte
}

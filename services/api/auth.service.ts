import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { config } from '../../config/environnement'
import { appConfig } from '../../config/appConfig'
import type {
  DonneesConnexion,
  ReponseJWT,
  ProfilUtilisateur,
  ReponseAuth,
  DonneesInscriptionClient,
  DonneesInscriptionLivreur,
  DonneesInscriptionVendeur,
} from '../../types/auth.types'
import {
  mockReponseJWT,
  mockUtilisateurClient,
  CODE_VERIFICATION_DEV,
} from '../../mocks/auth.mock'
import {
  adapterReponseAuth,
} from '../adaptateurs/auth.adaptateur'

// Instance axios 
const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Intercepteur — ajout du jeton sur chaque requête 
api.interceptors.request.use(async (requete) => {
  const jeton = await SecureStore.getItemAsync('obuy_jeton')
  if (jeton) {
    requete.headers.Authorization = `Bearer ${jeton}`
  }
  return requete
})

// Intercepteur rafraîchissement silencieux 
api.interceptors.response.use(
  (reponse) => reponse,
  async (erreur) => {
    const requeteOriginale = erreur.config
    if (erreur.response?.status === 401 && !requeteOriginale._dejaRetente) {
      requeteOriginale._dejaRetente = true
      try {
        const jetonRafraich = await SecureStore.getItemAsync('obuy_jeton_rafraichissement')
        if (!jetonRafraich) throw new Error('Pas de jeton de rafraîchissement')

        // TODO: Appel refresh (à adapter selon l'endpoint réel)
        const { data } = await axios.post(
          `${config.apiUrl}/jwt-auth/v1/token/refresh`,
          { refresh_token: jetonRafraich }
        )
        await SecureStore.setItemAsync('obuy_jeton', data.token)
        requeteOriginale.headers.Authorization = `Bearer ${data.token}`
        return api(requeteOriginale)
      } catch {
        await SecureStore.deleteItemAsync('obuy_jeton')
        await SecureStore.deleteItemAsync('obuy_jeton_rafraichissement')
        await SecureStore.deleteItemAsync('obuy_utilisateur')
        return Promise.reject(erreur)
      }
    }
    return Promise.reject(erreur)
  }
)

// Connexion
export async function connecter(
  donnees: DonneesConnexion
): Promise<ReponseAuth> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 800))
    if (
      donnees.email      !== appConfig.dev.utilisateurTest.email ||
      donnees.motDePasse !== appConfig.dev.utilisateurTest.motDePasse
    ) {
      throw new Error('Email ou mot de passe incorrect.')
    }
    return {
      utilisateur:           mockUtilisateurClient,
      jeton:                 mockReponseJWT.token,
      jetonRafraichissement: 'refresh_mock_token_456',
    }
  }

  // Mode production
  const { data: jwt } = await api.post<ReponseJWT>(
    '/jwt-auth/v1/token',
    { username: donnees.email, password: donnees.motDePasse }
  )
  const { data: profil } = await api.get<ProfilUtilisateur>('/wp/v2/users/me')
  return adapterReponseAuth(jwt, profil, '')
}

// Vérification email 
export async function verifierEmail(email: string): Promise<void> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 600))
    // En dev on simule l'envoi pas de vrai email
    return
  }
  await api.post('/obuy/v1/auth/verify-email', { email })
}

// Validation code
export async function validerCode(
  email: string,
  code: string
): Promise<void> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 400))
    if (code !== CODE_VERIFICATION_DEV) {
      throw new Error('Le code de vérification est incorrect.')
    }
    return
  }
  await api.post('/obuy/v1/auth/validate-code', { email, code })
}

// Inscription 
export async function inscrire(
  donnees:
    | DonneesInscriptionClient
    | DonneesInscriptionLivreur
    | DonneesInscriptionVendeur
): Promise<void> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 1000))
    return
  }
  await api.post('/wp/v2/users', donnees)
}

// Mot de passe oublié 
export async function motDePasseOublie(email: string): Promise<void> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 600))
    return
  }
  await api.post('/obuy/v1/auth/forgot-password', { email })
}

export default api

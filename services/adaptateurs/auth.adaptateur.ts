import type {
  ReponseJWT,
  ProfilUtilisateur,
  Utilisateur,
  ReponseAuth,
} from '../../types/auth.types'


/**
 * Convertit le rôle WP vers le rôle de l'app
 * WooCommerce utilise des roles en anglais
 * cette fonction me permet de adapter au contexte de mon app
 * @param roles roles de l'utilisateur retourné par woocommerce
 * @returns 
 */ 
function convertirRole(
  roles: ProfilUtilisateur['roles']
): Utilisateur['role'] {
  if (roles.includes('vendor'))          return 'vendeur'
  if (roles.includes('delivery_person')) return 'livreur'
  return 'client'
}

// Construit un Utilisateur normalisé 
// à partir de la réponse JWT + le profil complet wp/v2/users/me
/**
 * Construit un Utilisateur normalisé 
 * à partir de la réponse JWT + le profil complet wp/v2/users/me
 * JWT retourne tres peu d'informations, on lance une deuxieme requete
 * pour avoir toutes les infos necessaires 
 */
export function adapterUtilisateur(
  reponseJWT:  ReponseJWT,
  profil:      ProfilUtilisateur,
): Utilisateur {
  return {
    id:                    profil.id,
    nom:                   profil.last_name,
    prenom:                profil.first_name,
    email:                 profil.email,
    nomUtilisateur:        profil.username,
    role:                  convertirRole(profil.roles),
    avatar:                profil.avatar_urls['96'] ?? '',
    jeton:                 reponseJWT.token,
    jetonRafraichissement: '',
  }
}

// Construit une ReponseAuth complète
export function adapterReponseAuth(
  reponseJWT: ReponseJWT,
  profil:     ProfilUtilisateur,
  jetonRafraichissement: string,
): ReponseAuth {
  const utilisateur = adapterUtilisateur(reponseJWT, profil)
  return {
    utilisateur: {
      ...utilisateur,
      jetonRafraichissement,
    },
    jeton:                 reponseJWT.token,
    jetonRafraichissement,
  }
}

// Version mock (dev uniquement) 
import { mockReponseAuth } from '../../mocks/auth.mock'
import { appConfig }       from '../../config/appConfig'

export function adapterReponseAuthMock(): ReponseAuth {
  if (!appConfig.dev?.useMock) {
    throw new Error('adapterReponseAuthMock appelé en dehors du mode dev')
  }
  return mockReponseAuth
}

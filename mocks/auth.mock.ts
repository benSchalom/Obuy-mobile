import type {
  ReponseJWT,
  Utilisateur,
  ReponseAuth,
} from '../types/auth.types'

// Réponse JWT simulée (connexion réussie) 
export const mockReponseJWT: ReponseJWT = {
  token:             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
  user_email:        'ben@obuy.cloud',
  user_nicename:     'ben-test',
  user_display_name: 'Ben Test',
}

// Utilisateur client simulé 
export const mockUtilisateurClient: Utilisateur = {
  id:                    1,
  nom:                   'Kamga',
  prenom:                'Ben',
  email:                 'ben@obuy.cloud',
  nomUtilisateur:        'ben-test',
  role:                  'client',
  avatar:                'https://obuy.cloud/wp-content/uploads/avatars/1.jpg',
  jeton:                 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
  jetonRafraichissement: 'refresh_mock_token_456',
}

// Utilisateur vendeur simulé 
export const mockUtilisateurVendeur: Utilisateur = {
  id:                    2,
  nom:                   'Dupont',
  prenom:                'Marie',
  email:                 'vendor.e2e@obuy.cloud',
  nomUtilisateur:        'vendor-e2e',
  role:                  'vendeur',
  avatar:                'https://obuy.cloud/wp-content/uploads/avatars/2.jpg',
  jeton:                 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.vendor',
  jetonRafraichissement: 'refresh_mock_vendor_789',
}

// Utilisateur livreur simulé 
export const mockUtilisateurLivreur: Utilisateur = {
  id:                    4,
  nom:                   'Nguele',
  prenom:                'Paul',
  email:                 'livreur1@obuy.cloud',
  nomUtilisateur:        'livreur1',
  role:                  'livreur',
  avatar:                'https://obuy.cloud/wp-content/uploads/avatars/4.jpg',
  jeton:                 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.livreur',
  jetonRafraichissement: 'refresh_mock_livreur_012',
}

// Réponse auth complète simulée 
export const mockReponseAuth: ReponseAuth = {
  utilisateur:           mockUtilisateurClient,
  jeton:                 mockUtilisateurClient.jeton,
  jetonRafraichissement: mockUtilisateurClient.jetonRafraichissement,
}

// Erreurs simulées
export const mockErreurs = {
  connexionInvalide:   'Email ou mot de passe incorrect.',
  emailDejaUtilise:    'Un compte existe déjà avec cet email.',
  codeInvalid:         'Le code de vérification est incorrect.',
  codeExpire:          'Le code de vérification a expiré.',
  reseauIndisponible:  'Impossible de contacter le serveur.',
}

// Code de vérification email fixe en dev 
export const CODE_VERIFICATION_DEV = '123456'

// Credentials de test 
export const CREDENTIALS_TEST = {
  client: {
    email:      'ben@obuy.cloud',
    motDePasse: 'Test2026!',
  },
  vendeur: {
    email:      'vendor.e2e@obuy.cloud',
    motDePasse: 'VendorE2E2026!',
  },
  livreur: {
    email:      'livreur1@obuy.cloud',
    motDePasse: 'Livreur2026!',
  },
}

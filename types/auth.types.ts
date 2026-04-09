// Réponse brute JWT (ce que l'API retourne) 
export type ReponseJWT = {
  token:              string
  user_email:         string
  user_nicename:      string
  user_display_name:  string
}

// Profil complet (wp/v2/users/me après connexion) 
export type ProfilUtilisateur = {
  id:         number
  username:   string
  first_name: string
  last_name:  string
  email:      string
  roles:      Array<'customer' | 'vendor' | 'delivery_person' | 'administrator'>
  avatar_urls: {
    '24': string
    '48': string
    '96': string
  }
  dokan_meta: object
}

// Utilisateur normalisé (utilisé dans l'app)
export type Utilisateur = {
  id:         number
  nom:        string
  prenom:     string
  email:      string
  nomUtilisateur: string
  role:       'client' | 'vendeur' | 'livreur'
  avatar:     string
  jeton:      string
  jetonRafraichissement: string
}

// Formulaire de connexion 
export type DonneesConnexion = {
  email:      string
  motDePasse: string
}

// Vérification email — étape 1 inscription 
export type DonneesVerificationEmail = {
  email: string
}

// Validation code — étape 2 inscription 
export type DonneesValidationCode = {
  email: string
  code:  string
}

// Inscription client — étape 3 
export type DonneesInscriptionClient = {
  nom:                    string
  prenom:                 string
  email:                  string
  motDePasse:             string
  confirmationMotDePasse: string
}

// Inscription livreur — étape 3 
export type DonneesInscriptionLivreur = {
  nom:                    string
  prenom:                 string
  email:                  string
  telephone:              string
  motDePasse:             string
  confirmationMotDePasse: string
}

// Inscription vendeur — étape 3 
export type DonneesInscriptionVendeur = {
  nom:                    string
  prenom:                 string
  email:                  string
  telephone:              string
  nomBoutique:            string
  lienBoutique:           string
  motDePasse:             string
  confirmationMotDePasse: string
}

// Mot de passe oublié 
export type DonneesMotDePasseOublie = {
  email: string
}

// État d'authentification global 
export type EtatAuth = {
  utilisateur:      Utilisateur | null
  estConnecte:      boolean
  chargement:       boolean
  erreur:           string | null
}

// Réinitialisation mot de passe 
export type DonneesReinitialisationMotDePasse = {
  email:                  string
  code:                   string
  nouveauMotDePasse:      string
  confirmationMotDePasse: string
}

// Erreurs de formulaire 
export type ErreursFormulaire = {
  [champ: string]: string | undefined
}
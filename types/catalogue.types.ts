// Catégorie simple (dans un produit) 
export type CategorieSimple = {
  id:   number
  nom:  string
  slug: string
}

// Catégorie complète (liste des catégories) 
export type Categorie = {
  id:    number
  nom:   string
  slug:  string
  image: string | null
  count: number
}

//  Vendeur simplifié (sur une carte produit) 
export type VendeurSimple = {
  id:  number
  nom: string
}

//  Produit normalisé 
export type Produit = {
  id:                number
  nom:               string
  slug:              string
  prix:              string
  prixRegulier:      string
  prixSolde:         string
  enSolde:           boolean
  pourcentageRemise: number | null
  enStock:           boolean
  image:             string
  images:            string[]
  description:       string
  descriptionCourte: string
  categories:        CategorieSimple[]
  vendeur:           VendeurSimple | null
  note:              string
  nbAvis:            number
}

//  Avis produit 
export type Avis = {
  id:          number
  auteur:      string
  avatar:      string
  note:        number
  commentaire: string
  date:        string
}

//  Bannière hero 
export type Banniere = {
  id:          number
  titre:       string
  sousTitre:   string
  description: string
  image:       string
  lien:        string
}

// Filtres shop 
export type FiltreShop = {
  tri:       'default' | 'price' | 'price-desc' | 'date' | 'rating'
  categorie: string | null
  page:      number
  parPage:   number
}

//  Résultat paginé 
export type ResultatPagine<T> = {
  donnees:    T[]
  total:      number
  totalPages: number
  page:       number
}

// État catalogue 
export type EtatCatalogue = {
  produits:    Produit[]
  categories:  Categorie[]
  chargement:  boolean
  erreur:      string | null
  filtres:     FiltreShop
}
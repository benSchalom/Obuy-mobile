import type {
  Produit,
  Categorie,
  Avis,
} from '../../types/catalogue.types'

// Adapte un produit brut WooCommerce en Produit normalisé
export function adapterProduit(raw: any): Produit {
  const prixRegulier = raw.regular_price || raw.price || '0'
  const prixSolde    = raw.sale_price || ''
  const enSolde      = raw.on_sale === true && !!prixSolde

  let pourcentageRemise: number | null = null
  if (enSolde && parseFloat(prixRegulier) > 0) {
    pourcentageRemise = Math.round(
      ((parseFloat(prixRegulier) - parseFloat(prixSolde)) / parseFloat(prixRegulier)) * 100
    )
  }

  return {
    id:                raw.id,
    nom:               raw.name || '',
    slug:              raw.slug || '',
    prix:              raw.price || '0',
    prixRegulier,
    prixSolde,
    enSolde,
    pourcentageRemise,
    enStock:           raw.stock_status === 'instock',
    image:             raw.images?.[0]?.src || '',
    images:            (raw.images || []).map((img: any) => img.src),
    description:       raw.description || '',
    descriptionCourte: raw.short_description || '',
    categories:        (raw.categories || []).map((cat: any) => ({
      id:   cat.id,
      nom:  cat.name,
      slug: cat.slug,
    })),
    vendeur: raw.store
      ? { id: raw.store.id, nom: raw.store.shop_name }
      : null,
    note:    raw.average_rating || '0',
    nbAvis:  raw.rating_count   || 0,
  }
}

// Adapte une catégorie brute WooCommerce en Categorie normalisée
export function adapterCategorie(raw: any): Categorie {
  return {
    id:    raw.id,
    nom:   raw.name  || '',
    slug:  raw.slug  || '',
    image: raw.image?.src || null,
    count: raw.count || 0,
  }
}

// Adapte un avis brut WooCommerce en Avis normalisé
export function adapterAvis(raw: any): Avis {
  return {
    id:          raw.id,
    auteur:      raw.reviewer      || 'Anonyme',
    avatar:      raw.reviewer_avatar_urls?.['48'] || '',
    note:        raw.rating        || 0,
    commentaire: raw.review        || '',
    date:        raw.date_created  || '',
  }
}

//Adapte un tableau de produits
export function adapterProduits(raws: any[]): Produit[] {
  return raws.map(adapterProduit)
}

// Adapte un tableau de catégories
export function adapterCategories(raws: any[]): Categorie[] {
  return raws.map(adapterCategorie)
}

// Adapte un tableau d'avis
export function adapterAvisList(raws: any[]): Avis[] {
  return raws.map(adapterAvis)
}
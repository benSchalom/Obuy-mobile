import api from './auth.service'
import { appConfig } from '../../config/appConfig'
import type {
  Produit,
  Categorie,
  Avis,
  FiltreShop,
  ResultatPagine,
} from '../../types/catalogue.types'
import {
  adapterProduit,
  adapterProduits,
  adapterCategories,
  adapterAvisList,
} from '../adaptateurs/catalogue.adaptateur'
import {
  mockProduits,
  mockCategories,
  mockAvis,
  mockResultatProduits,
} from '../../mocks/catalogue.mock'

// Récupérer les produits avec filtres 
export async function obtenirProduits(
  filtres: Partial<FiltreShop> = {}
): Promise<ResultatPagine<Produit>> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 600))

    let produits = [...mockProduits]

    // Filtre par catégorie
    if (filtres.categorie) {
      produits = produits.filter(p =>
        p.categories.some(c => c.slug === filtres.categorie)
      )
    }

    // Tri
    if (filtres.tri === 'price') {
      produits.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix))
    } else if (filtres.tri === 'price-desc') {
      produits.sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix))
    }

    return {
      donnees:    produits,
      total:      produits.length,
      totalPages: 1,
      page:       filtres.page || 1,
    }
  }

  const params: any = {
    per_page: filtres.parPage || 16,
    page:     filtres.page    || 1,
    orderby:  filtres.tri === 'price' || filtres.tri === 'price-desc' ? 'price' : 'date',
    order:    filtres.tri === 'price-desc' ? 'desc' : 'asc',
  }
  if (filtres.categorie) params.category = filtres.categorie

  const reponse = await api.get('/wc/v3/products', { params })
  return {
    donnees:    adapterProduits(reponse.data),
    total:      parseInt(reponse.headers['x-wp-total'] || '0'),
    totalPages: parseInt(reponse.headers['x-wp-totalpages'] || '1'),
    page:       filtres.page || 1,
  }
}

//  Récupérer un produit par son slug 
export async function obtenirProduit(slug: string): Promise<Produit> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 400))
    const produit = mockProduits.find(p => p.slug === slug)
    if (!produit) throw new Error('Produit introuvable.')
    return produit
  }

  const reponse = await api.get('/wc/v3/products', { params: { slug } })
  if (!reponse.data.length) throw new Error('Produit introuvable.')
  return adapterProduit(reponse.data[0])
}

//Récupérer les catégories 
export async function obtenirCategories(): Promise<Categorie[]> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 300))
    return mockCategories
  }

  const reponse = await api.get('/wc/v3/products/categories', {
    params: { per_page: 100, hide_empty: true }
  })
  return adapterCategories(reponse.data)
}

// Récupérer les produits populaires 
export async function obtenirProduitsPopulaires(): Promise<Produit[]> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 500))
    return mockProduits.slice(0, 4)
  }

  const reponse = await api.get('/wc/v3/products', {
    params: { per_page: 8, orderby: 'popularity', order: 'desc' }
  })
  return adapterProduits(reponse.data)
}

// Récupérer les produits similaires 
export async function obtenirProduitsSimilaires(
  produitId: number,
  categorieSlug: string
): Promise<Produit[]> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 400))
    return mockProduits
      .filter(p => p.id !== produitId && p.categories.some(c => c.slug === categorieSlug))
      .slice(0, 4)
  }

  const reponse = await api.get('/wc/v3/products', {
    params: { category: categorieSlug, per_page: 4, exclude: produitId }
  })
  return adapterProduits(reponse.data)
}

// Récupérer les avis d'un produit 
export async function obtenirAvis(produitId: number): Promise<Avis[]> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 300))
    return mockAvis
  }

  const reponse = await api.get('/wc/v3/products/reviews', {
    params: { product: produitId, per_page: 10 }
  })
  return adapterAvisList(reponse.data)
}

// Rechercher des produits 
export async function rechercherProduits(
  recherche: string
): Promise<Produit[]> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 500))
    const terme = recherche.toLowerCase()
    return mockProduits.filter(p =>
      p.nom.toLowerCase().includes(terme) ||
      p.descriptionCourte.toLowerCase().includes(terme)
    )
  }

  const reponse = await api.get('/wc/v3/products', {
    params: { search: recherche, per_page: 20 }
  })
  return adapterProduits(reponse.data)
}

// Soumettre un avis 
export async function soumettreAvis(
  produitId: number,
  note:      number,
  commentaire: string,
  auteur:    string,
  email:     string,
): Promise<void> {
  if (appConfig.dev?.useMock) {
    await new Promise(r => setTimeout(r, 600))
    return
  }

  await api.post('/wc/v3/products/reviews', {
    product_id: produitId,
    rating:     note,
    review:     commentaire,
    reviewer:   auteur,
    reviewer_email: email,
  })
}
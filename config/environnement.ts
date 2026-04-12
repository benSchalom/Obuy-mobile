/**
 * Centralisation de la lecture des variables d,environement
 * ainsi au lieu d'ecrire process.env.EXPO_PUBLIC_API_URL
 * dans les autres fichiers, j'ecrirais juste config.apiUrl
 * ceci une centralisation de l'evolution des valeurs
 */


export const config = {
  apiUrl:    process.env.EXPO_PUBLIC_API_URL  ?? '',
  wcCle:     process.env.EXPO_PUBLIC_WC_KEY   ?? '',
  wcSecret:  process.env.EXPO_PUBLIC_WC_SECRET ?? '',
  useMock:   process.env.EXPO_PUBLIC_USE_MOCK === 'true',
}
const estEnDev = process.env.NODE_ENV === 'development'

export const appConfig = {

  // Definition du theme de l'application, conformement au site internet
  // J'ai utiliser un outil d'ia pour analyser le theme du site en ligne
  theme: {
    couleurs: {
      primaire:         '#FF7A00',
      primaireHover:    '#E86E00',
      primaireClair:    '#FFF3E8',
      textePrincipal:   '#1A1A1A',
      texteSecondaire:  '#4A4A4A',
      texteTertiaire:   '#8A8A8A',
      texteInverse:     '#FFFFFF',
      fond:             '#FFFFFF',
      surface:          '#F7F7F7',
      surface2:         '#F0F0F0',
      bordure:          '#E0E0E0',
      bordureForte:     '#C8C8C8',
      succes:           '#16A34A',
      erreur:           '#DC2626',
      avertissement:    '#D97706',
      topbar:           '#111827',
    },

    polices: {
      titre: 'Sora',
      corps: 'Inter',
    },

    tailles: {
      xs:      10,
      sm:      12,
      normale: 14,
      md:      15,
      lg:      18,
      xl:      24,
      xxl:     32,
    },

    espacements: {
      xs:  4,
      sm:  8,
      md:  12,
      lg:  16,
      xl:  24,
      xxl: 32,
      xxxl: 48,
    },

    rayons: {
      xs:   4,
      sm:   8,
      md:   12,
      lg:   16,
      xl:   24,
      pill: 100,
    },
  },

  // Theme du splash screen
  splash: {
    dureeMs: estEnDev ? 2000 : null,
  },

  // Configuration pour les test en dev, ils n'auront aucun impact en prod
  // TODO: supprimer ces configs en prod
  dev: estEnDev ? {
    codeVerificationEmail: '123456',
    utilisateurTest: {
      email:      'ben@obuy.cloud',
      motDePasse: 'Test2026!',
    },
    useMock: true,
  } : null,
}
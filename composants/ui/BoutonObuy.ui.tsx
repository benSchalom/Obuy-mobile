import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'
import { appConfig } from '../../config/appConfig'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

type PropsBouton = {
  texte:          string
  surAppui:       () => void
  variante?:      'primaire' | 'secondaire' | 'fantome'
  chargement?:    boolean
  desactive?:     boolean
  pleineLargeur?: boolean
}

export default function BoutonObuy({
  texte,
  surAppui,
  variante      = 'primaire',
  chargement    = false,
  desactive     = false,
  pleineLargeur = true,
}: PropsBouton) {
  const estDesactive = desactive || chargement

  return (
    <TouchableOpacity
      onPress={surAppui}
      disabled={estDesactive}
      activeOpacity={0.8}
      style={[
        styles.bouton,
        styles[variante],
        pleineLargeur && styles.pleineLargeur,
        estDesactive  && styles.desactive,
      ]}
    >
      {chargement ? (
        <ActivityIndicator
          color={variante === 'primaire' ? couleurs.texteInverse : couleurs.primaire}
          size="small"
        />
      ) : (
        <Text style={[styles.texte, styles[`texte_${variante}`]]}>
          {texte}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  bouton: {
    height:          48,
    borderRadius:    rayons.sm,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: espacements.xxl,
  },
  pleineLargeur: {
    width: '100%',
  },

  // Variantes
  primaire: {
    backgroundColor: couleurs.primaire,
  },
  secondaire: {
    backgroundColor: couleurs.surface,
    borderWidth:     1,
    borderColor:     couleurs.bordure,
  },
  fantome: {
    backgroundColor: 'transparent',
    borderWidth:     1,
    borderColor:     couleurs.primaire,
  },

  // Textes
  texte: {
    fontSize:   tailles.md,
    fontFamily: appConfig.theme.polices.corps,
    fontWeight: '600',
  },
  texte_primaire: {
    color: couleurs.texteInverse,
  },
  texte_secondaire: {
    color: couleurs.textePrincipal,
  },
  texte_fantome: {
    color: couleurs.primaire,
  },

  // État désactivé
  desactive: {
    opacity: 0.5,
  },
})

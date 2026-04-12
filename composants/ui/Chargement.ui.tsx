import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { appConfig } from '../../config/appConfig'

const { couleurs, tailles, espacements } = appConfig.theme

type PropsChargement = {
  message?: string
  pleinEcran?: boolean
}

export default function Chargement({
  message,
  pleinEcran = false,
}: PropsChargement) {
  return (
    <View style={[styles.conteneur, pleinEcran && styles.pleinEcran]}>
      <ActivityIndicator size="large" color={couleurs.primaire} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems:     'center',
    justifyContent: 'center',
    padding:        espacements.xl,
  },
  pleinEcran: {
    flex:            1,
    backgroundColor: couleurs.fond,
  },
  message: {
    marginTop:  espacements.md,
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteSecondaire,
    textAlign:  'center',
  },
})

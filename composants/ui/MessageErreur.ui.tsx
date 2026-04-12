import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { appConfig } from '../../config/appConfig'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

type PropsMessageErreur = {
  message: string | null
}

export default function MessageErreur({ message }: PropsMessageErreur) {
  if (!message) return null

  return (
    <View style={styles.conteneur}>
      <Text style={styles.texte}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    backgroundColor: '#FEF2F2',
    borderWidth:     1,
    borderColor:     couleurs.erreur,
    borderRadius:    rayons.sm,
    padding:         espacements.md,
    marginBottom:    espacements.lg,
  },
  texte: {
    fontSize:   tailles.normale,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.erreur,
    lineHeight: 20,
  },
})
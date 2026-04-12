import React, { useEffect } from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import { useAuth } from '../../contextes/auth.contexte'

SplashScreen.preventAutoHideAsync()

const { width, height } = Dimensions.get('window')

export default function SplashScreenAuth() {
  const { estConnecte, chargement } = useAuth()

  useEffect(() => {
    async function gererNavigation() {
      if (chargement) return

      // Durée splash en dev, automatique en prod
      const duree = appConfig.splash.dureeMs ?? 0
      if (duree > 0) {
        await new Promise(r => setTimeout(r, duree))
      }

      await SplashScreen.hideAsync()

      if (estConnecte) {
        router.replace('/(catalogue)/accueil')
      } else {
        router.replace('/(auth)/connexion.auth')
      }
    }

    gererNavigation()
  }, [chargement, estConnecte])

  return (
    <View style={styles.conteneur}>
      <Image
        source={require('../../assets/logo3.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flex:            1,
    backgroundColor: '#000000',
    alignItems:      'center',
    justifyContent:  'center',
  },
  logo: {
    width:  width * 0.7,
    height: height * 0.3,
  },
})

import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { router } from 'expo-router'
import { appConfig } from '../../config/appConfig'
import { useAuth } from '../../contextes/auth.contexte'

SplashScreen.preventAutoHideAsync()

const { width, height } = Dimensions.get('window')

export default function SplashScreenAuth() {
  const { estConnecte, chargement } = useAuth()

  const [pret, setPret] = useState(false)

  useEffect(() => {
    const duree = appConfig.splash.dureeMs ?? 0
    const timer = setTimeout(() => setPret(true), duree)
    return () => clearTimeout(timer)
  }, [])

  // Ne naviguer que quand les deux conditions sont remplies
  useEffect(() => {
    if (chargement || !pret) return

    async function gererNavigation() {
      await SplashScreen.hideAsync()

      if (estConnecte) {
        router.replace('/(catalogue)/accueil')
      } else {
        router.replace('/(auth)/connexion.auth')
      }
    }

    gererNavigation()
  }, [chargement, estConnecte, pret])

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

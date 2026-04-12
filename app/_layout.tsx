import { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'
import { FournisseurAuth } from '../contextes/auth.contexte'
import { appConfig } from '../config/appConfig'

const { couleurs, tailles } = appConfig.theme

function IconeTab({ emoji, label, focused }: { emoji: string, label: string, focused: boolean }) {
  return (
    <View style={styles.iconeConteneur}>
      <Text style={styles.iconeEmoji}>{emoji}</Text>
      <Text style={[styles.iconeLabel, focused && styles.iconeLabelActif]}>
        {label}
      </Text>
    </View>
  )
}

export default function LayoutRacine() {
  return (
    <FournisseurAuth>
      <Tabs
        screenOptions={{
          headerShown:     false,
          tabBarStyle:     styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="(auth)"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="(catalogue)/accueil.catalogue"
          options={{
            tabBarIcon: ({ focused }) => (
              <IconeTab emoji="🏠" label="Accueil" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="(catalogue)/shop.catalogue"
          options={{
            tabBarIcon: ({ focused }) => (
              <IconeTab emoji="🛍️" label="Boutique" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="(panier)/panier"
          options={{
            tabBarIcon: ({ focused }) => (
              <IconeTab emoji="🛒" label="Panier" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="(compte)/mon-compte"
          options={{
            tabBarIcon: ({ focused }) => (
              <IconeTab emoji="👤" label="Compte" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </FournisseurAuth>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor:  couleurs.fond,
    borderTopWidth:   1,
    borderTopColor:   couleurs.bordure,
    height:           64,
    paddingBottom:    8,
    paddingTop:       8,
  },
  iconeConteneur: {
    alignItems:     'center',
    justifyContent: 'center',
    gap:            2,
  },
  iconeEmoji: {
    fontSize: 22,
  },
  iconeLabel: {
    fontSize:   9,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.texteTertiaire,
  },
  iconeLabelActif: {
    color:      couleurs.primaire,
    fontWeight: '600',
  },
})

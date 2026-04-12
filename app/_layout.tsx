import { Stack } from 'expo-router'
import { FournisseurAuth } from '../contextes/auth.contexte'

export default function LayoutRacine() {
  return (
    <FournisseurAuth>
      <Stack screenOptions={{ headerShown: false }} />
    </FournisseurAuth>
  )
}

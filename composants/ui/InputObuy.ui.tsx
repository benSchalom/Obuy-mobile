import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { appConfig } from '../../config/appConfig'

const { couleurs, tailles, espacements, rayons } = appConfig.theme

// propriete d'un champ input
type PropsInput = {
  label:           string
  valeur:          string
  surChangement:   (texte: string) => void
  placeholder?:    string
  estMotDePasse?:  boolean
  typeClavier?:    'default' | 'email-address' | 'numeric' | 'phone-pad'
  erreur?:         string
  desactive?:      boolean
  obligatoire?:    boolean
}

export default function InputObuy({
  label,
  valeur,
  surChangement,
  placeholder,
  estMotDePasse = false,
  typeClavier   = 'default',
  erreur,
  desactive     = false,
  obligatoire   = false,
}: PropsInput) {
  const [motDePasseVisible, setMotDePasseVisible] = useState(false)
  const [estFocus, setEstFocus]                   = useState(false)

  return (
    <View style={styles.conteneur}>

      {/* Label */}
      <Text style={styles.label}>
        {label}
        {obligatoire && <Text style={styles.asterisque}> *</Text>}
      </Text>

      {/* Champ */}
      <View style={[
        styles.champConteneur,
        estFocus   && styles.champFocus,
        erreur     && styles.champErreur,
        desactive  && styles.champDesactive,
      ]}>
        <TextInput
          style={styles.champ}
          value={valeur}
          onChangeText={surChangement}
          placeholder={placeholder}
          placeholderTextColor={couleurs.texteTertiaire}
          secureTextEntry={estMotDePasse && !motDePasseVisible}
          keyboardType={typeClavier}
          editable={!desactive}
          onFocus={() => setEstFocus(true)}
          onBlur={()  => setEstFocus(false)}
          autoCapitalize={typeClavier === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={false as unknown as undefined}
        />

        {/* Toggle afficher/masquer mot de passe */}
        {estMotDePasse && (
          <TouchableOpacity
            onPress={() => setMotDePasseVisible(v => !v)}
            style={styles.toggleMdp}
            accessibilityLabel={motDePasseVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <Text style={styles.toggleMdpTexte}>
              {motDePasseVisible ? 'Masquer' : 'Afficher'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Message d'erreur */}
      {erreur && (
        <Text style={styles.erreur}>{erreur}</Text>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: espacements.lg,
  },
  label: {
    fontSize:     tailles.normale,
    fontFamily:   appConfig.theme.polices.corps,
    color:        couleurs.textePrincipal,
    marginBottom: espacements.xs,
    fontWeight:   '500',
  },
  asterisque: {
    color: couleurs.erreur,
  },
  champConteneur: {
    flexDirection:  'row',
    alignItems:     'center',
    borderWidth:    1,
    borderColor:    couleurs.bordure,
    borderRadius:   rayons.sm,
    backgroundColor: couleurs.fond,
    paddingHorizontal: espacements.md,
  },
  champFocus: {
    borderColor: couleurs.primaire,
    borderWidth: 1.5,
  },
  champErreur: {
    borderColor: couleurs.erreur,
  },
  champDesactive: {
    backgroundColor: couleurs.surface,
    opacity: 0.6,
  },
  champ: {
    flex:        1,
    height:      48,
    fontSize:    tailles.normale,
    fontFamily:  appConfig.theme.polices.corps,
    color:       couleurs.textePrincipal,
  },
  toggleMdp: {
    paddingLeft: espacements.sm,
    paddingVertical: espacements.xs,
  },
  toggleMdpTexte: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.primaire,
    fontWeight: '500',
  },
  erreur: {
    fontSize:   tailles.sm,
    fontFamily: appConfig.theme.polices.corps,
    color:      couleurs.erreur,
    marginTop:  espacements.xs,
  },
})
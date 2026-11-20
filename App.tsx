import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React from 'react'
import { ensureNotificationPermission, showLocalNotification } from './src/notifications/localNotifications';

export default function App() {
  const handleNotify = async() =>{
    try {
      const allowed = await ensureNotificationPermission();
      if (!allowed) {
        Alert.alert('Permiso denegado','Activa las notificaciones en la configuracion de tu dispositivo');
        return;
      }
      await showLocalNotification();
    } catch (error) {
      Alert.alert('Error', 'No se pudo preparar la noti')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laboratorio de avisos</Text>
      <Text style={styles.description}> Pulse el botón para probar una notificación.
      </Text>
      <Pressable
      //le puse estilo al boton para que se note cuando se presiona :D
        style={({ pressed }) => [
          styles.buttoon,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleNotify}
      >
        <Text style={styles.buttonText}>Enviar notificación</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding: 24
  },
  title:{
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6E00B3'
  },
  description:{
    textAlign: 'center',
    marginBottom: 12,
    color: '#AF50E5' 
  },
  buttoon:{
    backgroundColor: '#8A0BD2',
    padding: 16,
    borderRadius: 12
  },
  buttonText:{
    color: 'white',
    fontWeight: 'bold'
  },

  buttonPressed:{
    backgroundColor: '#4A1F6F',
    transform: [{ scale: 0.96 }]
  }
})
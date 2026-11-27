import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { ensureNotificationPermission, showLocalNotification,
  getExpoPushToken } from './src/notifications/localNotifications';
import { requestPushFromServer } from './src/notifications/pushServer';

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

  const [serverStatus, setServerStatus] = useState('Sin solicitud remota');

  const handleServerPush = async () => {
    try {
      setServerStatus('Preparando token...');
      const token = await getExpoPushToken();
      setServerStatus('Solicitando al servidor...');
      const ticketId = await requestPushFromServer(token);
      setServerStatus(`Expo aceptó el envío (${ticketId}). Revisa avisos.`);
    } catch (error) {
      console.error('Error de push remoto:', error);
      setServerStatus(error instanceof Error ? error.message : String(error));
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

      <Pressable
        style={({ pressed }) => [
          styles.buttoon,
          styles.pushButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleServerPush}
      >
        <Text style={styles.buttonText}>Pedir push al servidor</Text>
      </Pressable>
      <Text style={styles.serverStatus}>{serverStatus}</Text>

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
  },

  pushButton: { 
    marginTop: 14, 
    backgroundColor: '#3b5bdb' 
  },
  serverStatus: {
    marginTop: 14, 
    textAlign: 'center' 
  }
})
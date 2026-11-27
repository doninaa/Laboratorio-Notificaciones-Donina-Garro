import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const CHANNEL_ID = 'laboratorio';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: 'Avisos de Laboratorio',
            importance: Notifications.AndroidImportance.HIGH,
        });
    }
    let permission = await Notifications.getPermissionsAsync();
    if (!permission.granted){
        permission = await Notifications.requestPermissionsAsync();
    }
    return permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}
export async function showLocalNotification(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Hola Donita',
            body: `Prueba programada el ${new Date().toLocaleString('es-PE')}.`,
            sound: 'default',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 3,
            channelId: CHANNEL_ID,
        },
    });
}

export async function getExpoPushToken(): Promise<string> {
    const allowed = await ensureNotificationPermission();
    if (!allowed) throw new Error('Permiso denegado');
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
    if (!projectId) throw new Error('Falta projectId de EAS');
    const result = await Notifications.getExpoPushTokenAsync({ projectId });
    return result.data;
}
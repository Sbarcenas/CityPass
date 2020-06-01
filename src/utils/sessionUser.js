import { AsyncStorage } from 'react-native';
import Toaster from '../utils/toaster';

export async function setUser(user) {
  try {
    await AsyncStorage.setItem('current_user', JSON.stringify(user));
  } catch ({ message }) {
    Toaster({ type: 'error', text: message });
  }
}

export async function getUser() {
  try {
    return await AsyncStorage.getItem('current_user');
  } catch ({ message }) {
    Toaster({ type: 'error', text: message });
  }
}
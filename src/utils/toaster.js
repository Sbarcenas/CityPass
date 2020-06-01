import { Navigation } from 'react-native-navigation';

export const Toaster = (passProps) => {
  Navigation.showOverlay({
    component: {
      name: 'app.toast',
      passProps,
      options: {
        overlay: {
          interceptTouchOutside: false,
        },
      },
    },
  });
}
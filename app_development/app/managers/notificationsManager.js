import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

const configure = () => {
 PushNotification.configure({

   onRegister: function(token) {
     //process token
   },

   onNotification: function(notification) {
     // process the notification
     // required on iOS only
     notification.finish(PushNotificationIOS.FetchResult.NoData);
   },

   permissions: {
     alert: true,
     badge: true,
     sound: true
   },

   popInitialNotification: true,
   requestPermissions: true,

 });
};

const localNotification = () => {
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    bigText: "A suspicious SMS message has been detected!",
    color: "#3667bf",
    vibrate: true,
    vibration: 300,
    title: "APS System",
    message: "A suspicious SMS message has been detected!",
    playSound: true,
    soundName: 'default',
  });
 };
 
 export {
  configure,
  localNotification,
 };
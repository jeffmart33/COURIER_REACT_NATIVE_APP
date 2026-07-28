import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import API from "./api";

export const notificationListener = {
  current: null,
};

export const responseListener = {
  current: null,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export async function registerForPushNotifications(token) {

  if (Constants.appOwnership === "expo") {
    console.log("Running in Expo Go. Skipping push notifications.");
    return null;
  }


  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission denied");
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;


    if (Constants.appOwnership === "expo") {
  console.log(
    "Running inside Expo Go. Push notifications are disabled."
  );
  return;
}

  const pushToken =
    (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

  console.log("Expo Push Token:");
console.log(pushToken);

try {
  console.log("JWT:");
  console.log(token);

  console.log("Sending Push Token:");
  console.log(pushToken);

  const response = await API.post(
    "/api/courier/push-token",
    {
      expoPushToken: pushToken,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Server Response:");
  console.log(response.data);

} catch (err) {
  console.log("Push Token Error:");
  console.log(err.response?.data || err.message);
}
  return pushToken;
}

export function startNotificationListeners() {

  notificationListener.current =
    Notifications.addNotificationReceivedListener(
      notification => {

        console.log("Notification Received:");
        console.log(notification);

      }
    );

  responseListener.current =
    Notifications.addNotificationResponseReceivedListener(
      response => {

        console.log("Notification Tapped:");
        console.log(response);

      }
    );

  return {
    remove() {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    },
  };

}
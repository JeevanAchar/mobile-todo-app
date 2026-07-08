import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Notification permission denied");
  }
}

// Trigger Null equals to immediate
export async function showNotification({
  body,
  title,
  tiggerInSeconds,
}: {
  title: string;
  body: string;
  tiggerInSeconds?: number;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger:
      tiggerInSeconds === undefined
        ? null
        : {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: tiggerInSeconds,
          },
  });
}

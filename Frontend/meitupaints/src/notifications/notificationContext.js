import { createContext, useContext } from "react";

export const NotificationCtx = createContext(null);

export const NOTIFICATION_CATEGORIES = Object.freeze({
  DEALER_REGISTRATION: "DEALER_REGISTRATION",
  DISPATCHER_REGISTRATION: "DISPATCHER_REGISTRATION",
  FACTORY_ORDER: "FACTORY_ORDER",
  ASSIGNED_DEALER_ORDER: "ASSIGNED_DEALER_ORDER",
});

export function useNotifications() {
  return useContext(NotificationCtx);
}

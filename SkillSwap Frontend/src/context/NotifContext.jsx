import { createContext, useContext, useState, useCallback } from "react";
import { MOCK_NOTIFICATIONS } from "../data/mockData";

const NotifContext = createContext(null);

export const NotifProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [
      { _id: `n_${Date.now()}`, isRead: false, createdAt: new Date().toISOString(), ...notif },
      ...prev,
    ]);
  }, []);

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}>
      {children}
    </NotifContext.Provider>
  );
};

export const useNotif = () => useContext(NotifContext);

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

const NotifContext = createContext(null);

/** Normalize PascalCase DB columns to camelCase for the UI */
const normalizeNotif = (raw) => ({
  _id: raw.notificationId ?? raw._id,
  userId: raw.UserId ?? raw.userId,
  title: raw.Title ?? raw.title ?? "",
  message: raw.Message ?? raw.message ?? "",
  isRead: Boolean(raw.IsRead ?? raw.isRead),
  type: raw.Type ?? raw.type ?? "general",
  link: raw.Link ?? raw.link ?? null,
  createdAt: raw.CreatedAt ?? raw.createdAt ?? new Date().toISOString(),
});

export const NotifProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Fetch all notifications for the logged-in user ──────────────────────────
  const fetchNotifications = useCallback(async (uid) => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/notification/${uid}`);
      const list = (data.List ?? []).map(normalizeNotif);
      setNotifications(list);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchNotifications(userId);
  }, [userId, fetchNotifications]);

  // ── Mark a single notification as read ──────────────────────────────────────
  const markRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await axios.put(`${API_BASE}/notification/${id}`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Rollback optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
      );
    }
  }, []);

  // ── Mark all notifications as read ──────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length === 0) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await Promise.all(
        unreadIds.map((id) => axios.put(`${API_BASE}/notification/${id}`))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      // Refetch to restore consistent state
      if (userId) fetchNotifications(userId);
    }
  }, [notifications, userId, fetchNotifications]);

  // ── Delete a notification ────────────────────────────────────────────────────
  const deleteNotification = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await axios.delete(`${API_BASE}/notification/${id}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      if (userId) fetchNotifications(userId);
    }
  }, [userId, fetchNotifications]);

  // ── Add a local/optimistic notification (used by other parts of the app) ────
  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [
      {
        _id: `n_${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        type: "general",
        ...notif,
      },
      ...prev,
    ]);
  }, []);

  return (
    <NotifContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markRead,
        markAllRead,
        deleteNotification,
        addNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotifContext.Provider>
  );
};

export const useNotif = () => useContext(NotifContext);

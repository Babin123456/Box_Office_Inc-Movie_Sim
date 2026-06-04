import { useCallback, useEffect, useState } from "react";

import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

import NotificationCard from "../../components/notifications/NotificationCard";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUnreadCount = useCallback(async () => {
    const res = await api.get("/notifications/unread-count");

    setUnreadCount(res.data.unreadCount || 0);
  }, []);

  const loadNotifications = useCallback(async () => {
    const res = await api.get("/notifications");

    setNotifications(res.data.notifications || []);
    setUnreadCount(res.data.unreadCount || 0);
  }, []);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);

    try {
      await loadNotifications();
    } finally {
      setLoading(false);
    }
  }, [loadNotifications]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshNotifications();
  }, [refreshNotifications]);

  const markRead = async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);

    setUnreadCount(res.data.unreadCount || 0);
    await loadNotifications();
  };

  const markAllRead = async () => {
    const res = await api.patch("/notifications/read-all");

    setUnreadCount(res.data.unreadCount || 0);
    await loadNotifications();
  };

  const deleteNotification = async (id) => {
    const res = await api.delete(`/notifications/${id}`);

    setUnreadCount(res.data.unreadCount || 0);
    await loadNotifications();
  };

  const deleteAll = async () => {
    const res = await api.delete("/notifications");

    setUnreadCount(res.data.unreadCount || 0);
    setNotifications([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Notifications</h1>

            <p className="mt-2 text-slate-400">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadUnreadCount}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white"
            >
              Refresh Count
            </button>

            <button
              onClick={markAllRead}
              disabled={notifications.length === 0 || unreadCount === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl text-white"
            >
              Mark All Read
            </button>

            <button
              onClick={deleteAll}
              disabled={notifications.length === 0}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl text-white"
            >
              Delete All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-white">Loading...</h2>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                No Notifications
              </h2>
              <p className="text-slate-400">You're all caught up.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onRead={markRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;

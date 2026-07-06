import { Link, useNavigate } from "react-router-dom";
import { useNotif } from "../context/NotifContext";

const NotificationBell = () => {
  const { notifications, unreadCount, markRead } = useNotif();
  const navigate = useNavigate();
  const recent = notifications.slice(0, 5);

  const typeIcon = {
    swap_request: "bi-arrow-left-right text-primary",
    swap_accepted: "bi-check-circle text-success",
    message: "bi-chat-dots text-info",
    review: "bi-star text-warning",
  };

  const handleItemClick = async (n) => {
    await markRead(n._id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="dropdown">
      <button
        className="btn ss-notif-btn position-relative"
        data-bs-toggle="dropdown"
        id="notifBtn"
        aria-label="Notifications"
      >
        <i className="bi bi-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
            {unreadCount}
          </span>
        )}
      </button>
      <div className="dropdown-menu dropdown-menu-end ss-notif-dropdown shadow p-0" style={{ width: 320 }}>
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <strong>Notifications</strong>
          {unreadCount > 0 && (
            <Link to="/notifications" className="text-primary small text-decoration-none">
              Mark all read
            </Link>
          )}
        </div>
        {recent.length === 0 && (
          <div className="text-center text-muted py-4 small">No notifications</div>
        )}
        {recent.map((n) => (
          <div
            key={n._id}
            className={`d-flex gap-3 px-3 py-2 border-bottom ss-notif-item ${!n.isRead ? "ss-notif-unread" : ""}`}
            onClick={() => handleItemClick(n)}
            style={{ cursor: "pointer" }}
          >
            <div className="ss-notif-icon mt-1">
              <i className={`bi ${typeIcon[n.type] || "bi-bell"} fs-5`}></i>
            </div>
            <div className="flex-grow-1">
              <div className="small fw-semibold">{n.title}</div>
              <div className="text-muted" style={{ fontSize: "12px" }}>{n.message}</div>
              <div className="text-muted mt-1" style={{ fontSize: "11px" }}>
                {new Date(n.createdAt).toLocaleDateString()}
              </div>
            </div>
            {!n.isRead && <span className="ss-notif-dot"></span>}
          </div>
        ))}
        <div className="text-center py-2">
          <Link to="/notifications" className="text-primary small text-decoration-none">
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;

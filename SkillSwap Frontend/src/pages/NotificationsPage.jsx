import { useNotif } from "../context/NotifContext";

const typeIcon = {
  swap_request: { icon: "bi-arrow-left-right", color: "primary" },
  swap_accepted: { icon: "bi-check-circle-fill", color: "success" },
  message: { icon: "bi-chat-dots-fill", color: "info" },
  review: { icon: "bi-star-fill", color: "warning" },
};

const NotificationsPage = () => {
  const { notifications, markRead, markAllRead, deleteNotification, loading, error } = useNotif();
  const unread = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" aria-label="Loading notifications">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted mt-3">Loading notifications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle display-4 text-danger d-block mb-3"></i>
        <h5 className="text-muted">{error}</h5>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0">Notifications</h2>
          <p className="text-muted mb-0">{unread > 0 ? `${unread} unread notifications` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <button className="btn ss-btn-outline-primary btn-sm" onClick={markAllRead} id="markAllReadBtn">
            <i className="bi bi-check2-all me-1"></i>Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bell-slash display-4 text-muted d-block mb-3"></i>
          <h5 className="text-muted">No notifications yet</h5>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {notifications.map((n) => {
            const cfg = typeIcon[n.type] || { icon: "bi-bell", color: "secondary" };
            return (
              <div
                key={n._id}
                className={`card border-0 shadow-sm p-3 ss-notif-card ${!n.isRead ? "ss-notif-card-unread" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div
                    className={`ss-notif-icon-circle bg-${cfg.color} bg-opacity-15 text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ width: 44, height: 44 }}
                    onClick={() => markRead(n._id)}
                  >
                    <i className={`bi ${cfg.icon} fs-5`}></i>
                  </div>
                  <div className="flex-grow-1" onClick={() => markRead(n._id)}>
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <h6 className={`mb-1 ${!n.isRead ? "fw-bold" : "fw-semibold"}`}>{n.title}</h6>
                      {!n.isRead && <span className="ss-notif-dot flex-shrink-0 mt-1"></span>}
                    </div>
                    <p className="text-muted small mb-1">{n.message}</p>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {new Date(n.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-link text-danger p-0 flex-shrink-0"
                    title="Delete notification"
                    id={`deleteNotif-${n._id}`}
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

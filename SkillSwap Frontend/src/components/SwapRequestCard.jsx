import { Link } from "react-router-dom";

const statusConfig = {
  Pending: { color: "warning", icon: "bi-clock-history", label: "Pending" },
  Accepted: { color: "success", icon: "bi-check-circle", label: "Accepted" },
  Rejected: { color: "danger", icon: "bi-x-circle", label: "Rejected" },
  Completed: { color: "info", icon: "bi-trophy", label: "Completed" },
};

const SwapRequestCard = ({ swap, currentUserId, onAccept, onReject, onComplete }) => {
  const isSender = swap.senderId === currentUserId;
  const partner = isSender
    ? { name: swap.receiverName, image: swap.receiverImage, id: swap.receiverId }
    : { name: swap.senderName, image: swap.senderImage, id: swap.senderId };

  const cfg = statusConfig[swap.status] || statusConfig.Pending;

  return (
    <div className={`card ss-swap-card border-0 shadow-sm border-start border-4 border-${cfg.color}`}>
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <img
              src={partner.image}
              alt={partner.name}
              className="rounded-circle"
              width={48}
              height={48}
            />
            <div>
              <h6 className="mb-0 fw-bold">
                <Link to={`/users/${partner.id}`} className="ss-link">{partner.name}</Link>
              </h6>
              <small className="text-muted">{isSender ? "You sent this request" : "Sent you a request"}</small>
            </div>
          </div>
          <span className={`badge bg-${cfg.color} text-white border border-${cfg.color} px-3 py-2`}>
            <i className={`bi ${cfg.icon} me-1`}></i>{cfg.label}
          </span>
        </div>

        <div className="row g-2 mt-3">
          <div className="col-md-6">
            <div className="ss-swap-skill-box offering p-2 rounded">
              <div className="small text-muted mb-1"><i className="bi bi-mortarboard me-1"></i>Offering</div>
              <div className="fw-semibold">{swap.offeredSkill}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="ss-swap-skill-box wanting p-2 rounded">
              <div className="small text-muted mb-1"><i className="bi bi-lightbulb me-1"></i>Wanting</div>
              <div className="fw-semibold">{swap.requestedSkill}</div>
            </div>
          </div>
        </div>

        {swap.message && (
          <div className="mt-2 p-2 bg-light rounded small text-muted fst-italic">
            <i className="bi bi-chat-quote me-1"></i>"{swap.message}"
          </div>
        )}

        {swap.scheduledDate && (
          <div className="mt-2 small text-muted">
            <i className="bi bi-calendar-event me-1"></i>
            Scheduled: {new Date(swap.scheduledDate).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {swap.status === "Accepted" && (
            <Link to={`/chat/${swap._id}`} className="btn ss-btn-primary btn-sm">
              <i className="bi bi-chat-dots me-1"></i>Open Chat
            </Link>
          )}
          {swap.status === "Pending" && !isSender && (
            <>
              <button className="btn btn-success btn-sm" onClick={() => onAccept(swap._id)}>
                <i className="bi bi-check-lg me-1"></i>Accept
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => onReject(swap._id)}>
                <i className="bi bi-x-lg me-1"></i>Decline
              </button>
            </>
          )}
          {swap.status === "Accepted" && (
            <button className="btn btn-outline-success btn-sm" onClick={() => onComplete && onComplete(swap._id)}>
              <i className="bi bi-check2-all me-1"></i>Mark Complete
            </button>
          )}
          {swap.status === "Completed" && (
            <Link to="/reviews" className="btn btn-outline-warning btn-sm">
              <i className="bi bi-star me-1"></i>Leave Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequestCard;

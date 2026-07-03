import { Link } from "react-router-dom";

const statusConfig = {
  Pending: { color: "warning", icon: "bi-clock-history", label: "Pending" },
  Accepted: { color: "success", icon: "bi-check-circle", label: "Accepted" },
  Rejected: { color: "danger", icon: "bi-x-circle", label: "Rejected" },
  Completed: { color: "info", icon: "bi-trophy", label: "Completed" },
};

const normalizeStatus = (status) => {
  const value = String(status || "Pending").toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const SwapRequestCard = ({ swap, currentUserId, allUsers = [], onAccept, onReject, onComplete }) => {
  // Build a lookup map from the allUsers prop (already fetched by SwapRequestsPage)
  const userMap = Object.fromEntries(
    allUsers.map((u) => [String(u.userId ?? u.UserId), u])
  );

  // Handle both camelCase (MongoDB) and PascalCase (MySQL) field names
  const swapId     = swap._id ?? swap.swapId ?? swap.SwapId;
  const senderId   = swap.senderId   ?? swap.SenderId;
  const receiverId = swap.receiverId ?? swap.ReceiverId;
  const isSender   = String(senderId) === String(currentUserId);

  const partnerId   = isSender ? receiverId : senderId;
  const partnerUser = userMap[String(partnerId)];

  // Prefer live user data from userMap; fall back to data embedded in the swap record
  const partnerName = partnerUser?.name ?? partnerUser?.Name
    ?? (isSender ? (swap.receiverName ?? swap.ReceiverName) : (swap.senderName ?? swap.SenderName))
    ?? "Unknown";
  const partnerImg  = partnerUser?.profileImage ?? partnerUser?.ProfileImage
    ?? (isSender ? (swap.receiverImage ?? swap.ReceiverImage) : (swap.senderImage ?? swap.SenderImage))
    ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const offeredSkill   = swap.offeredSkill   ?? swap.OfferedSkill   ?? "-";
  const requestedSkill = swap.requestedSkill ?? swap.RequestedSkill ?? "-";

  const status = normalizeStatus(swap.status ?? swap.Status);
  const cfg = statusConfig[status] || statusConfig.Pending;

  return (
    <div
      className={`card ss-swap-card border-0 shadow-sm border-start border-4 border-${cfg.color}`}
    >
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <img
              src={partnerImg}
              alt={partnerName}
              className="rounded-circle"
              width={48}
              height={48}
            />
            <div>
              <h6 className="mb-0 fw-bold">
                <Link to={`/users/${partnerId}`} className="ss-link">
                  {partnerName}
                </Link>
              </h6>
              <small className="text-muted">
                {isSender ? "You sent this request" : "Sent you a request"}
              </small>
            </div>
          </div>
          <span
            className={`badge bg-${cfg.color} text-white border border-${cfg.color} px-3 py-2`}
          >
            <i className={`bi ${cfg.icon} me-1`}></i>
            {cfg.label}
          </span>
        </div>

        <div className="row g-2 mt-3">
          <div className="col-md-6">
            <div className="ss-swap-skill-box offering p-2 rounded">
              <div className="small text-muted mb-1">
                <i className="bi bi-mortarboard me-1"></i>Offering
              </div>
              <div className="fw-semibold">{offeredSkill}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="ss-swap-skill-box wanting p-2 rounded">
              <div className="small text-muted mb-1">
                <i className="bi bi-lightbulb me-1"></i>Wanting
              </div>
              <div className="fw-semibold">{requestedSkill}</div>
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
            Scheduled:{" "}
            {new Date(swap.scheduledDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {status === "Accepted" && (
            <Link to={`/chat/${swapId}`} className="btn ss-btn-primary btn-sm">
              <i className="bi bi-chat-dots me-1"></i>Open Chat
            </Link>
          )}
          {status === "Pending" && !isSender && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => onAccept(swapId)}
              >
                <i className="bi bi-check-lg me-1"></i>Accept
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onReject(swapId)}
              >
                <i className="bi bi-x-lg me-1"></i>Decline
              </button>
            </>
          )}
          {status === "Accepted" && (
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => onComplete && onComplete(swapId)}
            >
              <i className="bi bi-check2-all me-1"></i>Mark Complete
            </button>
          )}
          {status === "Completed" && (
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

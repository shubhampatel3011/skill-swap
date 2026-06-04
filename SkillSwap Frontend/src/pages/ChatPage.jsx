import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_SWAPS, MOCK_MESSAGES, MOCK_USERS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const { swapId } = useParams();
  const { user } = useAuth();
  const swap = MOCK_SWAPS.find((s) => s._id === swapId);
  const [messages, setMessages] = useState(MOCK_MESSAGES[swapId] || []);

  if (!swap) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-chat-x display-1 text-muted"></i>
        <h3 className="mt-3">Chat not found</h3>
        <Link to="/swaps" className="btn ss-btn-primary mt-3">Back to Swaps</Link>
      </div>
    );
  }

  if (swap.status !== "Accepted" && swap.status !== "Completed") {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-lock display-1 text-muted"></i>
        <h3 className="mt-3">Chat not available</h3>
        <p className="text-muted">Chat is only available for accepted swap requests.</p>
        <Link to="/swaps" className="btn ss-btn-primary mt-3">Back to Swaps</Link>
      </div>
    );
  }

  const isSender = swap.senderId === user?._id;
  const partner = {
    name: isSender ? swap.receiverName : swap.senderName,
    image: isSender ? swap.receiverImage : swap.senderImage,
    id: isSender ? swap.receiverId : swap.senderId,
  };

  const handleSend = (text) => {
    setMessages((prev) => [
      ...prev,
      { _id: `m_${Date.now()}`, senderId: user?._id, text, timestamp: new Date().toISOString() },
    ]);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Swap Info Banner */}
          <div className="card border-0 shadow-sm mb-3 p-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-3">
                <Link to="/swaps" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div>
                  <h6 className="fw-bold mb-0">Swap Chat with {partner.name}</h6>
                  <small className="text-muted">
                    <span className="text-primary">{swap.offeredSkill}</span>
                    {" "}<i className="bi bi-arrow-left-right"></i>{" "}
                    <span className="text-success">{swap.requestedSkill}</span>
                  </small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-success bg-opacity-15 text-success border border-success px-2 py-1">
                  <i className="bi bi-check-circle me-1"></i>{swap.status}
                </span>
                <Link to={`/users/${partner.id}`} className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-person me-1"></i>Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="card border-0 shadow-sm overflow-hidden" style={{ height: "520px" }}>
            <ChatWindow
              messages={messages}
              onSend={handleSend}
              partnerName={partner.name}
              partnerImage={partner.image}
            />
          </div>

          {/* Session Info */}
          {swap.scheduledDate && (
            <div className="alert alert-info d-flex align-items-center gap-2 mt-3 mb-0">
              <i className="bi bi-calendar-event fs-5"></i>
              <div>
                <strong>Session Scheduled:</strong>{" "}
                {new Date(swap.scheduledDate).toLocaleString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

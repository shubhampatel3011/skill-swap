import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import socket from "../socket";

const ChatPage = () => {
  const { swapId } = useParams();
  const { user, token } = useAuth();

  const [swap, setSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partnerUser, setPartnerUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const authToken = token || localStorage.getItem("ss_token") || localStorage.getItem("token");
    return authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
  };

  // Fetch swap details + partner user info
  const getSwap = async () => {
    try {
      const [swapRes, usersRes] = await Promise.all([
        axios.get(`http://localhost:3000/swap/${swapId}`, getAuthHeaders()),
        axios.get("http://localhost:3000/users", getAuthHeaders()),
      ]);

      const swapData = swapRes.data.Data?.[0] ?? swapRes.data.Data;
      if (!swapData) {
        setError("Swap not found.");
        setLoading(false);
        return;
      }

      setSwap(swapData);

      const allUsers = usersRes.data.List || [];
      const senderId   = swapData.senderId   ?? swapData.SenderId;
      const receiverId = swapData.receiverId ?? swapData.ReceiverId;
      const myId       = String(user?.userId);
      const partnerId  = String(senderId) === myId ? receiverId : senderId;

      const found = allUsers.find((u) => String(u.userId ?? u.UserId) === String(partnerId));
      setPartnerUser(found || null);
    } catch (err) {
      setError("Failed to load chat.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for this swap
  const getMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/message/${swapId}`, getAuthHeaders());
      const list = res.data.List || [];
      // Normalize DB column names to what ChatWindow expects
      setMessages(
        list.map((m) => ({
          _id:       m.messageId ?? m.MessageId ?? m._id,
          senderId:  m.senderId  ?? m.SenderId,
          senderName: m.senderName  ?? m.SenderName,
          text:      m.message   ?? m.Message ?? m.text,
          timestamp: m.createdAt ?? m.CreatedAt ?? m.timestamp,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      getSwap();
      getMessages();
    }

    if (swapId) {
      socket.emit("joinRoom", swapId);
    }

    const handleReceiveMessage = (msg) => {
      // Ignore if sent by current user because optimistic update already added it
      if (String(msg.senderId) === String(user?.userId)) return;

      const normalizedMsg = {
        _id: msg.messageId ?? msg.MessageId ?? msg._id ?? `msg_${Date.now()}`,
        senderId: msg.senderId ?? msg.SenderId,
        senderName: msg.senderName ?? msg.SenderName ?? "",
        text: msg.message ?? msg.Message ?? msg.text ?? "",
        timestamp: msg.createdAt ?? msg.CreatedAt ?? msg.timestamp ?? new Date().toISOString(),
      };

      setMessages((prev) => [...prev, normalizedMsg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [user, swapId]);

  // Throttle: only send a notification once per 60 s per conversation
  const lastNotifiedRef = useRef(0);

  const handleSend = async (text) => {
    if (!user || !swap) return;
    const senderId   = swap.senderId   ?? swap.SenderId;
    const senderName   = swap.senderName   ?? swap.SenderName;
    const receiverId = swap.receiverId ?? swap.ReceiverId;
    const receiverName = swap.receiverName ?? swap.ReceiverName;
    const myId       = String(user.userId);
    const partnerId  = String(senderId) === myId ? receiverId : senderId;

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        _id:       `temp_${Date.now()}`,
        senderId:  user.userId,
        text,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      socket.emit("sendMessage", {
        swapId: Number(swapId),
        senderId: user.userId,
        receiverId: partnerId,
        message: text,
      });

      // Send a notification to the partner (throttled to once per 60 s)
      const now = Date.now();
      if (now - lastNotifiedRef.current > 60_000) {
        lastNotifiedRef.current = now;
        await axios.post("http://localhost:3000/notification", {
          userId:  partnerId,
          title:   "New Message",
          message: `${user.name} sent you a message.`,
          type:    "message",
          link:    `/chat/${swapId}`,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ── Guards ── */
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted mt-3">Loading chat…</p>
      </div>
    );
  }

  if (error || !swap) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-chat-x display-1 text-muted"></i>
        <h3 className="mt-3">{error || "Chat not found"}</h3>
        <Link to="/swaps" className="btn ss-btn-primary mt-3">Back to Swaps</Link>
      </div>
    );
  }

  const status = String(swap.status ?? swap.Status ?? "").toLowerCase();
  if (status !== "accepted" && status !== "completed") {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-lock display-1 text-muted"></i>
        <h3 className="mt-3">Chat not available</h3>
        <p className="text-muted">Chat is only available for accepted swap requests.</p>
        <Link to="/swaps" className="btn ss-btn-primary mt-3">Back to Swaps</Link>
      </div>
    );
  }

  const partnerName  = partnerUser?.name  ?? partnerUser?.Name  ?? "Partner";
  const partnerImage = partnerUser?.profileImage ?? partnerUser?.ProfileImage
    ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const partnerId    = partnerUser?.userId ?? partnerUser?.UserId;

  const offeredSkill   = swap.offeredSkill   ?? swap.OfferedSkill   ?? "-";
  const requestedSkill = swap.requestedSkill ?? swap.RequestedSkill ?? "-";

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Swap Info Banner */}
          <div className="card border-0 shadow-sm mb-3 p-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-3">
                <Link to="/chats" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div>
                  <h6 className="fw-bold mb-0">Swapping Chat with {partnerName}</h6>
                  <small className="text-muted">
                    <span className="text-primary">{offeredSkill}</span>
                    {" "}<i className="bi bi-arrow-left-right"></i>{" "}
                    <span className="text-success">{requestedSkill}</span>
                  </small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-success bg-opacity-15 text-light border border-success px-2 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {swap.status ?? swap.Status}
                </span>
                {partnerId && (
                  <Link to={`/users/${partnerId}`} className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-person me-1"></i>Profile
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="card border-0 shadow-sm overflow-hidden" style={{ height: "520px" }}>
            <ChatWindow
              messages={messages}
              currentUserId={user?.userId}
              onSend={handleSend}
              partnerName={partnerName}
              partnerImage={partnerImage}
            />
          </div>

          {/* Session Info */}
          {(swap.scheduledDate ?? swap.ScheduledDate) && (
            <div className="alert alert-info d-flex align-items-center gap-2 mt-3 mb-0">
              <i className="bi bi-calendar-event fs-5"></i>
              <div>
                <strong>Swap Session Started:</strong>{" "}
                {new Date(swap.scheduledDate ?? swap.ScheduledDate).toLocaleString("en-IN", {
                  weekday: "long", day: "numeric", month: "long",
                  year: "numeric", hour: "2-digit", minute: "2-digit",
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

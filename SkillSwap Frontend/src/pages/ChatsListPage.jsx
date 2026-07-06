import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:3000";

const ChatsListPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      try {
        const [swapsRes, usersRes] = await Promise.all([
          axios.get(`${API}/swap`),
          axios.get(`${API}/users`),
        ]);

        const allSwaps = swapsRes.data.List || [];
        const users   = usersRes.data.List || [];
        setAllUsers(users);

        // Keep only accepted swaps that belong to the logged-in user
        const myAccepted = allSwaps.filter((s) => {
          const senderId   = s.senderId   ?? s.SenderId;
          const receiverId = s.receiverId ?? s.ReceiverId;
          const status     = String(s.status ?? s.Status ?? "").toLowerCase();
          return (
            status === "accepted" &&
            (String(senderId) === String(user.userId) ||
              String(receiverId) === String(user.userId))
          );
        });

        setChats(myAccepted);
      } catch (err) {
        console.error("ChatsListPage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const userMap = Object.fromEntries(
    allUsers.map((u) => [String(u.userId ?? u.UserId), u])
  );

  const getPartner = (swap) => {
    const senderId   = String(swap.senderId   ?? swap.SenderId);
    const receiverId = String(swap.receiverId ?? swap.ReceiverId);
    const partnerId  = senderId === String(user?.userId) ? receiverId : senderId;
    return { partnerId, partnerUser: userMap[partnerId] };
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
        <p className="text-muted mt-3">Loading chats…</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-chat-dots me-2 text-primary"></i>Chats
        </h2>
        <p className="text-muted mb-0">
          {chats.length > 0
            ? `${chats.length} active conversation${chats.length > 1 ? "s" : ""}`
            : "No active chats yet"}
        </p>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-chat-slash display-4 text-muted d-block mb-3"></i>
          <h5 className="text-muted">No accepted swap requests yet</h5>
          <p className="text-muted small">
            Once a swap request is accepted, the chat will appear here.
          </p>
          <Link to="/swaps" className="btn ss-btn-primary mt-2">
            <i className="bi bi-arrow-left-right me-2"></i>View Swap Requests
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {chats.map((swap) => {
            const swapId         = swap.swapId ?? swap.SwapId ?? swap._id;
            const offeredSkill   = swap.offeredSkill   ?? swap.OfferedSkill   ?? "—";
            const requestedSkill = swap.requestedSkill ?? swap.RequestedSkill ?? "—";
            const { partnerId, partnerUser } = getPartner(swap);

            const partnerName  = partnerUser?.name  ?? partnerUser?.Name  ?? "User";
            const partnerImage = partnerUser?.profileImage ?? partnerUser?.ProfileImage
              ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";

            return (
              <Link
                key={swapId}
                to={`/chat/${swapId}`}
                className="text-decoration-none"
                id={`chatItem_${swapId}`}
              >
                <div className="card border-0 shadow-sm p-3 ss-chat-list-card">
                  <div className="d-flex align-items-center gap-3">
                    {/* Avatar */}
                    <div className="position-relative flex-shrink-0">
                      <img
                        src={partnerImage}
                        alt={partnerName}
                        className="rounded-circle border border-2 border-success"
                        width={54}
                        height={54}
                      />
                      <span
                        className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                        style={{ width: 14, height: 14 }}
                      ></span>
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <h6 className="fw-bold mb-0 text-truncate">{partnerName}</h6>
                        <span className="badge bg-success bg-opacity-15 text-success border border-success flex-shrink-0">
                          <i className="bi bi-check-circle me-1"></i>Accepted
                        </span>
                      </div>
                      <div className="mt-1 d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary small">
                          <i className="bi bi-mortarboard me-1"></i>{offeredSkill}
                        </span>
                        <i className="bi bi-arrow-left-right text-muted small"></i>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success small">
                          <i className="bi bi-lightbulb me-1"></i>{requestedSkill}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <i className="bi bi-chevron-right text-muted flex-shrink-0"></i>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatsListPage;

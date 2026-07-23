import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ChatsListPage = () => {
  const { user, token } = useAuth();
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const authToken = token || localStorage.getItem("ss_token") || localStorage.getItem("token");
    return authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", getAuthHeaders());
      setAllUsers(response.data.List || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getSwap = async () => {
    try {
      const response = await axios.get("http://localhost:3000/swap", getAuthHeaders());
      const allSwaps = response.data.List || [];
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getSwap();
      getUsers();
    }
  }, [user]);

  // Format profile image
  const userName = user?.name || user?.Name || "User";
  let userImage = user?.profileImage || user?.ProfileImage;
  if (userImage && !userImage.startsWith("http://") && !userImage.startsWith("https://") && !userImage.startsWith("data:")) {
    userImage = `http://localhost:3000/uploads/users/${userImage}`;
  }
  if (!userImage) {
    userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0d9488&color=fff&size=128`;
  }

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
            console.log("Swap Data:", swap);

            const swapId = swap.swapId ?? swap.SwapId ?? swap._id;
            const offeredSkillName = swap.offeredSkill ?? swap.OfferedSkill ?? "Skill";
            const requestedSkillName = swap.requestedSkill ?? swap.RequestedSkill ?? "Skill";
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
                        className="rounded-circle ss-profile-avatar"
                        width={40}
                        height={40}
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
                        <span className="badge bg-success bg-opacity-15 text-light border border-success flex-shrink-0">
                          <i className="bi bi-check-circle me-1"></i>Accepted
                        </span>
                      </div>
                      <p className="text-muted small mb-0 mt-1">
                        <i className="bi bi-mortarboard me-1"></i>
                        {offeredSkillName}
                        <span className="mx-2">•</span>
                        <i className="bi bi-lightbulb me-1"></i>
                        {requestedSkillName}
                      </p>
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

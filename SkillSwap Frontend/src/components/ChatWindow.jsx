import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ChatWindow = ({ messages, onSend, partnerName, partnerImage }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="ss-chat-window d-flex flex-column">
      {/* Header */}
      <div className="ss-chat-header d-flex align-items-center gap-3 p-3">
        <img src={partnerImage} alt={partnerName} className="rounded-circle" width={40} height={40} />
        <div>
          <div className="fw-bold text-white">{partnerName}</div>
          <small className="text-success"><i className="bi bi-circle-fill me-1" style={{ fontSize: "8px" }}></i>Active</small>
        </div>
      </div>

      {/* Messages */}
      <div className="ss-chat-messages flex-grow-1 overflow-auto p-3">
        {messages.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-chat-dots display-4 d-block mb-2"></i>
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === user?._id;
          return (
            <div key={msg._id} className={`d-flex mb-3 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
              {!isMine && (
                <img src={partnerImage} alt="" className="rounded-circle me-2 align-self-end" width={28} height={28} />
              )}
              <div className={`ss-chat-bubble ${isMine ? "mine" : "theirs"}`}>
                <div>{msg.text}</div>
                <div className={`ss-chat-time ${isMine ? "text-end" : ""}`}>{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="ss-chat-input d-flex gap-2 p-3 border-top">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          id="chatInput"
        />
        <button type="submit" className="btn ss-btn-primary px-3" disabled={!text.trim()}>
          <i className="bi bi-send-fill"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

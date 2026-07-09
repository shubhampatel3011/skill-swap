import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import axios from "axios";

const categoryColors = {
  Technology: "primary",
  "Creative Arts": "warning",
  Music: "info",
  Languages: "success",
  "Health & Wellness": "danger",
  Business: "secondary",
  Education: "dark",
  Cooking: "warning",
  "Sports & Fitness": "success",
  Other: "secondary",
};

const modeIcon = { Online: "bi-wifi", Offline: "bi-geo-alt", Both: "bi-globe" };

const SkillCard = ({ skill, onRequestSwap }) => {
  const color = categoryColors[skill.category] || "secondary";
  const userName = skill.name || "Unknown user";
  const userImage = skill.userProfileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
  return (
    <div className="card ss-skill-card h-100 border-0 shadow-sm">
      <div
        className={`card-header ss-card-header bg-${color} bg-opacity-10 border-0 d-flex justify-content-between align-items-center`}
      >
        <span className={`badge bg-${color} bg-opacity-75 fw-normal`}>
          {skill.category}
        </span>
        <span className="small text-muted">
          <i className={`bi ${modeIcon[skill.mode] || "bi-globe"} me-1`}></i>
          {skill.mode}
        </span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-1">{skill.title}</h5>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="ss-nav-avatar rounded-circle border-2 bg-dark bg-opacity-75 d-flex p-3 fs-5 align-items-center justify-content-center text-light fw-bold shadow">
            {userName.charAt(0).toUpperCase()}
          </div>
          <Link
            to={`/users/${skill.userId}`}
            className="text-muted small ss-link"
          >
            {userName}
          </Link>
        </div>
        <p className="card-text text-muted small flex-grow-1">
          {skill.description.length > 100
            ? skill.description.slice(0, 100) + "…"
            : skill.description}
        </p>
        <div className="d-flex align-items-center justify-content-between mt-2">
          <div className="d-flex align-items-center gap-1">
            <StarRating value={skill.rating} />
            <span className="small text-muted ms-1">({skill.reviewCount})</span>
          </div>
          <span
            className={`badge bg-${skill.experienceLevel === "Advanced" ? "danger" : skill.experienceLevel === "Intermediate" ? "warning" : "success"} bg-opacity-75`}
          >
            {skill.experienceLevel}
          </span>
        </div>
        <div className="d-flex align-items-center gap-1 mt-2 text-muted small">
          <i className="bi bi-calendar3"></i>
          <span>{skill.availability}</span>
        </div>
      </div>
      <div className="card-footer bg-transparent border-top-0 pt-0 px-3 pb-3">
        {onRequestSwap ? (
          <button
            className="btn ss-btn-primary w-100 btn-sm"
            onClick={() => onRequestSwap(skill)}
          >
            <i className="bi bi-send me-1"></i>Request Swap
          </button>
        ) : (
          <Link
            to={`/users/${skill.userId}`}
            className="btn ss-btn-outline-primary w-100 btn-sm"
          >
            <i className="bi bi-person me-1"></i>View Profile
          </Link>
        )}
      </div>
    </div>
  );
};

export default SkillCard;

import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const UserCard = ({ user, onSendRequest }) => (
  <div className="card ss-user-card h-100 border-0 shadow-sm text-center">
    <div className="card-body d-flex flex-column align-items-center pt-4">
      <div className="ss-avatar-wrapper mb-3">
        <img
          src={user.profileImage}
          alt={user.name}
          className="rounded-circle ss-user-avatar"
          width={80}
          height={80}
        />
        {user.rating >= 4.8 && (
          <span className="ss-top-badge" title="Top Rated">
            <i className="bi bi-patch-check-fill"></i>
          </span>
        )}
      </div>
      <h6 className="fw-bold mb-0">{user.name}</h6>
      <p className="text-muted small mb-1">
        <i className="bi bi-geo-alt me-1"></i>{user.location}
      </p>
      <div className="d-flex align-items-center gap-1 mb-2">
        <StarRating value={user.rating} />
        <span className="small text-muted">({user.reviewCount})</span>
      </div>
      <p className="text-muted small px-2">
        {user.bio?.length > 80 ? user.bio.slice(0, 80) + "…" : user.bio}
      </p>
    </div>
    <div className="card-footer bg-transparent border-0 pb-3 d-flex gap-2 px-3">
      <Link to={`/users/${user._id}`} className="btn ss-btn-outline-primary flex-fill btn-sm">
        <i className="bi bi-person me-1"></i>Profile
      </Link>
      {onSendRequest && (
        <button className="btn ss-btn-primary flex-fill btn-sm" onClick={() => onSendRequest(user)}>
          <i className="bi bi-send me-1"></i>Swap
        </button>
      )}
    </div>
  </div>
);

export default UserCard;

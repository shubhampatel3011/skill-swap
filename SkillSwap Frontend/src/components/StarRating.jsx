const StarRating = ({ value = 0, max = 5, size = "sm", onChange = null }) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <span className={`ss-stars ss-stars-${size} text-nowrap d-inline-flex gap-1`}>
      {stars.map((star) => (
        <i
          key={star}
          className={`bi ${star <= value ? "bi-star-fill" : star - 0.5 <= value ? "bi-star-half" : "bi-star"}`}
          style={{ cursor: onChange ? "pointer" : "default", color: "#f59e0b" }}
          onClick={() => onChange && onChange(star)}
        ></i>
      ))}
    </span>
  );
};

export default StarRating;

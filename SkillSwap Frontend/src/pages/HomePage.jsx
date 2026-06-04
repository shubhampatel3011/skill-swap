import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MOCK_SKILLS, MOCK_USERS } from "../data/mockData";
import SkillCard from "../components/SkillCard";
import StarRating from "../components/StarRating";

const features = [
  { icon: "bi-arrow-left-right", title: "Skill Exchange", desc: "Trade your skills directly with others. No money involved." },
  { icon: "bi-shield-check", title: "Verified Community", desc: "Real users with ratings and reviews you can trust." },
  { icon: "bi-chat-dots", title: "Real-Time Chat", desc: "Coordinate sessions instantly via our built-in chat." },
  { icon: "bi-star", title: "Reputation System", desc: "Build your reputation with every successful swap." },
  { icon: "bi-search", title: "Smart Search", desc: "Find the perfect skill partner using filters." },
  { icon: "bi-bell", title: "Instant Notifications", desc: "Stay updated on requests, messages, and sessions." },
];

const faqs = [
  { q: "Is SkillSwap free to use?", a: "Yes! SkillSwap is completely free. We believe skills should be exchanged openly within the community." },
  { q: "How does a skill swap work?", a: "You browse skills, find someone whose skill you want, send a swap request offering one of your skills in return. Once accepted, you connect via chat and schedule your sessions." },
  { q: "Can I offer multiple skills?", a: "Absolutely. You can list as many skills as you want and manage them from your profile." },
  { q: "What if someone doesn't show up?", a: "You can report a no-show and leave a review. Our admin team monitors disputes and repeat offenders." },
  { q: "Is online and in-person swapping supported?", a: "Yes! You can set your preference to Online, Offline, or Both when listing a skill." },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const featuredSkills = MOCK_SKILLS.slice(0, 6);
  const topUsers = MOCK_USERS.filter((u) => u.role === "user").slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/skills?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="ss-hero d-flex align-items-center">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge ss-badge-pill mb-3 px-3 py-2">
                <i className="bi bi-lightning-charge-fill me-1"></i>1,200+ Active Learners
              </span>
              <h1 className="display-4 fw-bold text-white mb-4 lh-sm">
                Exchange Skills,<br />
                <span className="ss-gradient-text">Not Money</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                Connect with passionate people in your community. Teach what you know,
                learn what you want — completely free.
              </p>
              <form onSubmit={handleSearch} className="d-flex gap-2 mb-4 flex-wrap">
                <input
                  type="text"
                  className="form-control form-control-lg ss-hero-input flex-grow-1"
                  placeholder="Search a skill (e.g. Photography, React...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="heroSearchInput"
                />
                <button type="submit" className="btn ss-btn-primary btn-lg px-4">
                  <i className="bi bi-search me-1"></i>Search
                </button>
              </form>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn ss-btn-primary btn-lg px-5">
                  Get Started <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <Link to="/skills" className="btn btn-outline-light btn-lg px-4">
                  Browse Skills
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div className="ss-hero-cards-grid">
                {featuredSkills.slice(0, 4).map((skill, i) => (
                  <div key={skill._id} className={`ss-hero-mini-card ss-card-anim-${i} d-flex flex-column justify-content-between gap-2 h-100`}>
                    <div className="d-flex align-items-center gap-2">
                      <img src={skill.userImage} width={28} height={28} className="rounded-circle flex-shrink-0" alt={skill.userName} />
                      <span className="small fw-semibold text-truncate" title={skill.title}>{skill.title}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-auto">
                      <span className="badge bg-primary bg-opacity-15 small text-truncate" style={{ maxWidth: "130px" }} title={skill.category}>{skill.category}</span>
                      <StarRating value={skill.rating} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────── */}
      <section className="ss-stats-strip py-4">
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { val: "1,240+", label: "Community Members", icon: "bi-people-fill" },
              { val: "3,120+", label: "Skills Listed", icon: "bi-grid-3x3-gap-fill" },
              { val: "534+", label: "Successful Swaps", icon: "bi-trophy-fill" },
              { val: "4.8★", label: "Average Rating", icon: "bi-star-fill" },
            ].map((s) => (
              <div key={s.label} className="col-6 col-md-3">
                <div className="ss-stat-item p-3">
                  <i className={`bi ${s.icon} ss-stat-icon`}></i>
                  <div className="ss-stat-val fw-bold">{s.val}</div>
                  <div className="ss-stat-label text-muted small">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="py-6 bg-light" id="features">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="ss-section-badge">Why SkillSwap?</span>
            <h2 className="display-6 fw-bold mt-2">Everything You Need to Swap Skills</h2>
            <p className="text-muted">A complete platform built for skill exchange communities.</p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-sm-6 col-lg-4">
                <div className="ss-feature-card card border-0 h-100 p-4">
                  <div className="ss-feature-icon mb-3">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SKILLS ───────────────────────────────────── */}
      <section className="py-6" id="skills">
        <div className="container py-5">
          <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
            <div>
              <span className="ss-section-badge">Explore</span>
              <h2 className="display-6 fw-bold mt-2 mb-0">Featured Skills</h2>
            </div>
            <Link to="/skills" className="btn ss-btn-outline-primary">
              View All Skills <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {featuredSkills.map((skill) => (
              <div key={skill._id} className="col-sm-6 col-lg-4">
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-6 ss-how-bg" id="how">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="ss-section-badge">Simple Process</span>
            <h2 className="display-6 fw-bold mt-2">How It Works</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { step: "01", icon: "bi-person-plus", title: "Register & Create Profile", desc: "Sign up, add your bio, location, and skills." },
              { step: "02", icon: "bi-search", title: "Search & Discover", desc: "Find skills you want and people you'd like to swap with." },
              { step: "03", icon: "bi-send", title: "Send Swap Request", desc: "Propose your skill in return for theirs." },
              { step: "04", icon: "bi-chat-dots", title: "Chat & Schedule", desc: "Coordinate your sessions via real-time chat." },
              { step: "05", icon: "bi-mortarboard", title: "Conduct Session", desc: "Teach and learn in your agreed format." },
              { step: "06", icon: "bi-star", title: "Rate & Review", desc: "Leave feedback and build your reputation." },
            ].map((step) => (
              <div key={step.step} className="col-sm-6 col-lg-4">
                <div className="ss-step-card p-4 h-100">
                  <div className="ss-step-number">{step.step}</div>
                  <div className="ss-step-icon mt-3 mb-2">
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <h5 className="fw-bold">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP USERS ──────────────────────────────────────────── */}
      <section className="py-6 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="ss-section-badge">Community</span>
            <h2 className="display-6 fw-bold mt-2">Top-Rated Members</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {topUsers.map((u) => (
              <div key={u._id} className="col-sm-6 col-lg-3">
                <div className="card ss-user-card border-0 shadow-sm text-center p-4 h-100">
                  <img src={u.profileImage} alt={u.name} className="rounded-circle mx-auto mb-3" width={72} height={72} />
                  <h6 className="fw-bold mb-1">{u.name}</h6>
                  <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{u.location}</p>
                  <StarRating value={u.rating} />
                  <div className="small text-muted mt-1">({u.reviewCount} reviews)</div>
                  <Link to={`/users/${u._id}`} className="btn ss-btn-outline-primary btn-sm mt-3">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-6">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="ss-section-badge">Testimonials</span>
            <h2 className="display-6 fw-bold mt-2">What Our Community Says</h2>
          </div>
          <div className="row g-4">
            {[
              { name: "Aryan Sharma", role: "React Developer", img: "https://ui-avatars.com/api/?name=Aryan+Sharma&background=0d9488&color=fff&size=128", text: "I learned Photography from Priya while teaching her React. SkillSwap made it so easy to connect and schedule sessions!" },
              { name: "Priya Patel", role: "Photographer", img: "https://ui-avatars.com/api/?name=Priya+Patel&background=e11d48&color=fff&size=128", text: "An amazing platform! I now know React basics and taught 3 photographers. The chat system is seamless." },
              { name: "Sneha Joshi", role: "Music Teacher", img: "https://ui-avatars.com/api/?name=Sneha+Joshi&background=f59e0b&color=fff&size=128", text: "SkillSwap helped me find students for Hindustani classical while I learned Spanish. Truly a community gem." },
            ].map((t) => (
              <div key={t.name} className="col-md-4">
                <div className="ss-testimonial-card card border-0 shadow-sm p-4 h-100">
                  <StarRating value={5} />
                  <p className="text-muted mt-3 mb-4 fst-italic">"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <img src={t.img} alt={t.name} className="rounded-circle" width={44} height={44} />
                    <div>
                      <div className="fw-bold small">{t.name}</div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-6 bg-light" id="faq">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="ss-section-badge">FAQ</span>
            <h2 className="display-6 fw-bold mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion ss-accordion" id="faqAccordion">
                {faqs.map((faq, i) => (
                  <div className="accordion-item border-0 mb-3 rounded overflow-hidden shadow-sm" key={i}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button fw-semibold ${i !== 0 ? "collapsed" : ""}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${i}`}
                      >
                        {faq.q}
                      </button>
                    </h2>
                    <div id={`faq${i}`} className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`} data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-muted">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="ss-cta py-6">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold text-white mb-3">Ready to Start Swapping?</h2>
          <p className="text-white-50 lead mb-4">Join 1,200+ community members exchanging skills today.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-light btn-lg px-5 fw-semibold text-primary">
              Join Free <i className="bi bi-arrow-right ms-1"></i>
            </Link>
            <Link to="/skills" className="btn btn-outline-light btn-lg px-5">
              Browse Skills
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

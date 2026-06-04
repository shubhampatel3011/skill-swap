import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="ss-footer mt-auto">
    <div className="container">
      <div className="row g-4 py-5">
        <div className="col-lg-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="ss-brand-icon"><i className="bi bi-arrow-left-right"></i></span>
            <span className="ss-brand-text fs-4">SkillSwap</span>
          </div>
          <p className="text-secondary small">
            A community platform where people exchange skills without money.
            Teach what you know, learn what you want.
          </p>
          <div className="d-flex gap-3 mt-3">
            <a href="#" className="ss-social-link"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="ss-social-link"><i className="bi bi-linkedin"></i></a>
            <a href="#" className="ss-social-link"><i className="bi bi-instagram"></i></a>
            <a href="#" className="ss-social-link"><i className="bi bi-github"></i></a>
          </div>
        </div>

        <div className="col-6 col-lg-2 offset-lg-1">
          <h6 className="fw-bold text-white mb-3">Platform</h6>
          <ul className="list-unstyled small">
            <li><Link to="/skills" className="ss-footer-link">Browse Skills</Link></li>
            <li><Link to="/register" className="ss-footer-link">Join Community</Link></li>
            <li><Link to="/dashboard" className="ss-footer-link">Dashboard</Link></li>
          </ul>
        </div>

        <div className="col-6 col-lg-2">
          <h6 className="fw-bold text-white mb-3">Support</h6>
          <ul className="list-unstyled small">
            <li><a href="#faq" className="ss-footer-link">FAQ</a></li>
            <li><a href="#" className="ss-footer-link">Help Center</a></li>
            <li><a href="#" className="ss-footer-link">Contact Us</a></li>
          </ul>
        </div>

        <div className="col-6 col-lg-2">
          <h6 className="fw-bold text-white mb-3">Legal</h6>
          <ul className="list-unstyled small">
            <li><a href="#" className="ss-footer-link">Privacy Policy</a></li>
            <li><a href="#" className="ss-footer-link">Terms of Service</a></li>
            <li><a href="#" className="ss-footer-link">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <hr className="border-secondary" />
      <div className="row py-3">
        <div className="col text-center text-secondary small">
          © {new Date().getFullYear()} SkillSwap Community. All rights reserved by Shubham Patel.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

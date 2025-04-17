import React from "react";
import "./home.css";

function App() {
  return (
    <>
      <div className="background-wrapper">
        <div className="overlay-content">
          <nav className="navbar">
            <div className="logo">PulseIQ</div>
            <ul className="nav-links">
              <li>
                <a href="/prediction">Risk Evaluation</a>
              </li>
              <li>
                <a href="#about">About PulseIQ</a>
              </li>
            </ul>
            <div className="right-controls">
              <button className="sign-in">Sign In</button>
            </div>
          </nav>

          <div className="hero-section">
            <div className="hero-content-with-image">
              <div className="hero-text">
                <h1>Explore your heart health with the power of AI.</h1>
                <p>
                  Interact with our intelligent model and get insights into the
                  likelihood of heart disease in just a few clicks.
                </p>
                <a href="/prediction" className="about-link">
                  Evaluate Risk Now!
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 About Section */}
      <div className="about-wrapper" id="about">
        <div className="about-container">
          <h2 className="about-title-floating">About PulseIQ</h2>
          <div className="about-card">
            <p className="about-description">
              <strong>PulseIQ</strong> , A Heart Disease Risk Prediction
              application utilizes a trained K-Nearest Neighbors (KNN) machine
              learning model to assess the likelihood of heart disease based on
              clinical input parameters such as age, sex, chest pain type,
              resting blood pressure, cholesterol level, maximum heart rate, and
              more. The system not only returns the binary prediction (risk or
              no risk) but also includes confidence levels and voting statistics
              from the ensemble. It displays real-time results, visualize
              prediction metrics using charts, and allow PDF export of the
              report for further evaluation.
              <p className="disclaimer">
                <strong>
                  📌 Disclaimer: This tool is intended for educational and
                  informational purposes only. It is not a substitute for
                  professional medical diagnosis or advice. Always consult with
                  a qualified healthcare provider for any health concerns.
                </strong>
              </p>
            </p>

            <a href="/prediction" className="about-link">
              Evaluate Now!
            </a>
          </div>
        </div>
      </div>
      <footer className="footer-wrapper">
        <div className="footer-container">
          <div className="footer-left">
            <h3 className="footer-logo">PulseIQ</h3>
            <p className="footer-tagline">
              Your intelligent health companion—predicting heart disease risks
              with precision and care.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul>
              <li>
                <a className="links" href="/prediction">
                  🔍 Evaluate
                </a>
              </li>
              <li>
                <a className="links" href="#about">
                  📜 About
                </a>
              </li>
              <li>
                <a className="links" href="mailto:support@pulseiq.ai">
                  📧 Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} <strong>PulseIQ</strong>. All rights
            reserved.
          </p>
          <p>
            <strong>Made by Payal</strong>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

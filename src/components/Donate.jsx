import React from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import "./Donate.css";
import RamadanChallenge from "./RamadanChallenge";

function Donate() {
  const oneOffDonateLink = "https://buy.stripe.com/4gw17937vcSEg3maEO";
  const standingOrderLink = "https://buy.stripe.com/9AQ035fUhg4Qg3m3cj";

  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      id="donate"
      className={`donate-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="donate-content">
        <h2 className="animate-item">Support Your Masjid</h2>
        <p className="animate-item">
          Your generous donations help us maintain the mosque and support our
          community. May Allah (SWT) reward you for your contribution.
        </p>
        <p className="animate-item">
          Please include "Southend" in your donation reference.
        </p>

        <div className="donate-buttons-group animate-item">
          <a
            href={oneOffDonateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-section-button"
          >
            Make a One-Off Donation
          </a>
          <a
            href={standingOrderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-section-button secondary"
          >
            Set Up Standing Order
          </a>
        </div>

        <div className="separator animate-item">OR</div>

        <div className="bank-details animate-item">
          <h3>Donate via Bank Transfer</h3>
          <div className="detail-item">
            <span>Account Name</span>
            <strong>DAWAT ISLAMI UK</strong>
          </div>
          <div className="detail-item">
            <span>Sort Code</span>
            <strong>30-97-73</strong>
          </div>
          <div className="detail-item">
            <span>Account Number</span>
            <strong>43813160</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Donate;

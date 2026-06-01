import React from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import "./Donate.css";
import RamadanChallenge from "./RamadanChallenge";

const TEXT = {
  title: "Support Your Masjid",
  description: "Your generous donations help us maintain the mosque and support our community. May Allah (SWT) reward you for your contribution.",
  refNote: 'Please include "Southend" in your donation reference.',
  oneOffBtn: "Make a One-Off Donation",
  standingOrderBtn: "Set Up Standing Order",
  orSeparator: "OR",
  bankTransferTitle: "Donate via Bank Transfer",
  accountNameLabel: "Account Name",
  accountNameVal: "DAWAT ISLAMI UK",
  sortCodeLabel: "Sort Code",
  sortCodeVal: "30-97-73",
  accountNumLabel: "Account Number",
  accountNumVal: "43813160"
};

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
        <h2 className="animate-item">{TEXT.title}</h2>
        <p className="animate-item">
          {TEXT.description}
        </p>
        <p className="animate-item">
          {TEXT.refNote}
        </p>

        <div className="donate-buttons-group animate-item">
          <a
            href={oneOffDonateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-section-button"
          >
            {TEXT.oneOffBtn}
          </a>
          <a
            href={standingOrderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-section-button secondary"
          >
            {TEXT.standingOrderBtn}
          </a>
        </div>

        <div className="separator animate-item">{TEXT.orSeparator}</div>

        <div className="bank-details animate-item">
          <h3>{TEXT.bankTransferTitle}</h3>
          <div className="detail-item">
            <span>{TEXT.accountNameLabel}</span>
            <strong>{TEXT.accountNameVal}</strong>
          </div>
          <div className="detail-item">
            <span>{TEXT.sortCodeLabel}</span>
            <strong>{TEXT.sortCodeVal}</strong>
          </div>
          <div className="detail-item">
            <span>{TEXT.accountNumLabel}</span>
            <strong>{TEXT.accountNumVal}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Donate;

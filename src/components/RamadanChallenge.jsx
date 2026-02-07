import React from "react";

function RamadanChallenge() {
  const launchGoodLink =
    "https://www.launchgood.com/v4/scheduled-giving/ramadan/bismillah?code=TeamSyed&src=referrals&campaignId=381352";

  return (
    <div className="ramadan-challenge-container animate-item">
      <div className="video-wrapper-native">
        <video
          controls
          playsInline
          className="challenge-video"
          preload="metadata"
        >
          <source src="ramadan-challenge.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="challenge-content">
        <div className="challenge-header">
          <h3>🌙 LaunchGood Ramadan Challenge</h3>

          <p>
            Commit to donating a minimum of <strong>£1 a day</strong> for the 30
            days of Ramadan.
          </p>

          <p>
            You choose which charity receives your £1 each day. It does not have
            to be us.
          </p>

          <p>
            But simply by joining via our link, LaunchGood will donate a{" "}
            <strong>£100 bonus </strong>
            to Dawat-e-Islami.
          </p>
        </div>

        <div className="challenge-cta">
          <a
            href={launchGoodLink}
            target="_blank"
            rel="noopener noreferrer"
            className="challenge-button"
          >
            Join the Challenge
          </a>
        </div>
      </div>
    </div>
  );
}

export default RamadanChallenge;

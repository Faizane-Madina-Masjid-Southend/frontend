import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FiSunset, FiSun } from "react-icons/fi";
import "./TodayPrayerTimes.css";

const createDateFromTimeString = (timeString, prayerName) => {
  if (!timeString || typeof timeString !== "string" || timeString.trim() === "")
    return null;
  let [hours, minutes] = timeString.split(".").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  if (
    (["Asr", "Maghrib", "Isha"].includes(prayerName) && hours < 12) ||
    (["Jummah", "Dhuhar"].includes(prayerName) && hours < 11)
  ) {
    hours += 12;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTo24HourDisplay = (timeString, prayerName) => {
  if (!timeString || typeof timeString !== "string" || timeString.trim() === "")
    return "---";
  let [hours, minutes] = timeString.split(".").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "---";

  if (
    (["Asr", "Maghrib", "Isha"].includes(prayerName) && hours < 12) ||
    (["Jummah", "Dhuhar"].includes(prayerName) && hours < 11)
  ) {
    hours += 12;
  }

  const fHours = String(hours).padStart(2, "0");
  const fMinutes = String(minutes).padStart(2, "0");
  return `${fHours}:${fMinutes}`;
};

function TodayPrayerTimes({ prayerData }) {
  const [now, setNow] = useState(new Date());
  const todayDate = now.getDate();
  const isFriday = now.getDay() === 5;
  const [islamicDate, setIslamicDate] = useState("");

  // 1. Create a fake "yesterday" date just for the Islamic API
  const adjustedDate = new Date(now);
  adjustedDate.setDate(adjustedDate.getDate() - 1);

  // 2. Format that adjusted date for the API
  const apiDateString = `${adjustedDate.getDate()}-${adjustedDate.getMonth() + 1}-${adjustedDate.getFullYear()}`;

  useEffect(() => {
    async function fetchIslamicDate() {
      try {
        // 3. Fetch using the adjusted string (removed the buggy adjustment parameter)
        const islamicDateResponse = await fetch(
          `https://api.aladhan.com/v1/gToH?date=${apiDateString}`,
        );
        if (!islamicDateResponse.ok) {
          throw new Error(
            `Islamic Date HTTP error! status: ${islamicDateResponse.status}`,
          );
        }
        const islamicDateApiData = await islamicDateResponse.json();

        if (islamicDateApiData.code === 200 && islamicDateApiData.data?.hijri) {
          const hijri = islamicDateApiData.data.hijri;
          setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`);
        } else {
          console.warn("Could not retrieve Islamic date:", islamicDateApiData);
          setIslamicDate("Islamic date unavailable");
        }
      } catch (e) {
        console.error("Failed to fetch Islamic date:", e);
        setIslamicDate("Islamic date unavailable");
      }
    }
    fetchIslamicDate();
  }, [apiDateString]); // Now safely only runs once per day

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedGregorianDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todaysTimes = prayerData?.find((day) => day.date === todayDate);

  // We will build the bottom section conditionally based on if we have data
  let mainContent;

  if (!prayerData || !todaysTimes) {
    mainContent = (
      <div className="placeholder-message">
        <p>Today's prayer times are unavailable. Please try again later.</p>
      </div>
    );
  } else {
    // --- Calculate Current/Next Prayer and Countdown ---
    const getPrayerEvents = () => {
      const events = [
        { name: "Fajr", type: "Start", time: todaysTimes.fajr?.start },
        { name: "Fajr", type: "Jamaat", time: todaysTimes.fajr?.jamaat },
        { name: "Sunrise", type: "Event", time: todaysTimes.sunrise },
        { name: "Dhuhar", type: "Start", time: todaysTimes.dhuhar?.start },
        ...(isFriday && todaysTimes.dhuhar?.jamaat?.includes("/")
          ? todaysTimes.dhuhar.jamaat.split("/").map((t, i) => ({
              name: "Jummah",
              type: `${i + 1}${i === 0 ? "st" : "nd"} Jamaat`,
              time: t?.trim(),
            }))
          : [
              {
                name: "Dhuhar",
                type: "Jamaat",
                time: todaysTimes.dhuhar?.jamaat,
              },
            ]),
        { name: "Asr", type: "Start", time: todaysTimes.asr?.start },
        { name: "Asr", type: "Jamaat", time: todaysTimes.asr?.jamaat },
        { name: "Maghrib", type: "Start", time: todaysTimes.maghrib?.start },
        { name: "Isha", type: "Start", time: todaysTimes.isha?.start },
        { name: "Isha", type: "Jamaat", time: todaysTimes.isha?.jamaat },
      ];
      return events
        .map((event) => ({
          ...event,
          dateTime: createDateFromTimeString(event.time, event.name),
        }))
        .filter(
          (event) => event.dateTime instanceof Date && !isNaN(event.dateTime),
        )
        .sort((a, b) => a.dateTime - b.dateTime);
    };

    const prayerEvents = getPrayerEvents();
    let currentPrayer = null;
    let nextPrayer = null;

    for (const event of prayerEvents) {
      if (event.dateTime <= now) {
        currentPrayer = event;
      }
      if (event.dateTime > now && !nextPrayer) {
        nextPrayer = event;
      }
    }

    if (!nextPrayer && prayerEvents.length > 0) {
      nextPrayer = { ...prayerEvents[0], isTomorrow: true };
      if (nextPrayer.dateTime) {
        const tomorrowDateTime = new Date(nextPrayer.dateTime);
        tomorrowDateTime.setDate(tomorrowDateTime.getDate() + 1);
        nextPrayer.dateTime = tomorrowDateTime;
      }
    }

    let countdown = { hours: 0, minutes: 0, seconds: 0 };
    if (nextPrayer?.dateTime) {
      const diff = nextPrayer.dateTime - now;
      if (diff > 0) {
        countdown = {
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
      }
    }

    const formatTime = (time) => time.toString().padStart(2, "0");

    const displayPrayers = [
      { name: "Fajr", icon: <FaMoon />, ...todaysTimes.fajr },
      {
        name: isFriday ? "Jummah" : "Dhuhar",
        icon: <FaSun />,
        ...todaysTimes.dhuhar,
        jamaat: isFriday
          ? todaysTimes.dhuhar?.jamaat
          : todaysTimes.dhuhar?.jamaat,
      },
      { name: "Asr", icon: <FiSun />, ...todaysTimes.asr },
      {
        name: "Maghrib",
        icon: <FiSunset />,
        ...todaysTimes.maghrib,
        jamaat: todaysTimes.maghrib?.start,
      },
      { name: "Isha", icon: <FaMoon />, ...todaysTimes.isha },
    ];

    mainContent = (
      <>
        <div className="countdown-section">
          {nextPrayer?.dateTime && nextPrayer.dateTime - now > 0 ? (
            <>
              <p>
                {nextPrayer.name}{" "}
                {nextPrayer.type.replace("Start", "").replace("Event", "")}
                {nextPrayer.isTomorrow ? " (Tomorrow)" : ""} in:
              </p>{" "}
              <div className="countdown-timer">
                <span>{formatTime(countdown.hours)}</span>:
                <span>{formatTime(countdown.minutes)}</span>:
                <span>{formatTime(countdown.seconds)}</span>
              </div>
            </>
          ) : (
            <p>All prayers for today finished.</p>
          )}
        </div>

        <div className="prayers-list">
          {displayPrayers.map((prayer) => (
            <div
              key={prayer.name}
              className={`prayer-row ${
                currentPrayer?.name === prayer.name ||
                (isFriday &&
                  currentPrayer?.name === "Jummah" &&
                  prayer.name === "Jummah")
                  ? "is-current"
                  : ""
              }`}
            >
              <div className="prayer-info">
                <span className="prayer-icon">{prayer.icon}</span>
                <span className="prayer-name">{prayer.name}</span>
              </div>
              <div className="prayer-times">
                <div className="time-block">
                  <span className="time-label">Start</span>
                  <span className="time-value">
                    {formatTo24HourDisplay(prayer.start, prayer.name)}
                  </span>
                </div>
                <div className="time-block">
                  <span className="time-label">Jamaat</span>
                  <span className="time-value">
                    {isFriday &&
                    prayer.name === "Jummah" &&
                    prayer.jamaat?.includes("/")
                      ? prayer.jamaat
                          .split("/")
                          .map((t) => formatTo24HourDisplay(t.trim(), "Jummah"))
                          .join(" / ")
                      : formatTo24HourDisplay(prayer.jamaat, prayer.name)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="today-times-container">
      {/* Dates are now outside the early return so they ALWAYS render */}
      <div className="current-date-section">
        <p>{formattedGregorianDate}</p>
        {islamicDate && <p className="islamic-date">{islamicDate}</p>}
      </div>

      {/* This renders either the placeholder or the times/countdown */}
      {mainContent}
    </div>
  );
}

export default TodayPrayerTimes;

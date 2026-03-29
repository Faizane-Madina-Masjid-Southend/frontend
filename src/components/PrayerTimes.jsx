import React, { useState, useEffect } from "react";
import TodayPrayerTimes from "./TodayPrayerTimes";
import AboutUs from "./AboutUs";
import "./PrayerTimes.css";

function PrayerTimes() {
  const [timetable, setTimetable] = useState(null);
  const [jummahTimes, setJummahTimes] = useState({
    j1: "13:30",
    j2: "14:30",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthName = now.toLocaleDateString("en-GB", {
        month: "long",
      });
      const API_URL = import.meta.env.VITE_STRAPI_API_URL || "http://localhost:1337";

      setLoading(true);

      // --- 1. Fetch Timetable (Isolated) ---
      try {
        const timetableUrl = `${API_URL}/api/timetables?filters[year][$eq]=${currentYear}&filters[month][$eq]=${currentMonthName}&populate=timetableImage`;
        const timetableRes = await fetch(timetableUrl);

        if (timetableRes.ok) {
          const timetableJson = await timetableRes.json();
          const currentTimetable = timetableJson?.data?.[0];

          if (currentTimetable) {
            setTimetable(currentTimetable);
          } else {
            console.warn("Timetable not found for this month.");
            setTimetable(null);
          }
        }
      } catch (e) {
        console.error("Timetable fetch failed:", e);
        setTimetable(null);
      }

      // --- 2. Fetch Weekly Events / Jummah by Category ---
      try {
        // We append populate=* just in case 'category' is setup as a relation rather than a standard text field
        const eventsUrl = `${API_URL}/api/weekly-events?populate=*&pagination[limit]=100`;
        const eventsRes = await fetch(eventsUrl);
        
        if (eventsRes.ok) {
          const eventsJson = await eventsRes.json();
          
          if (eventsJson.data && Array.isArray(eventsJson.data)) {
            
            // 1. Filter out ONLY the events where the category is "jummah"
            const jummahEvents = eventsJson.data.filter((e) => {
              // This checks standard text fields AND relational fields
              const rawCat = 
                e.attributes?.category?.data?.attributes?.name || // If category is a related collection
                e.attributes?.category || // If category is a normal text/enum field
                e.attributes?.Category || 
                e.category || 
                e.Category || 
                "";
                
              return typeof rawCat === 'string' && rawCat.toLowerCase().includes("jummah");
            });

            // 2. Extract the actual time strings (e.g., "12:30 PM", "13:30:00")
            let times = jummahEvents
              .map(e => e.attributes?.time || e.attributes?.Time || e.time || e.Time)
              .filter(Boolean); // Remove empty values

            // 3. Sort the times chronologically so 1st Jamaat is always first
            times.sort((a, b) => {
              const parseTime = (t) => {
                const match = t.match(/(\d+):(\d+)/);
                if (!match) return 0;
                let hours = parseInt(match[1], 10);
                let mins = parseInt(match[2], 10);
                if (t.toLowerCase().includes('pm') && hours < 12) hours += 12;
                if (t.toLowerCase().includes('am') && hours === 12) hours = 0;
                return hours * 60 + mins;
              };
              return parseTime(a) - parseTime(b);
            });

            // 4. Assign the sorted times
            setJummahTimes({
              j1: times[0] || "12:30 PM", // Defaults if only 0 or 1 found
              j2: times[1] || "1:30 PM",
            });
          }
        }
      } catch (eventError) {
        console.warn("Jummah times could not be loaded, using defaults.", eventError);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#555" }}>
        Loading...
      </div>
    );
  }

  const prayerData = timetable?.prayerData;
  const timetableFileUrl = timetable?.timetableImage?.url || "#";

  return (
    <div className="prayer-section-wrapper" id="prayer-times">
      <div className="prayer-content-grid">
        <div className="left-column">
          <TodayPrayerTimes prayerData={prayerData} />
        </div>

        <div className="right-column">
          <div className="about-us-wrapper">
            <AboutUs />
          </div>

          <div className="jummah-info-card">
            <div className="jummah-details">
              <h4>Jummah Salah</h4>
              <div className="jummah-times">
                <div className="j-time-row">
                  <span className="j-label">1st Jamaat:</span>
                  <span className="j-time">{jummahTimes.j1}</span>
                </div>
                <div className="j-time-row">
                  <span className="j-label">2nd Jamaat:</span>
                  <span className="j-time">{jummahTimes.j2}</span>
                </div>
              </div>
            </div>

            <a
              href={timetableFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn timetable-btn"
              style={{
                display: timetableFileUrl === "#" ? "none" : "inline-block",
              }}
            >
              View Monthly Timetable
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrayerTimes;
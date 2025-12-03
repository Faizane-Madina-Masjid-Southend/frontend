# 🕌 Faizane Madina Masjid Southend | Mosque Website

**A live, dynamic frontend application developed for the Faizane Madina Masjid Southend community.**

![Project Status](https://img.shields.io/badge/Status-Live%20Client%20Project-success)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20Strapi-blue)
![Responsive](https://img.shields.io/badge/Design-Responsive-orange)

---

## 📍 Overview
This repository contains the frontend source code for the **Faizane Madina Masjid Southend** mosque website.

This is a **live client project** designed to serve as the digital hub for the local community. Unlike static mosque websites, this application is **fully dynamic**, connecting to a **Strapi Headless CMS** to fetch real-time data for announcements, gallery images, and prayer timetables. This architecture allows non-technical mosque administrators to update content easily without touching the codebase.

---

## ✨ Key Features

### 🤲 Dynamic Prayer Timetable
* **Real-Time Countdown:** Custom logic calculates the time remaining until the next prayer (Jummah, Asr, Maghrib, etc.) based on the current time.
* **Auto-Highlighting:** The interface automatically highlights the current prayer time slot.
* **Islamic Date Integration:** Fetches the current Hijri date via the **Aladhan API**.
* **Visual Queues:** Logic handles special cases like Friday (Jummah) vs. regular Dhuhr prayers.

### 📢 Community Engagement
* **Digital Noticeboard:** An "Announcements" section that renders Markdown content fetched from the CMS, complete with pagination.
* **Event Calendar:** A horizontal scrolling calendar displaying weekly classes (Madrassa) and gatherings (Ijtimah).
* **Interactive Gallery:** A performance-optimized image gallery using `yet-another-react-lightbox`.

### 🎨 UI/UX & Performance
* **Scroll Animations:** Custom `useIntersectionObserver` hook triggers fade-in animations as users scroll.
* **Responsive Design:** Fully mobile-optimized navigation, layouts, and touch-friendly sliders using **Swiper.js**.
* **Theming:** Centralized CSS variables for consistent branding (Green/Gold palette).

---

## 🛠️ Tech Stack

* **Framework:** React.js (v18+)
* **Build Tool:** Vite
* **Routing:** React Router DOM
* **CMS (Backend):** Strapi (Headless CMS)
* **Styling:** CSS Modules & Variables
* **Libraries:**
    * `swiper` (Carousels)
    * `react-markdown` (Text rendering)
    * `yet-another-react-lightbox` (Image viewing)
    * `react-icons` (Iconography)

---

## 🏗️ Architecture & Setup

### Prerequisites
* Node.js (v18 or higher)
* A running instance of the Strapi Backend (or access to the API URL).

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone [https://github.com/YusufQuresh1/faizan-e-madina-frontend.git](https://github.com/YusufQuresh1/faizan-e-madina-frontend.git)
cd faizan-e-madina-frontend
npm install
````

### 2\. Environment Configuration

Create a `.env` file in the root directory to connect to your backend:

```env
# URL of your Strapi CMS instance
VITE_STRAPI_API_URL=http://localhost:1337
```

### 3\. Run Locally

Start the development server:

```bash
npm run dev
```

-----

## 📂 Project Structure

```text
src/
├── assets/             # Static images and logos
├── components/         # Reusable UI components
│   ├── PrayerTimes.jsx # Logic for fetching & displaying times
│   ├── TodayPrayerTimes.jsx # Countdown & next prayer logic
│   ├── Services.jsx    # Swiper carousel for services
│   └── ...
├── hooks/              # Custom hooks
│   └── useIntersectionObserver.js # Scroll animation logic
├── data.js             # Static fallback data
└── App.jsx             # Main application layout
```

-----

## 🧩 Key Code Highlight: Prayer Logic

One of the most complex challenges was handling the prayer countdown logic to switch accurately between Gregorian and Islamic contexts.

*Located in `src/components/TodayPrayerTimes.jsx`:*

```javascript
// Logic to calculate the next prayer based on current system time
const getPrayerEvents = () => {
  // ... maps API data to comparable Date objects
  // ... handles logic for Friday (Jummah) vs Weekday (Dhuhar)
  return events.sort((a, b) => a.dateTime - b.dateTime);
};
```

-----

## 📬 Contact

**Mohammed Qureshi**
*Connect with me on LinkedIn to discuss this project further.*

  * [LinkedIn Profile](https://www.google.com/search?q=PASTE_YOUR_LINKEDIN_URL_HERE)

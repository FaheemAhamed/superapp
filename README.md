# The Super App - Modular Refactoring & Setup Guide

**The Super App** is a consolidated dashboard application that unites multiple features—user profile tracking, real-time weather alerts, automatic rotating news, a notes scratchpad, a countdown timer, and personalized movie recommendations—into a single visual dashboard.

This repository has been refactored from a flat structure into a clean, modular, and maintainable workspace.

---

## 📂 Architecture & Modular Directory Layout

The application directory structure has been reorganized into specialized directories to enforce separation of concerns, improve reusability, and isolate external service logic:

```text
super-app/
├── public/
├── src/
│   ├── assets/              # Static media assets (background images)
│   ├── components/          # Reusable UI widgets and layout modules
│   │   ├── RegistrationForm.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── WeatherWidget.jsx
│   │   ├── NewsWidget.jsx
│   │   ├── TimerWidget.jsx
│   │   ├── NotesWidget.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieModal.jsx
│   │   └── ProfileWidget.jsx
│   ├── pages/               # Page-level route views
│   │   ├── Register.jsx
│   │   ├── Categories.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MainDashboard.jsx
│   │   └── Movies.jsx
│   ├── services/            # Isolated network operations
│   │   ├── weatherApi.js
│   │   ├── newsApi.js
│   │   └── movieApi.js
│   ├── store/               # Centralized Zustand state
│   │   └── useStore.js
│   ├── routes/              # Centralized routing definitions
│   │   └── AppRoutes.jsx
│   ├── App.jsx              # Main App entry point
│   ├── main.jsx             # React DOM renderer
│   └── styles.css           # Global Tailwind stylesheet config
└── package.json
```

### Module Highlights:
* **`src/services/`**: Abstracts all network `fetch` requests away from raw UI components. Services normalize raw payloads (e.g. mapping NewsAPI's `urlToImage` and NewsData's `image_url` to a standard schema).
* **`src/components/`**: Houses both complex dashboard widgets and smaller stateless sub-units (like `CategoryCard`, `MovieCard`, and `RegistrationForm`).
* **`src/pages/`**: Acts as page containers that assemble the UI layouts, managing minimal page-level routing states.

---

## 🛠 Architectural Solutions & Layout Analysis

### 1. Profile Widget Text Spacing & Alignment
* **Problem**: Originally, the Name, Email, and Username fields used absolute positioning with fixed vertical offsets (`top-[82.69px]`, `top-[140.75px]`, `top-[198.81px]`) and a constrained name width (`w-[154.82px]`). When names contained spaces or longer text (e.g., "Faheem Ahmed"), the text wrapped and clashed directly into the email and username blocks.
* **Solution**: Replaced absolute spacing with a vertical flexbox container (`flex flex-col gap-[14px]`). Increased text container width to `w-[500px]` and implemented standard `truncate` logic. Full names and long emails now display as single-line items, automatically aligning and remaining safely separated from neighboring elements.

### 2. Multi-Tiered News API Fetching & Fallbacks
* **Problem**: The NewsData.io API key is subject to strict daily credit limits, causing the dashboard's news feed to throw "Unauthorized" or "Limit Exceeded" errors when credit blocks expire.
* **Solution**: Implemented a multi-tier fallback fetch pipeline:
  1. **Key Signature Detection**: The service automatically parses `VITE_NEWS_API_KEY`. If it matches the NewsData.io structure (starting with `pub_`), it routes to `newsdata.io`. If it's a 32-character hex key, it routes to `newsapi.org`.
  2. **Tier-1 Fallback (Free Mirror)**: If the primary key query fails, is rate-limited, or CORS is blocked, the service shifts to a keyless public news mirror (`saurav.tech/NewsAPI`) to retrieve active top headlines.
  3. **Tier-2 Fallback (Offline Mock Data)**: If all networks fail, a predefined local array (`FALLBACK_NEWS`) populated with rich placeholder headlines and cover images is used.
* **News Auto-rotation**: A 2-second interval loop handles active rotation between articles, cleaning up the interval listener on unmount to avoid memory leaks.
* **Description Styling**: Boosted paragraph text size from `18.25px` to a modern `22px`, centered the text box (`w-[395px]`, `left-[34px]`), and styled text to align `left` instead of `justify` to provide a balanced reading experience.

---

## 🔧 Installation & Setup Instructions

To get the application running locally:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

### 2. Clone and Setup Project
```bash
# Clone the repository
git clone https://github.com/FaheemAhamed/superapp.git
cd superapp

# Install package dependencies
npm install
```

### 3. Configure Environment Keys
Create a `.env` file in the root folder of the project:
```env
# OpenWeatherMap Key (Required for weather updates)
VITE_WEATHER_API_KEY="your_openweathermap_api_key"

# NewsAPI Key (32-character hex) OR NewsData.io Key (starts with pub_)
VITE_NEWS_API_KEY="your_news_api_key"

# OMDB Movie API Key
VITE_OMDB_API_KEY="your_omdb_api_key"
```

### 4. Run Locally
```bash
# Start Vite development server
npm run dev
```
The app will be available on the terminal output URL (typically `http://localhost:8080`).

### 5. Build for Production
```bash
# Compile and optimize code
npm run build
```

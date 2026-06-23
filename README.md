# The Super App

**The Super App** is a comprehensive, multi-feature React application designed to consolidate everyday utilities into a single, personalized, and visually cohesive dashboard. 

Instead of switching between multiple applications to check the weather, read the news, take notes, set timers, and discover movies, The Super App brings all these experiences into one premium, dynamic interface.

**Live Demo:** [https://superapp-lilac-xi.vercel.app/](https://superapp-lilac-xi.vercel.app/)

---

## 🚀 Features

### 1. User Registration & Onboarding
- **Validated Registration:** A multi-field form enforcing strict validation for Name, Alphanumeric Username, valid Email format, 10-digit Mobile numbers, and secure passwords.
- **State Management:** User data is securely managed and locally persisted to streamline the login experience.

### 2. Category Selection
- **Personalization:** Users choose their favorite entertainment categories (Action, Drama, Romance, Thriller, Western, Horror, Fantasy, Music, Fiction).
- **Constraints:** A strict minimum threshold of 3 categories ensures enough data is available to customize the dashboard.

### 3. Super Dashboard
A highly modular, unified widget board featuring:
- **Profile Widget:** Displays the user's avatar, details, and selected category chips.
- **Weather Widget:** Integrates with OpenWeatherMap API to display real-time conditions, temperature, pressure, humidity, and wind speeds based on geolocation.
- **News Widget:** Fetches live news (via NewsData API) and auto-rotates articles seamlessly every 2 seconds.
- **Timer Widget:** A fully-featured circular SVG countdown timer (Hours, Minutes, Seconds) with start, pause, resume, reset capabilities and a completion popup.
- **Notes Widget:** A quick scratchpad for notes that automatically persists data using `localStorage`.

### 4. Entertainment Discovery
- **Movie Grid:** Horizontally scrolling galleries populated dynamically using the OMDB API based on the user's chosen categories.
- **Detail Modal:** Clicking any title brings up an immersive overlay with the movie's poster, genre, IMDb rating, runtime, plot synopsis, director, and cast.

---

## 🛠 Tech Stack

- **Framework:** React 18 (via Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Phosphor Icons
- **APIs Used:** 
  - OpenWeatherMap API (Weather)
  - NewsData.io API (News)
  - OMDB API (Movies)

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/FaheemAhamed/superapp.git
   cd superapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add the following API keys:
   ```env
   VITE_WEATHER_API_KEY="your_openweathermap_api_key"
   VITE_NEWS_API_KEY="your_newsdata_api_key"
   VITE_OMDB_API_KEY="your_omdb_api_key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will typically be available at `http://localhost:5173`.

---

## 🎨 Design & Layout
The project places a strong emphasis on a premium, modern aesthetic, utilizing dark mode themes, glassmorphism, precise grid alignments, and smooth micro-animations. It is fully responsive, offering distinct optimized layouts for both Desktop and Mobile experiences.

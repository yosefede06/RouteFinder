# Route Finder with Points of Interest (POI) Filtering

Welcome to the **Route Finder with POI Filtering** project. This tool allows users to find routes between two locations, while also exploring various Points of Interest (POIs) such as restaurants, cafes, hotels, and more. Users can adjust the maximum distance for the route, and dynamically filter POIs based on selected categories. The project leverages Firebase as the backend for storing and retrieving location data and ratings, and it uses Leaflet.js for rendering the map and routes.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [How to Use](#how-to-use)
- [File Structure](#file-structure)
- [Firebase Configuration](#firebase-configuration)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features
- **Backend Algorithms**: Written in Python for pathfinding and data processing.
- **Interactive Map**: Users can click on the map to select starting and ending points.
- **POI Filtering**: Dynamically filter Points of Interest (POIs) like restaurants, cafes, hotels, etc., based on user selections.
- **Distance Slider**: Adjust the maximum route distance using a slider, and filter POIs within the specified range.
- **Dynamic Route Generation**: Users can generate a route between two selected points with real-time updates.
- **Custom Icons**: Different categories of POIs have custom icons, enhancing the visual experience.
- **Draggable Markers**: Start and end points are draggable for easy adjustments.
- **Rating Display**: Each POI displays its rating (1-10) dynamically, retrieved from Firebase.
- **Firebase Integration**: Leverages Firebase Realtime Database to store and retrieve location data and ratings.

## Technologies Used

- **Frontend**:
  - [Leaflet.js](https://leafletjs.com/) for interactive maps and routes
  - [Bootstrap](https://getbootstrap.com/) for styling and layout
  - [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) for route management
  - [Font Awesome](https://fontawesome.com/) for icons

- **Backend**:
  - [Python](https://www.python.org/) for algorithms (pathfinding, POI processing)
  - [Firebase Realtime Database](https://firebase.google.com/docs/database) for storing and retrieving location data
  - [Firebase SDK](https://firebase.google.com/docs/web/setup) for frontend interaction with Firebase

- **API**:
  - [Open Source Routing Machine (OSRM)](http://project-osrm.org/) for route calculation.

## Setup and Installation

### Prerequisites
1. **Python** installed (for backend algorithms).
2. **Node.js** installed on your local machine.
3. **Firebase Project** set up on [Firebase Console](https://console.firebase.google.com/).
4. Basic knowledge of HTML, CSS, and JavaScript.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/route-finder.git
   cd route-finder
2.	Install dependencies (if needed):
   ```bash
      npm install
   ```
3. 	Install dependencies (if needed):


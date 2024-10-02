# Route Finder with Points of Interest (POI) Filtering

Welcome to the **Route Finder with POI Filtering** project. This tool allows users to find routes between two locations, while also exploring various Points of Interest (POIs) such as restaurants, cafes, hotels, and more. Users can adjust the maximum distance for the route, and dynamically filter POIs based on selected categories. The project leverages Firebase as the backend for storing and retrieving location data and ratings, and it uses Leaflet.js for rendering the map and routes.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation Installation (Algorithms)](#setup-and-installation-algorithms)
- [Setup and Installation (Full project)](#setup-and-installation)
- [How to Use](#how-to-use)
- [Firebase Configuration](#firebase-configuration)
- [Future Improvements](#future-improvements)

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
    
## Setup and Installation (Algorithms)

This project includes several algorithms to find and optimize routes between points of interest (POIs). The algorithms include:

- **Depth First Search (DFS)**
- **Lookahead Constraint Satisfaction Problem (CSP)**
- **UCS Local Beam Search**

These algorithms can be tested with different graph sizes and configurations by running Python scripts that generate graphs and evaluate the algorithms' performance.

### Running the Tests
1. Clone the repository.
2. Install the necessary dependencies (use a virtual environment).
3. Navigate to the backend-python folder and run:
  ```bash
  python3 backend-python/tests.py
  ```
  
## Setup and Installation (Full project)

### Prerequisites
1. **Python** installed (for backend algorithms).
2. **Node.js** installed on your local machine.
3. **Firebase Project** set up on [Firebase Console](https://console.firebase.google.com/).
4. Basic knowledge of HTML, CSS, and JavaScript.
### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yosefede06/RouteFinder.git
   cd RouteFinder
   ```
2. Set up Firebase by adding your Firebase configuration to the project. (See Firebase Configuration for details).

3. To run the backend (Python):
```bash
python3 backend-python/main.py
```
4.	Serve the frontend project locally:
``` bash
index.html
```

## How to Use

1. **Select Start and End Points**:
   - Click on the map to choose a start point and an end point. You can also drag the markers to adjust their positions.
   - The start and end points will be visually highlighted on the map.

2. **Choose Categories of Interest**:
   - Check the boxes for the categories of Points of Interest (POIs) you want to include, such as restaurants, cafes, hotels, and more. 
   - Only POIs that fall under the selected categories and meet your distance criteria will be shown on the map.

3. **Adjust Maximum Route Distance**:
   - Use the slider at the bottom of the form to set the maximum allowed distance for the route in kilometers. 
   - POIs will be dynamically filtered based on this distance.

4. **Generate the Route**:
   - Once you've selected the start and end points, chosen your categories, and set the route distance, click the "Generate Route" button to calculate the route.
   - A route will be generated and displayed on the map. Along with the route, the filtered POIs will appear based on your selections.

5. **POI Information**:
   - For each POI shown on the map, a custom icon will represent its category. Click on the icons to see more details, such as the name, category, and rating.
   - The ratings are shown on a scale of 1-10 and are fetched dynamically from Firebase.

6. **Refreshing the Map**:
   - To start over or choose new points and filters, click the "Refresh" button. This will reset the map and allow you to choose new start and end points, categories, and distances.

7. **Route Distance and Time**:
   - After generating a route, the total distance (in kilometers) and estimated time (in hours and minutes) will be displayed beneath the map.



## Firebase Configuration

In this project, Firebase is used to manage real-time data, including storing location-based points of interest (POIs) and route requests/responses. Below are the steps to configure Firebase:

### Steps to Set Up Firebase:
1. **Create a Firebase Project:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new Firebase project by following the prompts.

2. **Add a Web App to Firebase:**
   - In the Firebase console, navigate to the "Project Settings" and find the option to add a web app.
   - Once created, Firebase will provide a configuration object. You’ll use this in your frontend to initialize Firebase.

3. **Set Up Firebase Realtime Database:**
   - In the Firebase console, enable the Realtime Database under the "Build" section.
   - Create a new database and select the appropriate location for your data.

4. **Add Firebase SDK to Your Project:**
   - In your frontend code, initialize Firebase using the configuration details provided when you added the web app. This typically includes the API key, project ID, database URL, and other Firebase credentials.
   ```javascript
   // Initialize Firebase
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   firebase.initializeApp(firebaseConfig);
   const db = firebase.database();

5. **Loading Environment Variables:**
 - This project uses a `.env` file to store Firebase credentials
 1. Create a `.env` file in the root directory of your project.
 2. Add the required environment variables in the following format:

  ```bash
  # .env file
  FIREBASE_PRIVATE_KEY=your_firebase_api_key
  FIREBASE_DATABASE_URL=your_firebase_auth_domain
  ```
  


### 6. Structure of Firebase Data

Firebase Realtime Database is central to managing Points of Interest (POIs), route requests, and route responses. Here's how the data is structured:

#### 6.1 **`locations`**:
   - This node stores details of POIs such as restaurants, cafes, hotels, etc.
   - Each POI includes:
     - `name`: Name of the location (e.g., "Restaurant ABC")
     - `category`: Type of location (e.g., "restaurant", "cafe")
     - `x`, `y`: Latitude and longitude
     - `rating`: Randomly generated rating (1-10)
   - Example:
     ```json
     {
       "locations": {
         "poi1": {
           "name": "Restaurant ABC",
           "category": "restaurant",
           "x": 31.771534,
           "y": 35.2223878,
           "rating": 8.7
         }
       }
     }
     ```

#### 6.2 **`routeRequests`**:
   - Stores user-submitted route requests, including:
     - `start`: Coordinates for the start point
     - `end`: Coordinates for the end point
     - `categories`: List of selected POI categories
     - `maxDistanceKm`: Maximum distance for the route
   - Example:
     ```json
     {
       "routeRequests": {
         "request1": {
           "start": { "lat": 31.771534, "lon": 35.2223878 },
           "end": { "lat": 31.7802464, "lon": 35.221699 },
           "categories": ["restaurant", "cafe"],
           "maxDistanceKm": 10
         }
       }
     }
     ```

#### 6.3 **`routeResponses`**:
   - Contains the backend-calculated routes with details of selected POIs:
     - `path`: Array of POIs along the route
     - Each POI includes `name`, `category`, `lat`, `lon`, and `rating`
   - Example:
     ```json
     {
       "routeResponses": {
         "response1": {
           "requestId": "request1",
           "path": [
             { "lat": 31.771534, "lon": 35.2223878, "name": "Restaurant ABC", "category": "restaurant", "rating": 8.7 }
           ]
         }
       }
     }
     ```

### Future Improvements

- **User Authentication**: Allow users to sign in and save their preferred routes or POI settings.
- **Rating System**: Implement a user rating system where users can rate POIs.


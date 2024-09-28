// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtO-KCBS9QK0x3AjafXu1WmwVwJFLXY8o",
  authDomain: "aiprooject.firebaseapp.com",
  databaseURL: "https://aiprooject-default-rtdb.firebaseio.com",
  projectId: "aiprooject",
  storageBucket: "aiprooject.appspot.com",
  messagingSenderId: "9284337655",
  appId: "1:9284337655:web:65dfe56a07a60c2826b8f2",
  measurementId: "G-9N0RT14ZVY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let map;
let startPoint = null;
let endPoint = null;
let currentRequestId = null; // Track the current request ID
let clickEnabled = true; // Flag to enable/disable map clicks
let poiMarkers = []; // Array to store POI markers
let routeMarkers = []; // Array to store route markers
let categoriesSelected = false;  // Track if at least one category is selected
let allPOIs = [];  // To store all POIs locally
let maxDistanceKm = 10

// Function to calculate the haversine distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}


// Function to initialize map centered on Jerusalem
function initMap() {
    // Check if map is already initialized
    if (map !== undefined) {
        map.remove();  // Remove the existing map before re-initializing
    }

    // Initialize the map and set its view to Jerusalem
    map = L.map('map').setView([31.0461, 34.8516], 8); // Centering on Israel

// CartoDB Positron (light-themed)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
}).addTo(map);

// Listen for map clicks to set start and end points
map.on('click', function (e) {
    if (clickEnabled) {
        if (!startPoint) {
            // Set start point
            startPoint = e.latlng;
            startMarker = L.marker(startPoint, { draggable: true }).addTo(map).bindPopup('Start Point').openPopup();
                 // Update start point on marker drag
            startMarker.on('dragend', function (e) {
                startPoint = startMarker.getLatLng();
                updateInterestPointsOnMap(); // Update POIs dynamically after dragging

              });
            routeMarkers.push(startMarker);
        } else if (!endPoint) {
            // Set end point
            endPoint = e.latlng;
            endMarker = L.marker(endPoint, { draggable: true }).addTo(map).bindPopup('End Point').openPopup();

            // Update end point on marker drag
            endMarker.on('dragend', function (e) {
              endPoint = endMarker.getLatLng();
              updateInterestPointsOnMap(); // Update POIs dynamically after dragging
            });

            routeMarkers.push(endMarker);
            checkFormState();
            loadAndDisplayInterestPoints();

            // Now that both points are selected, enable form submission to Firebase
        }
    }
});

// Load and display interest points based on selected categories
loadAndDisplayInterestPoints();
}

// Function to check form state and enable/disable submit button
function checkFormState() {
  const submitButton = document.getElementById('submitRoute');
  // Enable the button only if both start/end points are selected and at least one category is checked
  if (startPoint && endPoint && categoriesSelected) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

// Function to load and display interest points from Firebase
function loadAndDisplayInterestPoints() {
    const checkboxes = document.querySelectorAll('input[name="categories"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function() {
            updateInterestPointsOnMap();
        });
    });

    // Initially load all interest points
    updateInterestPointsOnMap();
}

// Function to darken a given hex color by a certain percentage
function darkenColor(hex, percent) {
    // Convert hex to RGB
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);

    // Darken each channel by the given percentage
    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));

    // Convert back to hex
    r = ("0" + r.toString(16)).slice(-2);
    g = ("0" + g.toString(16)).slice(-2);
    b = ("0" + b.toString(16)).slice(-2);

    // Return the darkened color as a hex string
    return `#${r}${g}${b}`;
}

// Function to generate icon HTML with dynamic shadow
function createIconHtml(iconClass, color) {
    const shadowColor = darkenColor(color, 40);  // Darken by 40%
    return `<i class='${iconClass}' style='color:${color}; font-size:20px; text-shadow: 2px 2px 5px ${shadowColor};'></i>`;
}

// Category icons
const categoryIcons = {
    restaurant: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-utensils', '#FF6F61'),  // Restaurant color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    cafe: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-coffee', '#F4D03F'),  // Cafe color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    hostel: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-bed', '#5DADE2'),  // Hostel color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    museum: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-landmark', '#48C9B0'),  // Museum color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    fuel: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-gas-pump', '#AF7AC5'),  // Fuel color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    hotel: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-hotel', '#58D68D'),  // Hotel color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
     bar: L.divIcon({
        className: 'custom-div-icon',
        html: createIconHtml('fas fa-glass-martini-alt', '#8E44AD'),  // Bar color
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    })
};

// Function to update interest points dynamically based on slider and distance to start/end
function updateInterestPointsOnMap() {
    if (!startPoint || !endPoint || allPOIs.length === 0) return;  // Ensure start and end points are selected and POIs are loaded

    // Remove existing POI markers
    poiMarkers.forEach(marker => map.removeLayer(marker));
    poiMarkers = []; // Clear the array

    // Get selected categories
    const selectedCategories = [];
    const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedCategories.push(checkbox.value);
    });

    // Filter POIs based on selected categories and distance
    allPOIs.forEach(location => {
        const category = location.category;

        // Calculate the distance from both start and end points
        const distanceToStart = haversineDistance(location.x, location.y, startPoint.lat, startPoint.lng);
        const distanceToEnd = haversineDistance(location.x, location.y, endPoint.lat, endPoint.lng);
        const totalDistance = distanceToStart + distanceToEnd;

        // Check if the location falls within the max distance and category is selected
        if (selectedCategories.includes(category) && totalDistance <= maxDistanceKm) {
            const markerIcon = categoryIcons[category] || L.divIcon({
                className: 'custom-div-icon',
                html: "<i class='fas fa-map-marker-alt' style='color:#d3d3d3; font-size:20px;'></i>",
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -40]
            }); // Fallback to default gray icon if no specific icon

            // Display rating if available
            const rating = location.rating ? location.rating.toFixed(2) : "No rating";

            // Create the marker and popup with name, category, and rating
            const marker = L.marker([location.x, location.y], { icon: markerIcon }).addTo(map);
            marker.bindPopup(`<b>${location.name}</b><br>Category: ${category}<br>Rating: ${rating}`);
            poiMarkers.push(marker); // Store marker in the array
        }
    });
}

let submitButton;
let spinner;
// Handle form submission (start and end points are set via clicks)
document.getElementById('routeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!startPoint || !endPoint) {
        alert("Please select both a start and end point by clicking on the map.");
        return;
    }
    document.getElementById('submitRoute').disabled = true; // Enable refresh button

    // Error alert
    document.getElementById('errorAlert').style.display = 'none';

    // Disable the submit button and show loading spinner
    submitButton = document.getElementById('submitRoute');
    spinner = document.querySelector('.loading-spinner');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    spinner.style.display = 'inline-block'; // Show the spinner
    // Disable the category checkboxes
      const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
      categoryCheckboxes.forEach((checkbox) => {
        checkbox.disabled = true;
      });

    const maxDistanceKm = slider.value;  // Get the value from the slider (in kilometers)
    // Generate a unique request ID (UUID)
    currentRequestId = uuid.v4();

    // Collect selected categories
    var categories = [];
    var checkboxes = document.querySelectorAll('input[name="categories"]:checked');
    checkboxes.forEach((checkbox) => {
        categories.push(checkbox.value);
    });

    // Push the start and end coordinates to Firebase with the unique request ID
    db.ref('routeRequests/' + currentRequestId).set({
        start: { lat: startPoint.lat, lon: startPoint.lng },
        end: { lat: endPoint.lat, lon: endPoint.lng },
        categories: categories, // Add the selected categories
        maxDistanceKm: maxDistanceKm,  // Store the maximum distance from the slider

        requestId: currentRequestId // Store the unique request ID
    });

    // Disable further map clicks
    clickEnabled = false;

    // Enable the refresh button
    document.getElementById('refreshMap').disabled = false;

    // Remove all POI markers from the map when submitting the route
    // poiMarkers.forEach(marker => map.removeLayer(marker));
    // poiMarkers = []; // Clear POI markers
});

// Listen for response path from Firebase and update the map
db.ref('routeResponses').on('value', (snapshot) => {
   // Assume the request completes here
    submitButton.classList.remove('loading');
    spinner.style.display = 'none'; // Hide the spinner


    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            // Check if the response matches the current request ID
            if (data[key].requestId === currentRequestId) {
                    if (!data[key].path) {
                    // Display a nice alert if no path is found
                    document.getElementById('errorAlert').style.display = 'block';
                      document.getElementById('submitRoute').disabled = false;


                    return;  // Exit early since there's no path to process
                  }
                const route = data[key].path.map(point => ({ coords: [point.lat, point.lon], name: point.name, category: point.category, rating: point.rating }));
                displayRoute(route);  // Display the route on the map
            }
        });
    }
});



// Define category icons in gray for deselected state
const categoryIconsGray = {
    restaurant: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-utensils' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    cafe: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-coffee' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    hostel: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-bed' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    museum: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-landmark' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    fuel: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-gas-pump' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    hotel: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-hotel' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    parking: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-parking' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),
    bar: L.divIcon({
        className: 'custom-div-icon',
        html: "<i class='fas fa-glass-martini-alt' style='color:#d3d3d3; font-size:15px;'></i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    }),

    // Other categories in gray...
};

function getTextInsideParentheses(str) {
  // Use a regular expression to match "Category: " followed by any characters up to a line break or end of string
    const match = str.match(/Category:\s*([^\s<]*)/);

    // If a match is found, return the captured group (category name)
    return match ? match[1] : null;
}
// Function to display the calculated route and adjust the POI icons
function displayRoute(route) {
    // Step 1: Change all POI markers to their gray version to "deselect" them
    poiMarkers.forEach(marker => {
        const category = getTextInsideParentheses(marker["_popup"]["_content"]);
        const grayIcon = categoryIconsGray[category] || new L.Icon.Default();  // Get the gray version of the icon or default
        marker.setIcon(grayIcon);
    });

    // Step 2: Remove any previous route markers
    routeMarkers.forEach(marker => map.removeLayer(marker));
    routeMarkers = []; // Clear route markers array

    // Initialize a new routing control without default markers and instructions
    var control = L.Routing.control({
        waypoints: route.map(point => L.latLng(point.coords[0], point.coords[1])),
        routeWhileDragging: true,
        createMarker: function() { return null; },  // Disable default blue markers
        lineOptions: {
            styles: [{ color: '#3388ff', opacity: 0.8, weight: 3 }]  // Customize route line
        },
        addWaypoints: false,  // Disable waypoint dragging
        show: false  // Disable route instructions
    }).addTo(map);

    // Step 3: Add markers for each point in the route and set the category-specific (colored) icons
    route.forEach((point) => {
        // Use the category-specific colored icon or default Leaflet marker
        const markerIcon = categoryIcons[point.category] || new L.Icon.Default(); // Properly instantiate default icon

        // Prepare the popup content with name, category, and rating
        const rating = point.rating ? point.rating.toFixed(2) : "No rating";
        const popupContent = `<b>${point.name}</b><br>Category: ${point.category}<br>Rating: ${rating}`;

        // Create the marker with the icon and add to the map
        const marker = L.marker(point.coords, { icon: markerIcon }).addTo(map);
        marker.bindPopup(popupContent).openPopup(); // Bind the popup with the name, category, and rating
        routeMarkers.push(marker); // Add to route markers array
    });

  control.on('routesfound', function (e) {
    var summary = e.routes[0].summary;
    var distance = (summary.totalDistance / 1000).toFixed(2);

    // Convert time from seconds to hours and minutes
    var totalTimeInSeconds = summary.totalTime;
    var hours = Math.floor(totalTimeInSeconds / 3600);  // Extract hours
    var minutes = Math.floor((totalTimeInSeconds % 3600) / 60);  // Extract remaining minutes

        // Display the result in one line
    document.getElementById('distance').innerHTML =
        `<p class="lead mb-0"><strong>Distance:</strong> ${distance} km | <strong>Time:</strong> ${hours} hrs ${minutes} mins</p>`;
});
}

// Refresh button to reset the map and re-enable clicking
document.getElementById('refreshMap').addEventListener('click', function () {
    startPoint = null;
    endPoint = null;
    clickEnabled = true; // Enable map clicks again
    document.getElementById('submitRoute').disabled = true; // Disable the submit button again
    document.getElementById('refreshMap').disabled = true; // Disable the refresh button
    document.getElementById('errorAlert').style.display = 'none';
  // Enable the category checkboxes
      const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
      categoryCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
      });
    initMap(); // Re-initialize the map for fresh input
});

// Function to handle category selection and enable/disable submit button
function handleCategorySelection() {
  const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      categoriesSelected = Array.from(categoryCheckboxes).some(checkbox => checkbox.checked);
      checkFormState();  // Recheck if the form is ready for submission
    });
  });
}

// Function to retrieve and store POIs locally
function retrievePOIs() {
    db.ref('locations').once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            allPOIs = Object.keys(data).map(key => data[key]);  // Store all POIs locally
        }
    });
}

// Handle distance slider updates and dynamically filter points
const slider = document.getElementById('distanceSlider');
const sliderValue = document.getElementById('sliderValue');
slider.addEventListener('input', function () {
    sliderValue.textContent = slider.value;  // Update displayed slider value
    maxDistanceKm = slider.value;  // Update the maximum distance
    updateInterestPointsOnMap();  // Update POIs dynamically based on slider
});


retrievePOIs();
// Initialize the category selection handler
handleCategorySelection();
// Initialize map for selecting start and end points
initMap();

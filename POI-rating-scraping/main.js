const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get Firebase private key and database URL from environment variables
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

// Parse the private key from a string to an object
const firebasePrivateKeyParsed = JSON.parse(firebasePrivateKey);

// Initialize the Firebase Admin SDK with the credentials and database URL
admin.initializeApp({
  credential: admin.credential.cert(firebasePrivateKeyParsed),
  databaseURL: databaseURL
});

console.log("Firebase Admin SDK initialized successfully.");

// Define the path to the JSON file
const jsonFilePath = path.join(__dirname, 'json', 'export (4).geojson');

// Function to read the JSON file
function readJSONFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        callback(JSON.parse(data));
    });
}

// Function to process each feature in the GeoJSON data
function processFeature(feature) {
    const prop = feature.properties;
    let category = "unknown"
    if ("tourism" in prop) {
        category = prop["tourism"]
    }
    else if ("amenity" in prop) {
        category = prop["amenity"]
    }
    else {
        category = "other"
    }
    let name = "";

    if ("name:en" in prop) {
        name = prop["name:en"];
    } else if ("name" in prop) {
        name = prop.name;
    }

    const coordinates = feature.geometry.coordinates;
    const x = coordinates[1];
    const y = coordinates[0];

    return { name, category, x, y };
}

// Function to write data to Firebase Realtime Database
function writeToFirebase(data) {
    const newRef = database.ref('locations').push();
    newRef.set(data, (err) => {
        if (err) {
            console.error('Error writing to Firebase:', err);
        } else {
            console.log('Data successfully written to Firebase:', data);
        }
    });
}

// Main function to handle the entire flow
function main() {
    readJSONFile(jsonFilePath, (jsonData) => {
        jsonData.features.forEach((feature) => {
            const processedData = processFeature(feature);
            if (processedData.name && processedData.category) {
                console.log(`${processedData.name}, ${processedData.category}, ${processedData.x}, ${processedData.y}`);

                // Write each processed feature to Firebase
                writeToFirebase(processedData);
            }
        });
    });
}

// Run the main function
main();
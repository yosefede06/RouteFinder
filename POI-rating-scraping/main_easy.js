// Import required modules
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

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
    let category = "unknown";
    if ("tourism" in prop) {
        category = prop["tourism"];
    } else if ("amenity" in prop) {
        category = prop["amenity"];
    } else {
        category = "other";
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

// Function to fetch additional data from the external API
async function fetchAdditionalData(name, lat, lng) {
    try {
        const response = await axios.get('https://easy.co.il/n/jsons/bizlist', {
            params: {
                'version': '2.3',
                'q': name,
                'client': 'web',
                'listpage': '1',
                'lat': lat,
                'lng': lng,
                'rad': '1',
                'mapid': '0',
                'viewport': 'mobile',
                'lang': 'en',
                'uid': 'CCEA6DAC-3FC7-4712-B3E5-825095EE8EC1',
                'referrerUrl': 'https%3A%2F%2Feasy.co.il%2Fen%2Fpage%2F25037403'
            },
            headers: {
                'sec-ch-ua-platform': '"macOS"',
                'Referer': 'https://easy.co.il/en/list/Paz',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'sec-ch-ua-mobile': '?0'
            }
        });

        // Return the relevant data from the response
        if (response.data && response.data.bizlist && response.data.bizlist.list) {
            return response.data.bizlist.list[0];
        }
    } catch (error) {
        console.error('Error fetching additional data:', error);
    }
    return null;
}

// Function to write data to Firebase Realtime Database, checking for duplicates
async function writeToFirebase(data, additionalData) {
    const locationsRef = admin.database().ref('locations');
    const locationKey = `${data.name}_${data.x}_${data.y}`.replace(/\./g, '_'); // Unique key based on name and coordinates

    const snapshot = await locationsRef.orderByChild('locationKey').equalTo(locationKey).once('value');

    if (snapshot.exists()) {
        // If location exists, update the existing entry
        const key = Object.keys(snapshot.val())[0];
        await locationsRef.child(key).update({ ...data, easy: additionalData });
        console.log('Data updated in Firebase:', data);
    } else {
        // If location does not exist, push new entry
        const newRef = locationsRef.push();
        await newRef.set({ ...data, easy: additionalData, locationKey });
        console.log('Data successfully written to Firebase:', data);
    }
}

// Main function to handle the entire flow
async function main() {
    readJSONFile(jsonFilePath, async (jsonData) => {
        for (const feature of jsonData.features.slice(0,2)) {
            const processedData = processFeature(feature);
            if (processedData.name && processedData.category) {
                console.log(`${processedData.name}, ${processedData.category}, ${processedData.x}, ${processedData.y}`);

                // Fetch additional data from external API
                const additionalData = await fetchAdditionalData(processedData.name, processedData.x, processedData.y);

                // Write both main data and additional data to Firebase
                await writeToFirebase(processedData, additionalData);
            }
        }
    });
}

// Run the main function
main();
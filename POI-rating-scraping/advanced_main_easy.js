const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');

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

// Function to fetch Google Maps ID
async function fetchGoogleMapsId(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const scriptTags = $('script').toArray();
        let googleMapsId = null;

        scriptTags.some(script => {
            const scriptContent = $(script).html();
            if (scriptContent && scriptContent.includes('googlemapsid')) {
                const match = scriptContent.match(/googlemapsid:\s*["'](\d+)["']/);
                if (match && match[1]) {
                    googleMapsId = match[1];
                    return true; // Stop iteration once found
                }
            }
            return false;
        });

        return googleMapsId;
    } catch (error) {
        console.error('Error fetching Google Maps ID:', error);
    }
    return null;
}

// Function to fetch images based on Google Maps ID
async function fetchImages(googleMapsId) {
    try {
        const response = await axios.get('https://easy.co.il/n/getSocialPhotos', {
            params: { 'googlemaps': googleMapsId },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en,es-ES;q=0.9,es;q=0.8',
                'referer': 'https://easy.co.il/page/8819375',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
            }
        });

        // Extract image URLs from response data
        if (response.data && response.data.media && response.data.media.images && response.data.media.images[0]) {
            return response.data.media.images[0].items.map(item => item.source);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
    return [];
}
// Function to filter out undefined values from an object
function removeUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, removeUndefined(value)])
    );
  }
  return obj;
}

async function fetchOperatingHours(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const openHoursContent = $('#openHoursContent ul li');
        const operatingHours = [];

        openHoursContent.each((index, element) => {
            const day = $(element).find('.day').text().trim();
            const hours = $(element).find('.hours-times span').text().trim();
            operatingHours.push({ day, hours });
        });

        return operatingHours;
    } catch (error) {
        console.error('Error fetching operating hours:', error);
        return null;
    }
}

// Function to write data to Firebase Realtime Database, including images
async function writeToFirebase(data, additionalData, images, operatingHours) {
    const locationsRef = admin.database().ref('locations');

    const locationKey = `${data.name}_${data.x}_${data.y}`.replace(/\./g, '_'); // Unique key based on name and coordinates

    const snapshot = await locationsRef.orderByChild('locationKey').equalTo(locationKey).once('value');
        console.log(additionalData)
    let dataToSave = { ...data, easy: additionalData ? { // Save the additional data as a nested "easy" object
            id: additionalData.id,
            name: additionalData.bizname,
            logo: additionalData.logo,
            address: additionalData.address,
            city: additionalData.city,
            category: additionalData.category,
            phone: additionalData.phone,
            numofreviews: additionalData.numofreviews,
            gallery: additionalData.gallery ? additionalData.gallery.map((item) => item.pic) : images,
            rating: additionalData.easyrating,
            operatingHours: operatingHours // Add operating hours here


        } : null, locationKey };

    dataToSave = removeUndefined(dataToSave)
    if (snapshot.exists()) {
        // If location exists, update the existing entry
        const key = Object.keys(snapshot.val())[0];
        await locationsRef.child(key).update(dataToSave);
        console.log('Data updated in Firebase:', data);
    } else {
        // If location does not exist, push new entry
        const newRef = locationsRef.push();
        await newRef.set(dataToSave);
        console.log('Data successfully written to Firebase:', data);
    }
}
async function fetchAdditionalData(name, lat, lng) {
    try {
        const response = await axios.get('https://easy.co.il/n/jsons/bizlist', {
            params: {
                'version': '2.3',
                'q': name,
                'order': 1,
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
            if (response.data.bizlist.list[0].distance && response.data.bizlist.list[0].distance.includes(" m")) {
                return response.data.bizlist.list[0];
            }
            return null
        }
    } catch (error) {
        console.error('Error fetching additional data:', error);
    }
    return null;
}
// Main function to handle the entire flow
async function main() {
    let count = 0
    readJSONFile(jsonFilePath, async (jsonData) => {
        for (const feature of jsonData.features.slice(800,1000)) {
            console.log(904 + count)
            count += 1
            const processedData = processFeature(feature);
            if (processedData.name && processedData.category) {
                console.log(`${processedData.name}, ${processedData.category}, ${processedData.x}, ${processedData.y}`);

                const additionalData = await fetchAdditionalData(processedData.name, processedData.x, processedData.y);
                let googleMapsId = null;
                let operatingHours = null;

                if (additionalData) {
                    const url = `https://easy.co.il/en/page/${additionalData.id}`;
                    googleMapsId = await fetchGoogleMapsId(url);
                    operatingHours = await fetchOperatingHours(url); // Fetch operating hours
                }

                let images = [];
                if (googleMapsId) {
                    images = await fetchImages(googleMapsId); // Fetch images if Google Maps ID is available
                }

                // Write data, including operating hours, to Firebase
                await writeToFirebase(processedData, additionalData, images, operatingHours);
            }
        }
    });
}

// Run the main function
main();
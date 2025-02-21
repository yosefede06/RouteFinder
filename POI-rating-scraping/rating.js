const admin = require('firebase-admin');
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
  databaseURL: databaseURL,
});

console.log('Firebase Admin SDK initialized successfully.');

// Function to calculate the final rating
function calculateFinalRating(rating, numofreviews, baseline = 5.0, minReviews = 100) {
  // If no reviews or rating is zero, return 0
  if (!rating || rating === 0 || !numofreviews) {
    return 0;
  }

  // Weighted average formula
  const finalRating =
    (rating * numofreviews + baseline * minReviews) /
    (numofreviews + minReviews);

  // Return rounded result
  return parseFloat(finalRating.toFixed(2));
}

// Function to update ratings in Firebase
async function updateRatingsInFirebase() {
  const locationsRef = admin.database().ref('locations');

  try {
    const snapshot = await locationsRef.once('value');
    const updates = {};

    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const data = childSnapshot.val();

      // Extract rating and numofreviews from the "easy" object
      const easyData = data.easy || {};
      const rating = easyData.rating || 0;
      const numofreviews = easyData.numofreviews || 0;

      // Calculate the final rating
      const finalRating = calculateFinalRating(rating, numofreviews);

      // Add the calculated rating to the updates object
      updates[`${key}/rating`] = finalRating;
    });

    // Perform a bulk update to the Firebase database
    await locationsRef.update(updates);
    console.log('Ratings updated successfully in Firebase.');
  } catch (error) {
    console.error('Error updating ratings in Firebase:', error);
  }
}

// Run the function to update ratings
updateRatingsInFirebase();

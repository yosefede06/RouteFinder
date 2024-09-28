import firebase_admin
from firebase_admin import credentials, db
import random
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get Firebase private key and database URL from the environment variables
firebase_private_key_json = os.getenv('FIREBASE_PRIVATE_KEY')
database_url = os.getenv('FIREBASE_DATABASE_URL')

# Parse the private key JSON string into a Python dictionary
firebase_private_key = json.loads(firebase_private_key_json)
# Path to your Firebase Admin SDK credentials (downloaded JSON file)
cred = credentials.Certificate(firebase_private_key)
# Initialize the Firebase Admin SDK
firebase_admin.initialize_app(cred, {
    'databaseURL': database_url  # Replace with your actual database URL
})

# Reference to the 'locations' node in the Realtime Database
locations_ref = db.reference('locations')


# Function to update all fields at once, including the new random float rating
def update_all_at_once():
    # Retrieve all locations
    locations = locations_ref.get()

    if locations:
        updates = {}
        for key, location in locations.items():
            # Generate a random float rating between 1 and 10
            random_rating = round(random.uniform(1, 10), 2)  # 2 decimal precision

            # Include the existing location data and add/update the rating
            location['rating'] = random_rating
            updates[key] = location  # Add the updated location to the batch

        # Perform the batch update for all locations at once
        locations_ref.set(updates)
        print('All locations updated successfully with float ratings.')
    else:
        print('No locations found in the database.')


# Run the update function
update_all_at_once()

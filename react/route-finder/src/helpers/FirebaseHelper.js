// firebaseHelper.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyCtO-KCBS9QK0x3AjafXu1WmwVwJFLXY8o",
  authDomain: "aiprooject.firebaseapp.com",
  databaseURL: "https://aiprooject-default-rtdb.firebaseio.com",
  projectId: "aiprooject",
  storageBucket: "aiprooject.appspot.com",
  messagingSenderId: "9284337655",
  appId: "1:9284337655:web:65dfe56a07a60c2826b8f2",
  measurementId: "G-9N0RT14ZVY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to submit a new route request to Firebase
export const submitRouteRequest = async (
  startPoint,
  endPoint,
  categories,
  maxDistanceKm
) => {
  const requestId = uuidv4();
  const routeRequestRef = ref(db, `routeRequests/${requestId}`);
  const routeData = {
    start: { lat: startPoint.lat, lon: startPoint.lng },
    end: { lat: endPoint.lat, lon: endPoint.lng },
    categories: categories,
    maxDistanceKm: maxDistanceKm,
    requestId: requestId,
  };
  await set(routeRequestRef, routeData);
  console.log(requestId)
  return requestId;
};

// Function to listen for route response from Firebase
export const listenForRouteResponse = (requestId, callback) => {
  const routeResponseRef = ref(db, `routeResponses/${requestId}`);
  onValue(routeResponseRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.requestId === requestId) {
      callback(data.path);
    }
  });
};

// Function to fetch all POIs from Firebase
export const fetchAllPOIs = async () => {
  const poiRef = ref(db, "locations");
  const snapshot = await get(poiRef);
  const data = snapshot.val();
  return data ? Object.values(data) : [];
};

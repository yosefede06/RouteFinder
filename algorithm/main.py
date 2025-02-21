from dotenv import load_dotenv
from Components.Graph import Graph
from Solvers.Solutions.Solution1 import LocalBeamSearch
import firebase_admin
from firebase_admin import credentials, db
import math
import time
import os
import json


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


def haversine_distance(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    # Haversine formula to calculate the distance
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Radius of the Earth in kilometers
    r = 6371
    distance = r * c

    return distance


def get_coordinates(start_lat=40.4168, start_lon=-3.7038, end_lat=41.3851, end_lon=2.1734):
    try:
        # Calculate the distance between the two points using the Haversine formula
        distance_km = haversine_distance(start_lat, start_lon, end_lat, end_lon)
        # print(f"Calculated Distance: {distance_km:.2f} km")
        return distance_km
    except Exception as e:
        print(f"Error calculating distance: {e}")
        return None


# Function to read and parse data from Firebase
def read_and_parse_from_firebase():
    try:
        # Reference the 'locations' node in your Realtime Database
        ref = db.reference('locations')

        # Get the data from the reference
        data = ref.get()

        nodes = []
        if data:
            # Loop through each entry and parse fields
            for key, value in data.items():
                name = value.get('name', 'Unknown')
                category = value.get('category', 'Unknown')
                rating = value.get('rating', 0)
                x = value.get('x', 0)  # Latitude
                y = value.get('y', 0)  # Longitude

                # Add node information (name, coordinates)
                nodes.append({
                    "id": key,  # Using the Firebase key as node ID
                    "name": name,
                    "category": category,
                    "rating": rating,
                    "x": x,
                    "y": y
                })
        return nodes
    except Exception as e:
        print(f"Error reading from Firebase: {e}")
        return []


# Function to create graph based on parsed nodes, categories, and distance constraints
def create_graph_from_nodes(nodes, categories, maxDistanceKm, start_coords, end_coords):
    graph = Graph()
    # Add nodes to the graph that are within the max distance from start or end
    for i, node in enumerate(nodes):
        if node["category"] in categories:
            # Calculate distances from start and end coordinates
            distance_to_start = get_coordinates(node['x'], node['y'], start_coords['lat'], start_coords['lon'])
            distance_to_end = get_coordinates(node['x'], node['y'], end_coords['lat'], end_coords['lon'])
            # Only add node to graph if it's within the max distance from start or end
            if distance_to_start + distance_to_end <= maxDistanceKm:
                graph.add_node(i + 1, node['x'], node['y'], {"name": node["name"], "category": node["category"],
                                                             "rating": node["rating"]})
    # Add edges between nodes that are already added to the graph
    for i, node1 in enumerate(nodes):
        for j, node2 in enumerate(nodes):
            if i != j:
                # Check if both nodes are within the categories and part of the graph
                if graph.has_node(i + 1) and graph.has_node(j + 1):
                    # Calculate distance between node1 and node2
                    distance = get_coordinates(node1['x'], node1['y'], node2['x'], node2['y'])
                    graph.add_edge(i + 1, j + 1, distance, node2["rating"], node2["category"])  # Adding distance as weight
    return graph


def add_edges(graph, nodes, start_coords, end_coords, categories):
    graph.add_node("start", start_coords['lat'], start_coords['lon'], {"name": "Start Point", "category": "NO", "rating": 0})
    for i, node in enumerate(nodes):
        if node["category"] in categories and graph.has_node(i + 1):
            distance = get_coordinates(start_coords['lat'], start_coords['lon'], node['x'], node['y'])
            graph.add_edge("start", i + 1, distance, node["rating"], node["category"])  # Outgoing edges from "start"

    # Add "end" node and connect it to all other nodes
    graph.add_node("end", end_coords['lat'], end_coords['lon'], {"name": "End Point", "category": "NO", "rating": 0})
    for i, node in enumerate(nodes):
        if graph.has_node(i + 1):
            distance = get_coordinates(node['x'], node['y'], end_coords['lat'], end_coords['lon'])
            graph.add_edge(i + 1, "end", distance, 0, None)  # Incoming edges to "end" with None as category


# Function to calculate path
def calculate_best_path(graph, nodes, start, end, categories, maxDistanceKm):
    add_edges(graph, nodes, start, end, categories)
    path_finder_local_beam = LocalBeamSearch(graph, max_distance=maxDistanceKm, max_path=len(categories) + 2)
    # Here, we assume start_id=1 and end_id=2. You can change these based on your nodes.
    best_path, type_list, best_score, expanded_paths = path_finder_local_beam.find_best_path(start_id="start",
                                                                                             end_id="end")
    coordinates_best = []
    for node_id in best_path:
        node = graph.nodes[node_id]
        coordinates_best.append({"lat": node.x, "lon": node.y, "name": node.extra['name'], "category": node.extra['category'], "rating": node.extra['rating']})
    return coordinates_best


# Function to listen for route requests and respond
def listen_for_route_requests(nodes):
    ref = db.reference('routeRequests')
    while True:
        data = ref.get()
        if data:
            for key, request in data.items():
                start = request.get('start')
                end = request.get('end')
                categories = request.get('categories')
                request_id = request.get('requestId')  # Get the requestId to include in the response
                maxDistanceKm = float(request.get('maxDistanceKm'))
                if start and end and categories and request_id:
                    print(
                        f"Processing route request {key}: Start: {start}, End: {end}, Categories: {categories}, Request ID: {request_id}, maxDistanceKm: {maxDistanceKm}")

                    # Calculate the best path (assuming your existing path calculation function)
                    graph = create_graph_from_nodes(nodes, categories, maxDistanceKm, start, end)
                    best_path = calculate_best_path(graph, nodes, start, end, categories, maxDistanceKm)

                    # Create the response structure with requestId
                    response_data = {
                        "path": best_path,  # Assuming best_path contains the list of points with lat, lon, and name
                        "requestId": request_id
                    }

                    # Write the response path to Firebase under routeResponses with the same key
                    db.reference(f'routeResponses/{key}').set(response_data)
                    print(f"Path for request {key} sent to Firebase: {response_data}")

                    # Delete the processed request
                    db.reference(f'routeRequests/{key}').delete()

        time.sleep(5)


# Main function to handle the flow
def main():
    # Step 1: Read and parse data from Firebase
    nodes = read_and_parse_from_firebase()
    if not nodes:
        print("No nodes found, exiting.")
        return
    nodes = nodes
    # Step 2: Create graph from parsed nodes

    listen_for_route_requests(nodes)


main()
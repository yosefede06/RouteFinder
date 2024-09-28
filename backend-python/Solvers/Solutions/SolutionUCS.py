import heapq
from Solvers.PathFinderBase import PathFinderBase

class SolutionUCS(PathFinderBase):
    def __init__(self, graph, max_distance, max_path):
        super().__init__(graph, max_distance, max_path)
        self.best_score = -float('inf')  # To track the best score found
        self.best_path = []  # best path with the best score
        self.expanded_nodes = 0  # To track the number of expanded nodes

    def find_best_path(self, start_id, end_id):
        pq = []
        heapq.heappush(pq, (0, start_id, 0, 0, []))

        while pq:
            neg_score, current_node, current_distance, total_score, path = heapq.heappop(pq)
            current_score = -neg_score
            print(f"Expanding node {current_node} with score: {current_score}, total distance: {current_distance}, path: {path}")
            self.expanded_nodes += 1
            path = path + [current_node]
            if current_node == end_id:
                print(f"UCS Number of expanded nodes: {self.expanded_nodes}")
                return path

            for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
                new_distance = current_distance + edge.get_distance()
                new_score = total_score + edge.get_score()
                if new_distance > self.max_distance or len(path) >= self.max_path:
                    print(f"Pruned path to node {neighbor_id} due to exceeding max limits. Distance: {new_distance}, Path length: {len(path)}")
                    continue
                print(f"Adding node {neighbor_id} to queue with new score: {new_score}, new distance: {new_distance}, path: {path}")
                heapq.heappush(pq, (-new_score, neighbor_id, new_distance, new_score, path))

        print(f"UCS Number of expanded nodes: {self.expanded_nodes}")
        return self.best_path

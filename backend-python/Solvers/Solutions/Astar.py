import heapq
from Solvers.PathFinderBase import PathFinderBase

class Astar(PathFinderBase):
    def __init__(self, graph, max_distance, max_path):
        super().__init__(graph, max_distance, max_path)
        self.expanded_nodes = 0

    def heuristic(self, parent, neighbor):

        max_potential_score = 0
        for neighbor_id, edge in self.graph.edges.get(neighbor,
                                                      {}).items():
            max_potential_score = max(max_potential_score, edge.get_score())
        return max_potential_score + self.graph.edges.get(parent)[
            neighbor].get_score()

    def find_best_path(self, start_id, end_id):
        pq = []
        heapq.heappush(pq, (-0, start_id, 0, 0, []))
        self.expanded_nodes = 0

        best_score = -float('inf')
        best_path = []

        while pq:
            neg_f, current_node, current_distance, current_score, path = heapq.heappop(pq)
            current_score = -neg_f
            self.expanded_nodes += 1
            path = path + [current_node]
            if current_node == end_id and self.max_path == len(path):
                if current_score > best_score:
                    best_score = current_score
                    best_path = path
                print(f"A* Number of expanded nodes: {self.expanded_nodes}, Best Score: {best_score}")
                return best_path

            for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
                new_distance = current_distance + edge.get_distance()
                new_score = current_score + edge.get_score()

                if new_distance > self.max_distance or len(path) >= self.max_path:
                    continue

                h = self.heuristic(current_node,neighbor_id)
                f_new = -(new_score + h)  # Use negated f(n) for max-heap behavior
                heapq.heappush(pq, (f_new, neighbor_id, new_distance, new_score, path))

        print(f"A* Number of expanded nodes: {self.expanded_nodes}")
        return best_path  # In case no path is found

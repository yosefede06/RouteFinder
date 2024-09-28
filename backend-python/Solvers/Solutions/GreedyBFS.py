import heapq


class SolutionGreedyBFS:
    def __init__(self, graph, max_distance, max_path):
        self.graph = graph
        self.max_distance = max_distance
        self.max_path = max_path
        self.expanded_nodes = 0  # Track the number of expanded nodes

    def heuristic(self, node, end_node):
        """
        Heuristic for greedy best-first search: Estimate the maximum possible score
        by always selecting the highest score edge.
        """
        current_node = node
        remaining_score = 0

        # Traverse from current_node to end_node, always choosing the highest score edge
        while current_node != end_node:
            if current_node not in self.graph.edges:
                break  # No more edges, stop the estimate

            # Find the neighbor with the maximum score edge
            best_edge = max(self.graph.edges[current_node].values(), key=lambda edge: edge.get_score())
            remaining_score += best_edge.get_score()

            # Move to the neighbor with the highest score
            current_node = best_edge.to_node

        return remaining_score  # Estimated remaining score to the goal

    def find_best_path(self, start_id, end_id):
        pq = []
        # Priority queue stores (heuristic score, node, distance, score, path)
        heapq.heappush(pq, (0, start_id, 0, 0, []))  # Start with score 0 and distance 0
        self.expanded_nodes = 0  # Reset expanded node counter

        best_score = -float('inf')
        best_path = []

        while pq:
            h, current_node, current_distance, current_score, path = heapq.heappop(pq)
            path = path + [current_node]

            # Increment the expanded node count
            self.expanded_nodes += 1

            # If we reached the goal, return the path and score
            if current_node == end_id:
                return best_path, current_score, self.expanded_nodes

            # Explore neighbors, always trying to maximize the score
            for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
                new_distance = current_distance + edge.get_distance()
                new_score = current_score + edge.get_score()

                # Prune paths that exceed max distance
                if new_distance > self.max_distance:
                    continue

                # Push to the priority queue based on the heuristic (maximize score)
                h = -self.heuristic(neighbor_id, end_id)
                heapq.heappush(pq, (h, neighbor_id, new_distance, new_score, path))
        print(self.expanded_nodes)
        return best_path  # In case no path is found

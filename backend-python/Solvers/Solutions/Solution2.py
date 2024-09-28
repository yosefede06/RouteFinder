class BacktrackingCSP:
    def __init__(self, graph, max_distance, max_path):
        self.graph = graph
        self.max_distance = max_distance
        self.max_path = max_path
        self.best_score = -float('inf')
        self.best_path = []
        self.paths_explored = 0
        self.type_list = []

    def is_consistent(self, path, new_node, current_distance, current_types):
        """Check if adding the new node is consistent with the constraints."""
        # Prevent adding the same node twice in the path
        if new_node in path:
            return False

        # Path length constraint
        if len(path) + 1 > self.max_path:
            return False

        # Distance constraint
        if current_distance > self.max_distance:
            return False

        # Prevent adding nodes of the same type to the path
        node_type = self.graph.get_edge(path[-1], new_node).get_type()
        if node_type in current_types:
            return False

        return True

    def backtrack(self, current_node, path, current_score, current_distance,
                  current_types,goal_node):
        """Recursive backtracking algorithm."""
        path.append(current_node)
        self.paths_explored += 1
        if len(path) == self.max_path and current_node == goal_node:
            if current_score > self.best_score:
                self.best_score = current_score
                self.best_path = path.copy()
                self.type_list = current_types
            path.pop()
            return

        # Explore neighbors
        for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
            new_distance = current_distance + edge.get_distance()
            new_score = current_score + edge.get_score()

            new_types = current_types.copy()
            new_types.add(edge.get_type())

            if self.is_consistent(path, neighbor_id, new_distance, new_types):
                self.backtrack(neighbor_id, path, new_score, new_distance,
                               new_types,goal_node)

        path.pop()


    def find_best_path(self, start_id, end_id):
        self.backtrack(start_id, [], 0, 0, set(),end_id)
        return self.best_path,self.type_list,self.best_score,\
               self.paths_explored



class LookaheadCSP(BacktrackingCSP):
    def __init__(self, graph, max_distance, max_path):
        super().__init__(graph, max_distance, max_path)
        self.domains = {node: list(self.graph.edges.get(node, {}).keys()) for node in self.graph.edges}

    def heuristic(self, current_node, remaining_path_length):
        """Heuristic that estimates the maximum potential score while penalizing long paths."""
        max_potential_score = 0

        for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
            max_potential_score = max(max_potential_score, edge.get_score())
        penalty = 0
        if remaining_path_length > 1:
            penalty = (remaining_path_length - 1) * 50
        return max_potential_score * remaining_path_length - penalty

    def forward_check(self, current_node, current_distance, path,
                      current_types,goal_node):
        """Perform forward checking to ensure that future variables have valid domains and distance."""
        if current_node == goal_node:
            return True

        remaining_path_length = self.max_path - len(path)
        remaining_distance = self.max_distance - current_distance
        if current_node not in self.domains:
            return False
        for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
            neighbor_type = edge.get_type()

            if neighbor_id not in path and neighbor_type not in current_types:
                if remaining_path_length > 1 and edge.get_distance() <= remaining_distance:
                    return True
        return False

    def backtrack(self, current_node, path, current_score, current_distance,
                  current_types,goal_node):
        """Recursive backtracking algorithm with forward checking and aggressive pruning."""
        path.append(current_node)
        self.paths_explored += 1
        remaining_path_length = self.max_path - len(path)
        max_possible_score = current_score + self.heuristic(current_node, remaining_path_length)

        tolerance = 0.75  # closer to zero => more paths that it checks and more optimal
        if max_possible_score < self.best_score * tolerance:
            path.pop()
            return
        if len(path) == self.max_path and current_node == goal_node:
            if current_score > self.best_score:
                self.best_score = current_score
                self.best_path = path.copy()
                self.type_list = current_types
            path.pop()
            return
        for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
            new_distance = current_distance + edge.get_distance()
            new_score = current_score + edge.get_score()
            if self.is_consistent(path, neighbor_id, new_distance,
                                  current_types) and self.forward_check(neighbor_id, new_distance, path, current_types,goal_node):
                self.backtrack(neighbor_id, path, new_score, new_distance,
                               current_types | {edge.get_type()},goal_node)

        path.pop()

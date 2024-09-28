from Solvers.PathFinderBase import PathFinderBase

class DFS(PathFinderBase):
    def __init__(self, graph, max_distance, max_path):
        super().__init__(graph, max_distance, max_path)
        self.best_score = -float('inf')  # To track the best score found
        self.best_path = []  # To track the path with the best score
        self.expanded_paths = 0
        self.type_list = []

    def find_best_path(self, start_id, end_id):
        current_path = []
        self._dfs(start_id, end_id, current_path, 0, 0,set())
        return self.best_path,self.type_list,self.best_score,self.expanded_paths

    def _dfs(self, current_node, end_id, current_path, current_distance,
             current_score,current_types):
        current_path.append(current_node)
        if current_node == end_id:
            if current_score > self.best_score:
                self.best_score = current_score
                self.best_path = current_path.copy()
                self.type_list = current_types
            current_path.pop()
            return
        self.expanded_paths += 1
        for neighbor_id, edge in self.graph.edges.get(current_node, {}).items():
            new_distance = current_distance + edge.get_distance()
            new_score = current_score + edge.get_score()
            neighbor_type = edge.get_type()

            if neighbor_type in current_types:
                continue
            if new_distance > self.max_distance or len(current_path) >= self.max_path:
                continue
            self._dfs(neighbor_id, end_id, current_path, new_distance, new_score, current_types | {neighbor_type})

        current_path.pop()

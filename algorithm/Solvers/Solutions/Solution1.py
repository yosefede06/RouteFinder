import heapq


class LocalBeamSearch:
    def __init__(self, graph, max_distance, max_path):
        self.graph = graph
        self.max_distance = max_distance
        self.max_path = max_path
        self.K = self.set_initial_beam_width(len(self.graph.edges))  # Use the number of nodes in the graph

        self.expanded_nodes = 0
        self.best_score = 0  # To track the best score found
        self.expanded_paths = 0
        self.best_path = []  # Counter to track the number of explored paths
        self.type_list = []
        self.path_distance = 0

    def set_initial_beam_width(self, num_nodes):
        """
        Set the initial beam width (K) based on the number of nodes in the graph.
        Larger graphs get a wider beam to explore more paths initially.
        """
        if num_nodes <= 100:
            return 5
        elif num_nodes <= 500:
            return 50
        elif num_nodes <= 1000:
            return 80
        elif num_nodes <= 1500:
            return 100
        else:
            return 150

    def find_best_path(self, start_id, end_id):
        retry_limit = 8
        retries = 0

        while retries < retry_limit:
            pq = []
            heapq.heappush(pq, (-0, start_id, 0, 0, [],
                                set()))
            self.expanded_nodes = 0

            paths = [(0, [start_id], 0,set())]

            while paths:
                new_paths = []
                for current_score, path, current_distance, current_types in paths:
                    current_node = path[-1]
                    if current_node == end_id and len(path) == self.max_path:
                        if -(current_score) > self.best_score:
                            self.best_path = path
                            self.best_score = -(current_score)
                            self.type_list = current_types.copy()
                            self.path_distance = current_distance
                        elif -(
                        current_score) == self.best_score and current_distance < self.path_distance:
                            self.best_path = path
                            self.best_score = -(current_score)
                            self.type_list = current_types.copy()
                            self.path_distance = current_distance
                        continue

                    self.expanded_paths += 1

                    # Explore neighbors
                    for neighbor_id, edge in self.graph.edges.get(current_node,
                                                                  {}).items():
                        new_distance = current_distance + edge.get_distance()
                        new_score = abs(current_score) + edge.get_score()
                        neighbor_type = edge.get_type()

                        # Ensure we don't revisit nodes with the same type
                        if neighbor_type in current_types:
                            continue

                        # Prune paths that exceed the maximum allowed distance or path length
                        if new_distance > self.max_distance or len(
                                path) >= self.max_path:
                            continue
                        if neighbor_id in path:
                            continue

                        f_new = -(
                            new_score)  # Use negated f(n) for max-heap behavior

                        new_types = current_types.copy()
                        new_types.add(neighbor_type)
                        new_paths.append((f_new, path + [neighbor_id],
                                          new_distance, new_types))
                print(new_paths)
                new_paths = heapq.nsmallest(self.K, new_paths, key=lambda x: x[0])
                paths = [(score, path, distance, current_types) for
                         score, path, distance, current_types in new_paths]

                self.expanded_nodes += len(new_paths)

            if self.best_path:
                return self.best_path, self.type_list, self.best_score, self.expanded_paths

            self.K *= 2
            retries += 1

        return self.best_path, self.type_list, self.best_score, self.expanded_paths

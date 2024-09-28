class Edge:
    def __init__(self, from_node, to_node, distance, score,type):
        self.from_node = from_node  # Start node of the edge
        self.to_node = to_node      # End node of the edge
        self.score = score          # Score of to_node
        self.distance = distance
        self.type = type


    def get_distance(self):
        return self.distance

    def get_score(self):
        return self.score

    def get_type(self):
        return self.type

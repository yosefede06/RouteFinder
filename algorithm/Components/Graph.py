from .Node import Node
from .Edge import Edge


class Graph:
    def __init__(self):
        self.nodes = dict()
        self.edges = dict()

    def add_node(self, id, x=0, y=0, extra=dict):
        self.nodes[id] = Node(id, x, y, extra)

    def has_node(self, id):
        return id in self.nodes

    def add_edge(self, from_node, to_node, distance, score,type):
        if from_node not in self.edges:
            self.edges[from_node] = dict()
        self.edges[from_node][to_node] = Edge(from_node, to_node, distance,
                                              score,type)

    def get_edge(self, from_node, to_node):
        if from_node not in self.edges or to_node not in self.edges[from_node]:
            return None
        return self.edges[from_node][to_node]

    def get_distance(self, from_node, to_node):
        # Retrieve the distance from the Edge object
        edge = self.get_edge(from_node, to_node)
        if edge is None:
            raise ValueError(f"No edge between {from_node} and {to_node}")
        return edge.get_distance()

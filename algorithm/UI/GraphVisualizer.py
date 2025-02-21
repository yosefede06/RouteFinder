import matplotlib.pyplot as plt
import networkx as nx
from itertools import permutations

class GraphVisualizer:
    def __init__(self, graph):
        self.graph = graph

    def visualize(self, best_path=None):
        G = nx.DiGraph()
        pos = {}  # Dictionary to hold positions of nodes for plotting
        node_labels = {}  # Labels for the nodes to include scores
        edge_labels = {}  # Labels for the edges to include distances

        # Add nodes to the graph, store their positions, and prepare labels
        for node in self.graph.nodes.values():
            G.add_node(node.id, pos=(node.x, node.y))
            pos[node.id] = (node.x, node.y)

        # Add edges between all nodes (since it's a complete graph) and prepare edge labels
        for (from_id, to_id) in permutations(self.graph.nodes.keys(), 2):
            edge = self.graph.get_edge(from_id, to_id)
            if not edge:
                continue
            edge_distance = edge.get_distance()
            edge_score = edge.get_score()
            G.add_edge(from_id, to_id, score=edge_score, distance=edge_distance)

            edge_labels[(from_id, to_id)] = f"({edge_distance:.2f}, {edge_score:.2f})"

        # Adjust node positions using a spring layout for better spacing in sparse graphs
        pos = nx.spring_layout(G,
                               seed=42)  # The 'seed' ensures the layout is the same each time

        # Draw the full graph with all edges and labels
        nx.draw(G, pos, with_labels=True, node_color='lightblue',
                node_size=500, font_size=10, font_color='black')

        # Draw edge labels (distances and scores)
        nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color='green', label_pos=0.3, font_size=8)

        # Highlight the best path found
        if best_path:
            best_path_edges = [(best_path[i], best_path[i + 1]) for i in range(len(best_path) - 1)]
            nx.draw_networkx_edges(G, pos, edgelist=best_path_edges, width=3, edge_color='red')
            nx.draw_networkx_nodes(G, pos, nodelist=best_path, node_color='red', node_size=700)

        plt.show()


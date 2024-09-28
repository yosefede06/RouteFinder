from abc import ABC, abstractmethod
import math


class PathFinderBase(ABC):
    def __init__(self, graph, max_distance, max_path=math.inf):
        self.graph = graph
        self.max_distance = max_distance
        self.max_path = max_path

    @abstractmethod
    def find_best_path(self, start_id, end_id):
        # Output path (list of nodes id)
        pass
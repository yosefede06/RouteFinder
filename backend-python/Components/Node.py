class Node:
    def __init__(self, id, x=0, y=0, extra={"name": "", "category": ""}):
        self.id = id       # Unique identifier for the node
        self.x = x
        self.y = y
        self.extra = extra

    def get_id(self):
        return self.id

    def get_coordinates(self):
        return self.x, self.y

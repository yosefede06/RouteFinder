import random


class GeneticAlgorithm:
    def __init__(self, graph, max_distance, max_path, start_id, end_id,
                 population_size=50, generations=100, mutation_rate=0.5):
        self.graph = graph
        self.max_distance = max_distance
        self.max_path = max_path
        self.start_id = start_id
        self.end_id = end_id
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.population = []

    def initialize_population(self):
        # Initialize the population with random paths
        for _ in range(self.population_size):
            path = self.random_path()
            self.population.append(path)

    def random_path(self):
        # Create a random path starting from start_id
        path = [self.start_id]
        current_node = self.start_id
        current_distance = 0

        while len(path) < self.max_path:
            neighbors = list(self.graph.edges.get(current_node, {}).items())
            if not neighbors:
                break

            neighbor, edge = random.choice(neighbors)
            new_distance = current_distance + edge.get_distance()

            # Ensure that the new path respects the max distance constraint
            if new_distance > self.max_distance:
                break
            current_distance = new_distance
            path.append(neighbor)
            current_node = neighbor

        return path

    def fitness(self, path):
        score = 0
        distance = 0
        for i in range(len(path) - 1):
            edge = self.graph.edges.get(path[i], {}).get(path[i + 1])
            if edge:
                score += edge.get_score()
                distance += edge.get_distance()
        if distance > self.max_distance:
            return -float('inf')  # Invalid path
        return score

    def selection(self):
        fitness_scores = [self.fitness(path) for path in self.population]
        total_fitness = sum(fitness_scores)
        selection_probs = [f / total_fitness for f in fitness_scores]

        parent1 = random.choices(self.population, weights=selection_probs, k=1)[0]
        parent2 = random.choices(self.population, weights=selection_probs, k=1)[0]
        return parent1, parent2

    def crossover(self, parent1, parent2):
        crossover_point = random.randint(1, min(len(parent1), len(parent2)) - 1)
        child = parent1[:crossover_point] + parent2[crossover_point:]
        return child

    def mutate(self, path):
        if len(path) > 2 and random.random() < self.mutation_rate:
            idx1 = random.randint(1, len(path) - 2)
            idx2 = random.randint(1, len(path) - 2)
            path[idx1], path[idx2] = path[idx2], path[idx1]
        return path

    def evolve(self):
        self.initialize_population()

        for generation in range(self.generations):
            new_population = []

            for _ in range(self.population_size // 2):
                parent1, parent2 = self.selection()
                child = self.crossover(parent1, parent2)
                child = self.mutate(child)
                new_population.append(child)
            self.population = new_population
        best_path = max(self.population, key=self.fitness)
        return best_path, self.fitness(best_path)

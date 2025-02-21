import time
import random
from itertools import permutations
from Components.Graph import Graph
from Solvers.Solutions.DFS import DFS
from Solvers.Solutions.Solution1 import LocalBeamSearch
from Solvers.Solutions.Solution2 import LookaheadCSP
import numpy as np
import matplotlib.pyplot as plt


# Function to run the experiment
def run_test1(iterations=10, sizes_range=(25, 100)):
    results = {
        "Algorithm": ["DFS", "Lookahead CSP", "UCS Local Beam"],
        "Execution Time": {"DFS": [], "Lookahead CSP": [], "UCS Local Beam":
            []},
        "Expanded Paths": {"DFS": [], "Lookahead CSP": [], "UCS Local Beam":
            []},
        "Best Score": {"DFS": [], "Lookahead CSP": [], "UCS Local Beam": []}
    }

    sizes = np.linspace(sizes_range[0], sizes_range[1], 6).astype(int)

    # Run tests and collect data for graphs of different sizes
    for size in sizes:
        avg_execution_time = {"DFS": [], "Lookahead CSP": [], "UCS Local "
                                                              "Beam": []}
        avg_expanded_paths = {"DFS": [], "Lookahead CSP": [], "UCS Local "
                                                              "Beam": []}
        avg_best_score = {"DFS": [], "Lookahead CSP": [], "UCS Local Beam": []}

        for i in range(iterations):  # Run 10 tests for each graph size
            print(f"Iteration {i+1} running algorithms on graph of size"
                  f" {size} ")
            graph = Graph()
            create_fully_connected_graph(graph, num_nodes=size)
            start_id, end_id = 1, size
            max_distance = 50
            max_path = 5

            # ---- Run UCS + Local Beam Search ----
            path_finder_local_beam = LocalBeamSearch(graph, max_distance=max_distance, max_path=max_path)

            start = time.time()
            best_path_local_beam = path_finder_local_beam.find_best_path(start_id=start_id, end_id=end_id)
            local_beam_time = time.time() - start
            avg_execution_time["UCS Local Beam"].append(local_beam_time)
            avg_expanded_paths["UCS Local Beam"].append(
                path_finder_local_beam.expanded_paths)
            avg_best_score["UCS Local Beam"].append(
                path_finder_local_beam.best_score)

            # ---- Run DFS Search ----
            dfs_search = DFS(graph, max_distance=max_distance,
                                       max_path=max_path)
            start = time.time()
            best_dfs_path = dfs_search.find_best_path(
                start_id=start_id,
                                                    end_id=end_id)
            local_beam_time = time.time() - start
            avg_execution_time["DFS"].append(local_beam_time)
            avg_expanded_paths["DFS"].append(
                dfs_search.expanded_paths)
            avg_best_score["DFS"].append(
                dfs_search.best_score)

            # ---- Run Lookahead CSP Search ----
            csp_search = LookaheadCSP(graph, max_distance=max_distance,
                                       max_path=max_path)
            start = time.time()
            best_csp_path = csp_search.find_best_path(
                start_id=start_id,
                                                    end_id=end_id)
            local_beam_time = time.time() - start
            avg_execution_time["Lookahead CSP"].append(local_beam_time)
            avg_expanded_paths["Lookahead CSP"].append(
                csp_search.paths_explored)
            avg_best_score["Lookahead CSP"].append(
                csp_search.best_score)

        results["Execution Time"]["UCS Local Beam"].append(np.mean(
            avg_execution_time["UCS Local Beam"]))
        results["Expanded Paths"]["UCS Local Beam"].append(np.mean(
            avg_expanded_paths["UCS Local Beam"]))
        results["Best Score"]["UCS Local Beam"].append(np.mean(avg_best_score[
                                                                 "UCS Local "
                                                                 "Beam"]))

        results["Execution Time"]["DFS"].append(np.mean(
            avg_execution_time["DFS"]))
        results["Expanded Paths"]["DFS"].append(np.mean(
            avg_expanded_paths["DFS"]))
        results["Best Score"]["DFS"].append(np.mean(avg_best_score[
                                                                 "DFS"]))

        results["Execution Time"]["Lookahead CSP"].append(np.mean(
            avg_execution_time["Lookahead CSP"]))
        results["Expanded Paths"]["Lookahead CSP"].append(np.mean(
            avg_expanded_paths["Lookahead CSP"]))
        results["Best Score"]["Lookahead CSP"].append(np.mean(avg_best_score[
                                                        "Lookahead CSP"]))

    # Visualize performance comparison
    visualize_performance_vs_graph_size(results, sizes)


def run_tests2():

    graph = Graph()

    for node in [25,50,75,100]:
        for i in range(3):
            print(f'Running iteration {i + 1}')
            # Set the maximum allowed distance for the path and max path length
            start_id, end_id = 1, node
            max_distance = 1000
            max_path = 5

            create_fully_connected_graph(graph, num_nodes=node)
            start = time.time()
            path_finder_csp_lookahead = LookaheadCSP(graph,
                                                     max_distance=max_distance,
                                                     max_path=max_path)
            best_path_csp_lookahead, type_list, best_score, path_explored = \
                path_finder_csp_lookahead.find_best_path(start_id, end_id)
            csp_lookahead_time = time.time() - start
            print("Lookahead CSP Best Path:", best_path_csp_lookahead)
            print("Lookahead CSP Path Explored:", path_explored)
            print("Lookahead CSP Best Types:", type_list)
            print("Lookahead CSP Best Score:", best_score)
            print(f"Time taken : {csp_lookahead_time}")

            # ---- Run UCS + Local Beam Search ----
            print("\nRunning UCS + Local Beam Search:")
            start = time.time()
            path_finder_local_beam = LocalBeamSearch(graph,
                                                     max_distance=max_distance,
                                                     max_path=max_path)
            best_path_local_beam, type_list, best_score, path_explored = \
                path_finder_local_beam.find_best_path(
                    start_id=start_id, end_id=end_id)
            local_beam_time = time.time() - start
            print("UCS + Local Beam Search Best Path:", best_path_local_beam)
            print("UCS + Local Beam Search Path Explored:", path_explored)
            print("UCS + Local Beam Search Best Types:", type_list)
            print("UCS + Local Beam Search Best Score:", best_score)
            print(f"Time taken : {local_beam_time}")


def create_fully_connected_graph(graph, num_nodes):
    types = ['Restaurant', 'Sports', 'Beach', 'Library', 'Museum', 'Park',
             'Cinema', 'Mall']

    for i in range(1, num_nodes + 1):
        graph.add_node(i, i,
                       i)

    for (from_id, to_id) in permutations(range(1, num_nodes + 1),
                                         2):
        distance = round(random.uniform(1, 10),
                         2)
        score = round(random.uniform(1, 100),
                      2)
        edge_type = random.choice(
            types)
        graph.add_edge(from_id, to_id, distance, score,
                       edge_type)

        graph.add_edge(to_id, from_id, distance, score,
                       edge_type) #add this to make it undirected


def run_test3(iterations=10, sizes_range=(25, 2000)):
    results = {
        "Algorithm": ["DFS", "Lookahead CSP", "UCS Local Beam"],
        "Execution Time": {"DFS": [], "Lookahead CSP": [], "UCS Local Beam":
            []},
        "Expanded Paths": {"DFS": [], "Lookahead CSP": [], "UCS Local Beam":
            []},
        "Best Score": {"DFS": [], "Lookahead CSP": [], "UCS Local Beam": []}
    }

    sizes = np.linspace(sizes_range[0], sizes_range[1], 10).astype(int)

    # Run tests and collect data for graphs of different sizes
    for size in sizes:
        avg_execution_time = {"DFS": [], "Lookahead CSP": [], "UCS Local "
                                                              "Beam": []}
        avg_expanded_paths = {"DFS": [], "Lookahead CSP": [], "UCS Local "
                                                              "Beam": []}
        avg_best_score = {"DFS": [], "Lookahead CSP": [], "UCS Local Beam": []}

        for i in range(iterations):  # Run 10 tests for each graph size
            print(f"Iteration {i+1} running algorithms on graph of size"
                  f" {size} ")
            graph = Graph()
            create_fully_connected_graph(graph, num_nodes=size)
            start_id, end_id = 1, size
            max_distance = 50
            max_path = 5

            # ---- Run UCS + Local Beam Search ----
            path_finder_local_beam = LocalBeamSearch(graph, max_distance=max_distance, max_path=max_path)
            start = time.time()
            best_path_local_beam = path_finder_local_beam.find_best_path(start_id=start_id, end_id=end_id)
            local_beam_time = time.time() - start
            avg_execution_time["UCS Local Beam"].append(local_beam_time)
            avg_expanded_paths["UCS Local Beam"].append(
                path_finder_local_beam.expanded_paths)
            avg_best_score["UCS Local Beam"].append(
                path_finder_local_beam.best_score)
            print(local_beam_time)
        results["Execution Time"]["UCS Local Beam"].append(np.mean(
            avg_execution_time["UCS Local Beam"]))
        results["Expanded Paths"]["UCS Local Beam"].append(np.mean(
            avg_expanded_paths["UCS Local Beam"]))
        results["Best Score"]["UCS Local Beam"].append(np.mean(avg_best_score[
                                                                 "UCS Local "
                                                                 "Beam"]))

    # Visualize performance comparison
    visualize_performance_vs_graph_size(results, sizes)


def visualize_performance_vs_graph_size(results, sizes):
    algorithms = ['UCS Local Beam']

    fig, axes = plt.subplots(1, 3, figsize=(18, 6))

    # --- Plot 1: Average Execution Time (Linear Scale) ---
    for algo in algorithms:
        axes[0].plot(sizes, results["Execution Time"][algo], label=algo, marker='o')
    axes[0].set_title('Average Execution Time')
    axes[0].set_xlabel('Number of Nodes')
    axes[0].set_ylabel('Time (s)')
    axes[0].legend()

    # --- Plot 2: Average Expanded Paths (Log Scale) ---
    for algo in algorithms:
        axes[1].plot(sizes, results["Expanded Paths"][algo], label=algo, marker='o')
    axes[1].set_title('Average Expanded Paths')
    axes[1].set_yscale('log')
    axes[1].set_xlabel('Number of Nodes')
    axes[1].set_ylabel('Number of Paths')
    axes[1].legend()

    # --- Plot 3: Average Best Path Score (Linear Scale) ---
    for algo in algorithms:
        axes[2].plot(sizes, results["Best Score"][algo], label=algo, marker='o')
    axes[2].set_title('Average Best Path Score')
    axes[2].set_xlabel('Number of Nodes')
    axes[2].set_ylabel('Score')
    axes[2].legend()

    plt.tight_layout()
    plt.show()


def main():
    # Test for the first plot in the report
    run_test1()
    # Test for the second plot in the report
    run_tests2()
    # test for the third plot in the report
    # run_test3()


if __name__ == "__main__":
    main()

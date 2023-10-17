#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <fstream>
#include <queue>
#include <algorithm>

using std::pair;
using std::greater;
using std::vector;
using std::cin;
using std::priority_queue;

pair<vector<int>, vector<int>> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S, std::string &output){
    // Create a priority queue for storing the nodes as a pair {dist,node}
    // where dist is the distance from source to the node. 
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    // Initialising distTo list with a large number to
    // indicate the nodes are unvisited initially.
    // This list contains distance from source to the nodes.
    vector<int> distTo(V, INT_MAX);

    // Predecessor list is initialized to -1. A -1 in the final pred list means that that node is unreachable.
    vector<int> pred(V, -1);

    // Source initialised with dist=0.
    distTo[S] = 0;
    pq.push({0, S});

    // Now, pop the minimum distance node first from the min-heap
    // and traverse for all its adjacent nodes.
    while (!pq.empty()) {
        auto copy = pq;
        output += "<pq>\n\t";
        while (copy.size()) {
            output += std::to_string(copy.top().first) + " " + std::to_string(copy.top().second) + " ";
            copy.pop();
        }
        output += "\n</pq>\n";

        int node = pq.top().second;
        int dis = pq.top().first;
        pq.pop();

        output += "<adj>\n\t";
        output += std::to_string(node) + ", " + std::to_string(dis) + ":";
        // Check for all adjacent nodes of the popped out
        // element whether the prev dist is larger than current or not.
        for (auto it : adj[node]) {
            int v = it.first;
            int w = it.second;
            output += "\n\t" + std::to_string(v) + ", " + std::to_string(w) + ", ";
            bool f = 0;
            if (dis + w < distTo[v]) {
                distTo[v] = dis + w;
                // If current distance is smaller, push it into the queue.
                pq.push({dis + w, v});
                // Change the predecessor from the old node to the newer, more optimal node
                pred[v] = node;
                f = 1;
            }
            // This is for output gen logic
            if (f) 
                output += "1, " + std::to_string(pred[v]) + ", " + std::to_string(distTo[v]);
            else    
                output += "0, -1, -1";
        }
        output += "\n</adj>\n";
    }
    return {distTo, pred};
}


vector<int> restore_path(int s, int t, vector<int> const& p) {
    // This function makes out the path from any node to source, and then reverse it to be a path from source to the node.
    vector<int> path;

    for (int v = t; v != s; v = p[v]) {
        path.push_back(v);
    }
    path.push_back(s);

    std::reverse(path.begin(), path.end());
    return path;
}


int main() {
    int V = 8, S = 0;
    int t = 7;
    vector<vector<pair<int, int>> > adj(V, vector<pair<int, int>>());
    pair<int, int> v1 = {1, 1}, v2 = {2, 6}, v3 = {2, 3}, v4 = {0, 1}, v5 = {1, 3}, v6 = {0, 6};
    std::string output; 
 /* Example graph visualized:
    0 ----> 1
   |      / | \
   |     /  |  \
   v    v   v   v
   3   2   4   6
   |   |   |   |
   v   v   v   v
   5 <---- 7
*/

    adj[0].push_back({1, 2});
    adj[0].push_back({3, 5});
    adj[1].push_back({2, 3});
    adj[1].push_back({4, 1});
    adj[1].push_back({6, 8});
    adj[2].push_back({5, 4});
    adj[3].push_back({1, 2});
    adj[3].push_back({6, 7});
    adj[4].push_back({7, 5});
    adj[5].push_back({0, 3});
    adj[5].push_back({7, 2});
    adj[6].push_back({3, 1});
    adj[7].push_back({2, 4});

    auto temp = dijkstra(V, adj, S, output);

    auto dists = temp.first, pred = temp.second;
    output += "<result>\n\t";
    output += std::to_string(V) + "," + std::to_string(S) + "\n\t";

    for (auto i: pred) {
        output += std::to_string(i) + " ";
    }
    output += "\n\t";

    std::vector<int> path = restore_path(S, t, pred);

    for (int i = 0; i < V; i++) {
        output += std::to_string(dists[i]) + " ";
    }
    output += "\n</result>\n";
    // 

    // output += "The path is: ";
    // for (auto i: path) {
        // output += std::to_string(i) + ",";
    // }

    // Fill in this string to the path in your workspace 
    std::string env_path = "";
    if (env_path.size() == 0) {
        std::cout << "Please enter in an environemnt path for the output file.";
    }
    std::ofstream outputFile(env_path + "\\output.txt");

    if (outputFile.is_open()) {
        outputFile << output << std::endl << std::endl; 
        outputFile.close(); // Close the file
    } else {
        std::cerr << "Failed to open the output file." << std::endl;
    }

    // std::cout << output;  // Print the accumulated output. For debug.

    return 0;
}
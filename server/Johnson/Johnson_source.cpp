#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <fstream>
#include <queue>
#include <algorithm>
#include <Windows.h>
#include <climits>
#include <array>

std::string epath;

using std::cout;
using std::endl;
using std::greater;
using std::pair;
using std::priority_queue;
using std::string;
using std::vector;

int Min_Distance(vector<int> &dist, vector<bool> &visit)
{
    int minimum = INT_MAX, minVertex = 0;
    for (int vertex = 0; vertex < dist.size(); ++vertex)
    {
        if (minimum > dist[vertex] && !visit[vertex])
        {
            minimum = dist[vertex];
            minVertex = vertex;
        }
    }
    return minVertex;
}

pair<vector<int>, vector<int>> dijkstra(int V, vector<vector<pair<int, int>>> &adj, int S, std::string &output)
{
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
    while (!pq.empty())
    {

        output += "<source>\n\t";
        output += std::to_string(S);
        output += "\n</source>\n";

        auto copy = pq;
        output += "<ds2>\n\t"; // begin <ds2>
        while (copy.size())
        { // putting PQ to output
            output += std::to_string(copy.top().first) + "," + std::to_string(copy.top().second) + " ";
            copy.pop();
        }
        output += "\n\t";
        for (auto &d : distTo)
        { // Putting dist to output
            if (d == INT_MAX)
                output += "INF ";
            else
                output += std::to_string(d) + " ";
        }
        output += "\n\t";
        for (auto &p : pred)
        { // putting pred to output
            output += std::to_string(p) + " ";
        }
        output += "\n</ds2>\n"; // <ds> stops here

        int node = pq.top().second;
        int dis = pq.top().first;
        pq.pop();

        output += "<adj2>\n\t"; // Adj begins here
        output += std::to_string(node) + ", " + std::to_string(dis) + ":";
        // Check for all adjacent nodes of the popped out
        // element whether the prev dist is larger than current or not.
        for (auto it : adj[node])
        {
            int v = it.first;
            int w = it.second;
            output += "\n\t" + std::to_string(v) + ", " + std::to_string(w) + ", ";
            bool f = 0;
            if (dis + w < distTo[v])
            {
                distTo[v] = dis + w;
                // If current distance is smaller, push it into the queue.
                pq.push({dis + w, v});
                // Change the predecessor from the old node to the newer, more optimal node
                pred[v] = node;
                f = 1;
            }
            // This is for output gen logic
            if (f) // outputing different things depending on comparision result
                output += "1, " + std::to_string(pred[v]) + ", " + std::to_string(distTo[v]);
            else
                output += "0, -1, -1";
        }
        output += "\n</adj2>\n"; // adj ends here
    }
    return {distTo, pred};
}

vector<int> BellmanFord_Algorithm(int V, std::vector<std::array<int, 3>> &edges, int S, std::string &output)
{
    vector<int> distTo(V + 1, 1e9);
    vector<int> pred(V + 1, -1);
    distTo[S] = 0;

    // adding a new source node
    // and creating an edge from that node to all the nodes with weight as 0.
    cout << V << endl;
    for (int i = 0; i < V; ++i)
    {
        edges.push_back({V, i, 0});
    }

    // tranverse of nodes-1 on edge list
    for (int i = 0; i < V - 1; i++)
    {
        // source : from youtube -> code babbar

        // iterating over the edges
        for (int j = 0; j < edges.size(); j++)
        {
            int u = edges[j][0]; // source node
            int v = edges[j][1]; // destination node
            int w = edges[j][2]; // weight betwee the nodes

            output += "<ds>\n\t"; // begin <ds>
            output += std::to_string(u) + "," + std::to_string(distTo[u]) + " ";

            output += "\n\t";
            for (auto &d : distTo)
            { // Putting dist to output
                if (d == 1e9)
                    output += "INF ";
                else
                    output += std::to_string(d) + " ";
            }
            output += "\n\t";
            for (auto &p : pred)
            { // putting pred to output
                output += std::to_string(p) + " ";
            }
            output += "\n</ds>\n"; // <ds> stops here

            output += "<adj>\n\t"; // Adj begins here

            output += std::to_string(u) + ", " + std::to_string(distTo[u]) + ":";
            output += "\n\t" + std::to_string(v) + ", " + std::to_string(w) + ", ";

            // element whether the prev dist is larger than current or not.
            // If current distance is smaller, push it into the queue.

            bool f = 0;
            if (distTo[u] != 1e9 && distTo[u] + w < distTo[v])
            {
                distTo[v] = distTo[u] + w;
                pred[v] = u;
                f = 1;
            }

            // This is for output gen logic
            if (f) // outputing different things depending on comparision result
                output += "1, " + std::to_string(pred[v]) + ", " + std::to_string(distTo[v]);
            else
                output += "0, -1, -1";

            output += "\n</adj>\n"; // adj ends here
        }
    }

    // check for negative weight cycle
    bool flag = 0;
    for (int i = 0; i < V - 1; i++)
    {
        for (int j = 0; j < edges.size(); j++)
        {
            int u = edges[j][0];
            int v = edges[j][1];
            int w = edges[j][2];

            if (distTo[u] != INT_MAX && distTo[u] + w < distTo[v])
            {
                flag = 1;
            }
        }
    }

    if (flag == 0)
    {
        return distTo;
    }
}

std::string goBackDir(std::string path, int levels)
{
    std::string res;
    int count = 0;
    for (int i = path.size() - 1; i >= 0; i--)
    {
        if (count == levels)
        {
            res = path.substr(0, i + 1);
        }
        if (path[i] == '\\')
            count++;
    }
    return res;
}

void storeOutput(string output)
{

    std::string path = std::string(epath);
    std::ofstream outputFile(goBackDir(path, 1) + "\\file io\\output.txt");

    if (outputFile.is_open())
    {
        outputFile << output << std::endl
                   << std::endl;
        outputFile.close(); // Close the file
    }
    else
    {
        std::cerr << "Failed to open the output file." << std::endl;
    }

    return;
}

vector<int> restore_path(int s, int t, vector<int> const &p)
{
    // This function makes out the path from any node to source, and then reverse it to be a path from source to the node.
    vector<int> path;

    for (int v = t; v != s; v = p[v])
    {
        path.push_back(v);
    }
    path.push_back(s);

    std::reverse(path.begin(), path.end());
    return path;
}

void JohnsonAlgorithm(int V, vector<vector<int>> &graph, std::string &output)
{
    vector<std::array<int, 3>> edges;

    // creating an edges vector from the graph matrix
    for (int i = 0; i < graph.size(); ++i)
    {
        for (int j = 0; j < graph[i].size(); ++j)
        {
            if (i != j && graph[i][j] != 1e9 && graph[i][j] != 0)
            {
                edges.push_back({i, j, graph[i][j]});
            }
        }
    }

    // calling bellman ford to get the weights for each node.
    // weight of each node will be the shortest distance between that node and the new source node we are adding to the graph
    vector<int> Alter_weights = BellmanFord_Algorithm(V, edges, V, output);

    // making new graph for altered weights
    vector<vector<int>> Altered_Graph(graph.size(), vector<int>(graph.size(), 1e9));

    // making a new graph by reweighting the edges to convert negative edges to positive edges
    for (int i = 0; i < graph.size(); ++i)
    {
        for (int j = 0; j < graph[i].size(); ++j)
        {
            if (graph[i][j] != 0)
            {
                // new weight = old weight + weight(node1) - weight(node2)
                Altered_Graph[i][j] = (graph[i][j] + Alter_weights[i] - Alter_weights[j]);
            }
        }
    }

    cout << "Modified Graph: ";
    for (auto &row : Altered_Graph)
    {
        cout << "\n";
        for (int val : row)
        {
            cout << val << " ";
        }
    }

    // converting the adjacency matrix into adjacency list for passing it to dijkstra
    vector<vector<pair<int, int>>> adj(V, vector<pair<int, int>>());
    for (int i = 0; i < Altered_Graph.size(); i++)
    {
        for (int j = 0; j < Altered_Graph.size(); j++)
        {
            if (i != j && Altered_Graph[i][j] != 1e9)
                adj[i].push_back({j, Altered_Graph[i][j]});
        }
    }

    // apply dijkstra by taking each node as source node to find all pair shortest path
    for (int source = 0; source < graph.size(); source++)
    {

        cout << "\n\nShortest Distance with vertex " << source << " as the source:\n";
        auto temp = dijkstra(Altered_Graph.size(), adj, source, output);

        auto dists = temp.first, pred = temp.second;

        output += "<result>\n\t";
        output += std::to_string(V) + "," + std::to_string(source) + "\n\t";

        for (auto i : pred)
        {
            output += std::to_string(i) + " ";
        }
        output += "\n\t";

        for (int i = 0; i < V; i++)
        {
            output += std::to_string(dists[i]) + " ";
        }
        output += "\n</result>\n";
    }
    // Storing the result for front end to read
    storeOutput(output);
}

pair<int, vector<vector<int>>> make_graph()
{

    std::ifstream inputFile;
    std::string path = std::string(epath);
    inputFile.open(goBackDir(path, 1) + "\\file io\\input.txt");
    vector<std::string> lines;
    if (inputFile.is_open())
    {
        std::string line;
        while (std::getline(inputFile, line))
        {
            lines.push_back(line);
        }

        inputFile.close();
    }
    else
    {
        std::cerr << "Error: Unable to open the file." << std::endl;
    }

    pair<int, vector<vector<int>>> res;
    int V = lines.size();
    vector<vector<int>> adj(V, vector<int>(V, 1e9));
    for (auto line : lines)
    {
        int pointer = 0;
        string temp;
        // extract the node value
        while (line[pointer] != ' ')
        {
            temp += line[pointer];
            pointer++;
        }

        int node = std::stoi(temp);
        temp = "";

        // skip past extra info
        while (pointer < line.size() && line[pointer] != ':')
            pointer++;

        // if the node has no neighbours, continue
        if (pointer >= line.size())
            continue;
        pointer += 2; // skip past the ":" and the " "

        int neighbour = 0, weight = 0;
        while (pointer < line.size())
        {
            // get num until ","
            while (pointer < line.size() && line[pointer] != ',')
            {
                temp += line[pointer];
                pointer++;
            }
            if (pointer >= line.size())
                continue;

            pointer++; // skip the ','
            neighbour = std::stoi(temp);
            temp = "";
            // get the number until ' '
            while (line[pointer] != ' ')
            {
                temp += line[pointer];
                pointer++;
            }
            weight = std::stoi(temp);
            temp = "";

            adj[node][neighbour] = weight;
        }
    }
    res = {V, adj};
    return res;
}

std::string getExecutablePath()
{
    char buffer[MAX_PATH];
    // @ts-ignore
    GetModuleFileName(NULL, buffer, MAX_PATH); // ignore this error it doesn't matter
    return std::string(buffer);
}

int main()
{
    epath = getExecutablePath();
    std::cout << "Current File: " << epath << std::endl;

    auto g = make_graph();

    int V = g.first;
    int t = 0;
    auto edges = g.second;
    std::string output;

    JohnsonAlgorithm(V, edges, output);

    return 0;
}

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
#include <chrono>

std::string epath;

using std::cout;
using std::endl;
using std::greater;
using std::pair;
using std::string;
using std::vector;

pair<vector<int>, vector<int>> bellmanFord(int V, std::vector<std::array<int, 3>> &edges, int S, std::string &output)
{
    vector<int> distTo(V, INT_MAX);
    vector<int> pred(V, -1);
    distTo[S] = 0;
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
            output += "\n</ds>\n"; // <ds> stops here

            output += "<adj>\n\t"; // Adj begins here
            output += std::to_string(u) + ", " + std::to_string(distTo[u]) + ":";
            output += "\n\t" + std::to_string(v) + ", " + std::to_string(w) + ", ";

            // element whether the prev dist is larger than current or not.
            // If current distance is smaller, push it into the queue.
            bool f = 0;
            if (distTo[u] != INT_MAX && distTo[u] + w < distTo[v])
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

    if (flag == 1)
    {
        pred.push_back(-1);
    }
    return {distTo, pred};
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

pair<int, vector<std::array<int, 3>>> make_graph()
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
            cout << line << endl;
            lines.push_back(line);
        }
        inputFile.close();
    }
    else
    {
        std::cerr << "Error: Unable to open the file." << std::endl;
    }

    // cout << "done";

    pair<int, vector<std::array<int, 3>>> res;
    int V = lines.size();
    vector<std::array<int, 3>> edges;
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
            edges.push_back({node, neighbour, weight});
        }
    }
    res = {V, edges};

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

    int V = g.first, S = 0;
    int t = 0;
    auto edges = g.second;
    std::string output;
    // Timing the actual algo with chrono
    auto startTime = std::chrono::high_resolution_clock::now(); // starting the timing clock
    auto temp = bellmanFord(V, edges, S, output);
    auto endTime = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);
    auto time_taken = duration.count();
    bool n_c = 0; // Negative cycle flag
    auto dists = temp.first, pred = temp.second;
    if (pred.size() != V) {
        pred.pop_back();
        n_c = 1;
    }
    int E = edges.size();
    output += "<result>\n\t";
    output += std::to_string(time_taken) + " " + std::to_string(V) + " " + std::to_string(E) + " " + std::to_string(S) + " " + std::to_string(n_c) + "\n\t";

    for (auto i : pred)
    {
        output += std::to_string(i) + " ";
    }
    output += "\n\t";

    std::vector<int> path = restore_path(S, t, pred);

    for (int i = 0; i < V; i++)
    {
        output += std::to_string(dists[i]) + " ";
    }
    output += "\n</result>\n";

    // Storing the result for front end to read

    storeOutput(output);

    return 0;
}

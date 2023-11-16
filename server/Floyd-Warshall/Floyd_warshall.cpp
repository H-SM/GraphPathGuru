#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <fstream>
#include <queue>
#include <algorithm>
#include <Windows.h>
#include <climits>

std::string epath;

using std::cout;
using std::endl;
using std::greater;
using std::pair;
using std::priority_queue;
using std::string;
using std::vector;

pair<vector<int>, vector<int>> floyd(int V, vector<vector<int>> &adj, int S, std::string &output)
{

    // Initialising distTo list with a large number to
    // indicate the nodes are unvisited initially.
    // This list contains distance from source to the nodes.
    vector<int> distTo(V, INT_MAX);

    // Predecessor list is initialized to -1. A -1 in the final pred list means that that node is unreachable.
    vector<int> pred(V, -1);

    // Source initialised with dist=0.
    distTo[S] = 0;

    // size of the adjacency matrix
    int n = adj.size();

    // using dp to check if we can reach two points via any other point.
    for (int k = 0; k < n; k++)
    {
        output += "<ds>\n\t";
        output += std::to_string(k); // via k node

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

        for (int i = 0; i < n; i++)
        {
            output += "<adj>\n\t"; // Adj begins here
            output += std::to_string(i) + ", " + std::to_string(distTo[i]) + ":";

            // check for all the nodes
            for (int j = 0; j < n; j++)
            {
                output += "\n\t" + std::to_string(j) + ", " + std::to_string(distTo[j]) + ", ";

                // distance from node to itseld will be zero
                if (i == j)
                    adj[i][j] = 0;

                bool f = 0;

                // checking if we can reach i to j via k
                if (adj[i][k] < 1e9 && adj[k][j] < 1e9)
                {
                    if (adj[i][k] + adj[k][j] < adj[i][j])
                    {
                        f = 1;
                        adj[i][j] = adj[i][k] + adj[k][j];
                        pred[j] = k;
                        distTo[j] = adj[S][j]; // updating distance from source to j
                    }
                }

                if (f) // outputing different things depending on comparision result
                    output += "1, " + std::to_string(pred[j]) + ", " + std::to_string(distTo[j]);
                else
                    output += "0, -1, -1";
            }
            output += "\n</adj>\n";
        }
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
    auto adj = g.second;
    std::string output;

    auto temp = floyd(V, adj, S, output);

    auto dists = temp.first, pred = temp.second;
    output += "<result>\n\t";
    output += std::to_string(V) + "," + std::to_string(S) + "\n\t";

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

    // std::cout << output;  // Print the accumulated output. For debugging.

    return 0;
}
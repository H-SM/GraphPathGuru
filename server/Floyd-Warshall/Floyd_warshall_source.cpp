#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <fstream>
#include <queue>
#include <algorithm>
#include <Windows.h>
#include <chrono>
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

    // size of the adjacency matrix
    int n = adj.size();

    // using dp to check if we can reach two points via any other point.
    for (int k = 0; k < n; k++)
    {
        output += "<ds>\n\t";

        for (int a = 0; a < adj.size(); a++)
        {
            for (int b = 0; b < adj.size(); b++)
            {
                if(adj[a][b] == 1e9)
                {
                    output += "INF ";
                }
                else
                    output += std::to_string(adj[a][b]) + " ";
            }
            output += "\n\t";
        }

        output += "\n</ds>\n"; // <ds> stops here

        for (int i = 0; i < n; i++)
        {
            output += "<adj>\n\t"; // Adj begins here
            output += std::to_string(i) + ", " + std::to_string(adj[i][k]) + ":";

            // check for all the nodes
            for (int j = 0; j < n; j++)
            {
                if (i == j)
                {
                    adj[i][j] = 0;
                    continue;
                }

                output += "\n\t" + std::to_string(j) + ", " + std::to_string(adj[i][j]) + ", ";

                // distance from node to itseld will be zero

                bool f = 0;

                // checking if we can reach i to j via k
                if (adj[i][k] < 1e9 && adj[k][j] < 1e9)
                {
                    if (adj[i][k] + adj[k][j] < adj[i][j])
                    {
                        f = 1;
                        adj[i][j] = adj[i][k] + adj[k][j];
                    }
                }

                if (f) // outputing different things depending on comparision result
                    output += "1,";
                else
                    output += "0,";
            }
            output += "\n</adj>\n";
        }
    }
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

    for (int i = 0; i < adj.size(); i++)
    {
        for (int j = 0; j < adj.size(); j++)
        {
            if (i == j)
            {
                adj[i][j] = 0;
            }
        }
    }

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

    auto startTime = std::chrono::high_resolution_clock::now(); // starting the timing clock
    floyd(V, adj, S, output);   
    auto endTime = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);

    auto time_taken = duration.count();
    // Counting the number edges
    int E = 0;
    for (auto i: adj) {
        E += i.size();
    }

    output += "<result>\n\t";
    output += std::to_string(time_taken) + " " + std::to_string(V) + " " + std::to_string(E) + " " + std::to_string(S) + "\n\t";

    for (int a = 0; a < adj.size(); a++)
    {
        for (int b = 0; b < adj.size(); b++)
        {
            output += std::to_string(adj[a][b]) + " ";
        }
        output += "\n\t";
    }

    output += "\n</result>\n";

    // Storing the result for front end to read
    storeOutput(output);

    // std::cout << output;  // Print the accumulated output. For debugging.

    return 0;
}
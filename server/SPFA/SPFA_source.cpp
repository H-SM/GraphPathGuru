#include <iostream>
#include <vector>
#include <utility>
#include <queue>
#include <fstream>
#include <string>
#include <algorithm>
#include <Windows.h>

std::string epath;

using std::queue;
using std::vector;
using std::pair;
using std::endl;
using std::cout;

const int INF = 1000000000;


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



std::string goBackDir(std::string path, int levels) {
    std::string res;
    int count = 0;
    for (int i = path.size()-1; i >= 0; i--) {
        if (count == levels) {
            res = path.substr(0, i+1);
        }
        if (path[i] == '\\')
            count++;
        
    }
    return res;
}


pair<int,vector<vector<pair<int, int>>>> make_graph() {
    
    std::ifstream inputFile;
    std::string path = std::string(epath);
    inputFile.open(goBackDir(path, 1)+"\\file io\\input.txt");
    vector<std::string> lines;
    if (inputFile.is_open()) {
        std::string line;
        while (std::getline(inputFile, line)) {
            cout << line << endl;
            lines.push_back(line);
        }

        inputFile.close();
    } else {
        std::cerr << "Error: Unable to open the file." << std::endl;
    }


    pair<int,vector<vector<pair<int, int>>>> res;
    int V = lines.size();
    vector<vector<pair<int, int>>> adj(V, vector<pair<int, int>>());
    for (auto line: lines) {
        int pointer = 0;
        std::string temp;
        // extract the node value
        while (line[pointer] != ' ') {
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
        while (pointer < line.size()) {
            // get num until ","
            while (pointer < line.size() && line[pointer] != ',') {
                temp += line[pointer];   
                pointer++;
            }
            if (pointer >= line.size())
                continue;

            pointer++; // skip the ','
            neighbour = std::stoi(temp);
            temp = "";
            // get the number until ' '
            while (line[pointer] != ' ') {
                temp += line[pointer];
                pointer++;
            }
            weight = std::stoi(temp);
            temp = "";
            adj[node].push_back({neighbour, weight});
        }
    }
    res = {V, adj};
    return res;
}


void storeOutput(std::string output) {

    std::string path = std::string(epath);
    std::ofstream outputFile(goBackDir(path, 1)+"\\file io\\output.txt");

    if (outputFile.is_open()) {
        outputFile << output << std::endl << std::endl; 
        outputFile.close(); // Close the file
    } else {
        std::cerr << "Failed to open the output file." << std::endl;
    }

    return;
}


std::string getExecutablePath() {
    char buffer[MAX_PATH];
    // @ts-ignore
    GetModuleFileName(NULL, buffer, MAX_PATH);  // ignore this error it doesn't matter
    return std::string(buffer);
}


// Essentially, in bellman ford we relax ALL edges regardless of condition
// In SPFA, we only recheck some edge if it has been relaxed, incase it can lead to a better path
// This makes the asymptotic complexity the same, but it increases the real time performance by a 
// good margin.
bool spfa(int s, vector<int>& d, vector<vector<pair<int, int>>> adj, vector<int> &p, std::string& output) {
    int n = adj.size();
    vector<int> cnt(n, 0);
    vector<bool> inqueue(n, false);
    queue<int> q;

    d[s] = 0;
    q.push(s);
    inqueue[s] = true;
    while (!q.empty()) {


        auto copy = q;
        output += "<ds>\n\t"; // begin <ds>
        while (copy.size()) {   // putting in the queue of edges
            output += std::to_string(copy.front()) + " ";
            copy.pop();
        }
        // adding pred
        for (auto i: p)
            output +=  std::to_string(i) + " ";
        output += "\n\t";
        // adding dist
        for (auto i: d)
            output += std::to_string(i) + " ";
        output += "\n\t";
        for (auto i: inqueue)
            output += std::to_string(i) + " ";
        
        output += "\n<ds>\n"; // ending <ds>



        int v = q.front();
        q.pop();
        inqueue[v] = false;

        // beginning adj:
        output += "<adj>\n\t"; // begin <adj>
        output += std::to_string(v) + ", " + std::to_string(d[v]) + "\n\t";


        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;


            output += "\n\t"+ std::to_string(v) + ", " + std::to_string(d[v]) + ", ";


            bool f = 0;
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
                if (!inqueue[to]) { // in-queue is used here to further optimize the number of times an edge is relaxed 
                    q.push(to);
                    inqueue[to] = true;
                    cnt[to]++;
                    f = 1;
                    if (cnt[to] > n)
                        return false;  // negative cycle
                }
            }


            if (f)  // outputing different things depending on comparision result
                output += "1, " + std::to_string(p[to]) + ", " + std::to_string(d[to]);
            else    
                output += "0, -1, -1";
        }

        
        output += "\n</adj>\n"; // adj ends here
    }
    return true;
}



int main() {
    epath = getExecutablePath();
    std::cout << "Current File: " << epath << std::endl;
    auto g = make_graph();
    int V = g.first, S = 0;
    int t = 0;
    auto adj = g.second;
    std::string output; 
    vector<int> dist(V, INF);
    vector<int> p(V, -1);
    bool n_c = spfa(S, dist, adj, p, output);

    
    output += "<result>\n\t";       // TODO: dist, p, thats it
    output += std::to_string(V) + "," + std::to_string(S) + "\n\t";
    // adding pred
    for (auto i: p)
        output +=  std::to_string(i) + " ";
    output += "\n\t";
    // adding dist
    for (auto i: dist)
        output += std::to_string(i) + " ";

    output += "\n</result>\n";
    
    // Storing the result for front end to read
    storeOutput(output);
    
    // std::cout << output;  // Print the accumulated output. For debugging.

    return 0;
}
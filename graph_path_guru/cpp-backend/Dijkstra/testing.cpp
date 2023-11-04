#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <utility>

using std::vector;
using std::pair;
using std::string;
using std::cout;
using std::endl;


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
    std::string path = std::string(__FILE__);
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
        string temp;
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


int main() {
    std::string path = std::string(__FILE__);
    auto e = make_graph();
    auto adj = e.second;
    auto V = e.first;
    cout << endl;
    int count = 0;
    for (auto neighbours: adj) {
        cout << count++ << ": ";
        for (auto node: neighbours) {
            cout << node.first << ',' << node.second << ' ';
        }
        cout << endl;
    }
    std::cout << path << std::endl;
    // std::cout << goBackDir(path, 0) << std::endl;
    // std::cout << goBackDir(path, 1) << std::endl;
    // std::cout << goBackDir(path, 2) << std::endl;
    // std::cout << goBackDir(path, 3) << std::endl;

    return 0;
}

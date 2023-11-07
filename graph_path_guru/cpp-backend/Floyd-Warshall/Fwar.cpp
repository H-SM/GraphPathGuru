#include <iostream>
#include <utility>


int main() {
    // not done at all lol
    int INF = INT_MAX;
    int n = 0;
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (d[i][k] < INF && d[k][j] < INF)
                    d[i][j] = std::min(d[i][j], d[i][k] + d[k][j]); 
            }
    }
}
    return 0;
}
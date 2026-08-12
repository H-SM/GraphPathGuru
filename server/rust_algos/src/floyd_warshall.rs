pub const INF: i32 = 1_000_000_000;

/// Builds the V×V matrix `Floyd_warshall_source.cpp`'s `make_graph()` used to
/// build directly from the text input; here it's built from the adjacency
/// list instead. Diagonal starts at 0, everything else at INF, then each
/// `(neighbor, weight)` overwrites its cell (last write wins on duplicates,
/// matching the original parser's behavior).
pub fn build_matrix(v: usize, adj: &[Vec<(usize, i32)>]) -> Vec<Vec<i32>> {
    let mut m = vec![vec![INF; v]; v];
    for i in 0..v {
        m[i][i] = 0;
    }
    for (u, neighbors) in adj.iter().enumerate() {
        for &(nb, w) in neighbors {
            m[u][nb] = w;
        }
    }
    m
}

/// Successor matrix for path reconstruction: `next[i][j]` is the node to
/// step to from `i` when heading toward `j` along a shortest path, or -1 if
/// there's no path. The original C++ never tracked this (Floyd-Warshall's
/// `<ds>`/`<adj>` trace only ever carried distances), so this is new
/// behavior layered alongside the faithfully-ported distance computation
/// below, not a change to it.
pub fn build_next_matrix(n: usize) -> Vec<Vec<i32>> {
    vec![vec![-1; n]; n]
}

pub fn init_next_matrix(next: &mut [Vec<i32>], adj_matrix: &[Vec<i32>]) {
    let n = adj_matrix.len();
    for i in 0..n {
        for j in 0..n {
            if i != j && adj_matrix[i][j] < INF {
                next[i][j] = j as i32;
            }
        }
    }
}

/// Reconstructs the path from `source` to `dest` using the successor
/// matrix. Empty if unreachable.
pub fn path_from_next(next: &[Vec<i32>], source: usize, dest: usize) -> Vec<usize> {
    if source != dest && next[source][dest] == -1 {
        return Vec::new();
    }
    let mut path = vec![source];
    let mut cur = source;
    while cur != dest {
        cur = next[cur][dest] as usize;
        path.push(cur);
    }
    path
}

/// Faithful port of `floyd()` in `Floyd_warshall_source.cpp`. Mutates the
/// matrix in place; the function has no meaningful return value in the
/// original either (its declared return type is never actually returned).
/// Also maintains `next` (see above) alongside it.
pub fn floyd_warshall_core(adj_matrix: &mut [Vec<i32>], next: &mut [Vec<i32>], output: &mut String) {
    let n = adj_matrix.len();

    for k in 0..n {
        output.push_str("<ds>\n\t");
        for a in 0..n {
            for b in 0..n {
                if adj_matrix[a][b] == INF {
                    output.push_str("INF ");
                } else {
                    output.push_str(&format!("{} ", adj_matrix[a][b]));
                }
            }
            output.push_str("\n\t");
        }
        output.push_str("\n</ds>\n");

        for i in 0..n {
            output.push_str(&format!("<adj>\n\t{}, {}:", i, adj_matrix[i][k]));
            for j in 0..n {
                if i == j {
                    adj_matrix[i][j] = 0;
                    continue;
                }
                output.push_str(&format!("\n\t{}, {}, ", j, adj_matrix[i][j]));

                let mut relaxed = false;
                if adj_matrix[i][k] < INF && adj_matrix[k][j] < INF
                    && adj_matrix[i][k] + adj_matrix[k][j] < adj_matrix[i][j]
                {
                    relaxed = true;
                    adj_matrix[i][j] = adj_matrix[i][k] + adj_matrix[k][j];
                    next[i][j] = next[i][k];
                }

                output.push_str(if relaxed { "1," } else { "0," });
            }
            output.push_str("\n</adj>\n");
        }
    }
}

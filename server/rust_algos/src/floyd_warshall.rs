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

/// Faithful port of `floyd()` in `Floyd_warshall_source.cpp`. Mutates the
/// matrix in place; the function has no meaningful return value in the
/// original either (its declared return type is never actually returned).
pub fn floyd_warshall_core(adj_matrix: &mut [Vec<i32>], output: &mut String) {
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
                }

                output.push_str(if relaxed { "1," } else { "0," });
            }
            output.push_str("\n</adj>\n");
        }
    }
}

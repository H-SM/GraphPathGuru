use crate::bellman_ford::bellman_ford_core;
use crate::dijkstra::dijkstra_core;
use crate::floyd_warshall::INF;

/// Faithful port of `JohnsonAlgorithm()` in `Johnson_source.cpp`. `graph` is
/// the V×V matrix (0 on the diagonal, INF for non-edges). Two pre-existing
/// quirks in the original are intentionally preserved since they shape the
/// exact numbers downstream:
///   - the edge list built for the reweighting pass excludes zero-weight
///     edges (`graph[i][j] != 0`), not just non-edges;
///   - the reweighting step (`graph[i][j] + w[i] - w[j]`) is applied to
///     every cell where `graph[i][j] != 0`, including INF non-edge cells,
///     not only real edges.
pub fn johnson_core(v: usize, graph: &[Vec<i32>], output: &mut String) {
    let mut edges: Vec<(usize, usize, i32)> = Vec::new();
    for i in 0..v {
        for j in 0..v {
            if i != j && graph[i][j] != INF && graph[i][j] != 0 {
                edges.push((i, j, graph[i][j]));
            }
        }
    }
    // Virtual source node `v`, zero-weight edge to every real node.
    for i in 0..v {
        edges.push((v, i, 0));
    }

    let bf_result = bellman_ford_core(v + 1, &edges, v, v.saturating_sub(1), INF, output);
    let alter_weights = bf_result.dist;

    let mut altered = vec![vec![INF; v]; v];
    for i in 0..v {
        for j in 0..v {
            if graph[i][j] != 0 {
                altered[i][j] = graph[i][j] + alter_weights[i] - alter_weights[j];
            }
        }
    }

    let mut adj: Vec<Vec<(usize, i32)>> = vec![Vec::new(); v];
    for i in 0..v {
        for j in 0..v {
            if i != j && altered[i][j] != INF {
                adj[i].push((j, altered[i][j]));
            }
        }
    }

    for source in 0..v {
        let res = dijkstra_core(v, &adj, source, output, "ds2", "adj2", true);

        output.push_str("<dijk-result>\n\t");
        output.push_str(&format!("{},{}\n\t", v, source));
        for &p in &res.pred {
            output.push_str(&format!("{} ", p));
        }
        output.push_str("\n\t");
        for i in 0..v {
            output.push_str(&format!("{} ", res.dist[i]));
        }
        output.push_str("\n</dijk-result>\n");
    }
}

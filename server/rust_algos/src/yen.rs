use crate::dijkstra::dijkstra_path;

/// Faithful port of `Yen()` in `Yen_source.cpp`. `adj` is mutated in place
/// (edges used by a found path are removed before the next iteration), and
/// only the directed edge actually traversed (u -> v) is removed, matching
/// the original.
pub fn yen(
    v: usize,
    adj: &mut [Vec<(usize, i32)>],
    source: usize,
    dest: usize,
    k: usize,
    output: &mut String,
) -> Vec<Vec<usize>> {
    let mut k_shortest_paths = Vec::new();

    for _ in 0..k {
        let path = dijkstra_path(v, adj, source, dest, output);
        if path.is_empty() {
            break;
        }
        k_shortest_paths.push(path.clone());

        output.push_str("<path>");
        for w in path.windows(2) {
            let (u, target) = (w[0], w[1]);
            if let Some(idx) = adj[u].iter().position(|&(nb, _)| nb == target) {
                output.push_str(&format!("\n\t{}, {}:", u, adj[u][idx].0));
                adj[u].remove(idx);
            }
        }
        output.push_str("\n</path>\n");
    }

    k_shortest_paths
}

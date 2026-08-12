pub const INF: i32 = i32::MAX;

pub struct BellmanFordResult {
    pub dist: Vec<i32>,
    pub pred: Vec<i32>,
}

fn fmt_dist(d: i32, sentinel: i32) -> String {
    if d == sentinel {
        "INF".to_string()
    } else {
        d.to_string()
    }
}

/// Shared core behind `bellmanFord` (`Bellman_source.cpp`) and
/// `BellmanFord_Algorithm` (`Johnson_source.cpp`, called with a virtual
/// source node appended to `edges` and a `size` of V+1 / sentinel of 1e9).
/// Emits the same `<ds>`/`<adj>` trace format in both cases.
pub fn bellman_ford_core(
    size: usize,
    edges: &[(usize, usize, i32)],
    source: usize,
    passes: usize,
    sentinel: i32,
    output: &mut String,
) -> BellmanFordResult {
    let mut dist_to = vec![sentinel; size];
    let mut pred: Vec<i32> = vec![-1; size];
    dist_to[source] = 0;

    for _ in 0..passes {
        for &(u, v, w) in edges {
            output.push_str("<ds>\n\t");
            output.push_str(&format!("{},{} ", u, dist_to[u]));
            output.push_str("\n\t");
            for &d in &dist_to {
                output.push_str(&fmt_dist(d, sentinel));
                output.push(' ');
            }
            output.push_str("\n\t");
            for &p in &pred {
                output.push_str(&p.to_string());
                output.push(' ');
            }
            output.push_str("\n</ds>\n");

            output.push_str(&format!(
                "<adj>\n\t{}, {}:\n\t{}, {}, ",
                u, dist_to[u], v, w
            ));

            let mut relaxed = false;
            if dist_to[u] != sentinel && dist_to[u] + w < dist_to[v] {
                dist_to[v] = dist_to[u] + w;
                pred[v] = u as i32;
                relaxed = true;
            }
            if relaxed {
                output.push_str(&format!("1, {}, {}", pred[v], dist_to[v]));
            } else {
                output.push_str("0, -1, -1");
            }
            output.push_str("\n</adj>\n");
        }
    }

    BellmanFordResult {
        dist: dist_to,
        pred,
    }
}

/// Single-pass relaxability check; equivalent in outcome to the original's
/// redundant V-1-pass negative-cycle check (that loop never changes the
/// resulting boolean, and has no effect on the emitted output string).
pub fn has_negative_cycle(edges: &[(usize, usize, i32)], dist: &[i32], sentinel: i32) -> bool {
    edges
        .iter()
        .any(|&(u, v, w)| dist[u] != sentinel && dist[u] + w < dist[v])
}

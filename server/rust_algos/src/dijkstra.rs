use std::cmp::Reverse;
use std::collections::BinaryHeap;

pub const INF: i32 = i32::MAX;

pub struct DijkstraResult {
    pub dist: Vec<i32>,
    pub pred: Vec<i32>,
}

fn fmt_dist(d: i32) -> String {
    if d == INF {
        "INF".to_string()
    } else {
        d.to_string()
    }
}

/// Faithful port of the `dijkstra` function shared by `Dijkstra_source.cpp`,
/// `Yen_source.cpp`, and (with different tag names) the inner dijkstra of
/// `Johnson_source.cpp`. Always runs to completion (no early exit at a target
/// node) so the emitted `<ds_tag>`/`<adj_tag>` trace matches the original
/// byte-for-byte. When `emit_source` is set, a `<source>` block containing
/// `source` is emitted before every `<ds_tag>` block, matching Johnson's inner
/// dijkstra which (oddly, but faithfully) re-emits it every iteration.
pub fn dijkstra_core(
    v: usize,
    adj: &[Vec<(usize, i32)>],
    source: usize,
    output: &mut String,
    ds_tag: &str,
    adj_tag: &str,
    emit_source: bool,
) -> DijkstraResult {
    let mut dist_to = vec![INF; v];
    let mut pred: Vec<i32> = vec![-1; v];
    let mut pq: BinaryHeap<Reverse<(i32, usize)>> = BinaryHeap::new();

    dist_to[source] = 0;
    pq.push(Reverse((0, source)));

    while !pq.is_empty() {
        if emit_source {
            output.push_str("<source>\n\t");
            output.push_str(&source.to_string());
            output.push_str("\n</source>\n");
        }

        // Dump a copy of the queue in ascending (dist, node) order, matching
        // repeated top()/pop() on a min-heap `priority_queue<..., greater<>>`.
        let mut dump: Vec<(i32, usize)> = pq.iter().map(|Reverse(x)| *x).collect();
        dump.sort();

        output.push_str(&format!("<{}>\n\t", ds_tag));
        for (d, n) in &dump {
            output.push_str(&format!("{},{} ", d, n));
        }
        output.push_str("\n\t");
        for &d in &dist_to {
            output.push_str(&fmt_dist(d));
            output.push(' ');
        }
        output.push_str("\n\t");
        for &p in &pred {
            output.push_str(&p.to_string());
            output.push(' ');
        }
        output.push_str(&format!("\n</{}>\n", ds_tag));

        let Reverse((dis, node)) = pq.pop().unwrap();

        output.push_str(&format!("<{}>\n\t{}, {}:", adj_tag, node, dis));
        for &(nb, w) in &adj[node] {
            output.push_str(&format!("\n\t{}, {}, ", nb, w));
            let mut relaxed = false;
            if dis + w < dist_to[nb] {
                dist_to[nb] = dis + w;
                pq.push(Reverse((dist_to[nb], nb)));
                pred[nb] = node as i32;
                relaxed = true;
            }
            if relaxed {
                output.push_str(&format!("1, {}, {}", pred[nb], dist_to[nb]));
            } else {
                output.push_str("0, -1, -1");
            }
        }
        output.push_str(&format!("\n</{}>\n", adj_tag));
    }

    DijkstraResult {
        dist: dist_to,
        pred,
    }
}

/// Port of `Yen_source.cpp`'s dijkstra wrapper: runs the full traversal above,
/// then reconstructs the path from `dest` back through `pred` until hitting
/// the -1 sentinel, returning it only if it actually starts at `source`.
pub fn dijkstra_path(
    v: usize,
    adj: &[Vec<(usize, i32)>],
    source: usize,
    dest: usize,
    output: &mut String,
) -> Vec<usize> {
    let result = dijkstra_core(v, adj, source, output, "ds", "adj", false);

    let mut path = Vec::new();
    let mut cur: i32 = dest as i32;
    while cur != -1 {
        path.push(cur as usize);
        cur = result.pred[cur as usize];
    }
    path.reverse();

    if !path.is_empty() && path[0] == source {
        path
    } else {
        Vec::new()
    }
}

use std::collections::VecDeque;

pub const INF: i32 = 1_000_000_000;

pub struct SpfaResult {
    pub dist: Vec<i32>,
    pub pred: Vec<i32>,
    /// Mirrors the C++ `spfa()` return value: true when no negative cycle was
    /// found, false the moment one is detected.
    pub no_negative_cycle: bool,
}

/// Port of `spfa()` in `SPFA_source.cpp`. Note: on detecting a negative
/// cycle the original returns mid-way through building the `<adj>` block for
/// the current node, leaving that block (and the response) truncated
/// without a closing tag — replicated here on purpose since that's the
/// actual shipped behavior the frontend parser already tolerates.
pub fn spfa(v: usize, adj: &[Vec<(usize, i32)>], source: usize, output: &mut String) -> SpfaResult {
    let n = v;
    let mut dist = vec![INF; n];
    let mut pred: Vec<i32> = vec![-1; n];
    let mut cnt = vec![0usize; n];
    let mut inqueue = vec![false; n];
    let mut queue: VecDeque<usize> = VecDeque::new();

    dist[source] = 0;
    queue.push_back(source);
    inqueue[source] = true;

    while !queue.is_empty() {
        output.push_str("<ds>\n\t");
        for &x in &queue {
            output.push_str(&format!("{} ", x));
        }
        output.push_str("\n\t");
        for &d in &dist {
            if d == INF {
                output.push_str("INF ");
            } else {
                output.push_str(&format!("{} ", d));
            }
        }
        output.push_str("\n\t");
        for &p in &pred {
            output.push_str(&format!("{} ", p));
        }
        output.push_str("\n\t");
        for &iq in &inqueue {
            output.push_str(if iq { "1 " } else { "0 " });
        }
        output.push_str("\n</ds>\n");

        let node = queue.pop_front().unwrap();
        inqueue[node] = false;

        output.push_str(&format!("<adj>\n\t{}, {}:", node, dist[node]));

        for &(to, len) in &adj[node] {
            output.push_str(&format!("\n\t{}, {}, ", to, len));

            let mut relaxed = false;
            if dist[node] + len < dist[to] {
                dist[to] = dist[node] + len;
                pred[to] = node as i32;
                if !inqueue[to] {
                    queue.push_back(to);
                    inqueue[to] = true;
                    cnt[to] += 1;
                    relaxed = true;
                    if cnt[to] > n {
                        return SpfaResult {
                            dist,
                            pred,
                            no_negative_cycle: false,
                        };
                    }
                }
            }

            if relaxed {
                output.push_str(&format!("1, {}, {}", pred[to], dist[to]));
            } else {
                output.push_str("0, -1, -1");
            }
        }
        output.push_str("\n</adj>\n");
    }

    SpfaResult {
        dist,
        pred,
        no_negative_cycle: true,
    }
}

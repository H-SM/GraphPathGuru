use std::time::Instant;

use std::collections::{BinaryHeap};

#[derive(Debug, Eq, PartialEq, Clone)]
struct State {
    cost: i32,
    node: usize,
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

fn dijkstra(
    V: usize,
    adj: &Vec<Vec<(usize, i32)>>,
    S: usize,
    D: usize,
    output: &mut String,
) -> Vec<usize> {
    let mut dist_to: Vec<i32> = vec![i32::MAX; V];
    let mut pred: Vec<i32> = vec![-1; V];
    let mut pq = BinaryHeap::new();

    dist_to[S] = 0;
    pq.push(State { cost: 0, node: S });

    while let Some(State { cost, node }) = pq.pop() {
        let copy = pq.clone(); // Copy the priority queue for output

        output.push_str("<ds>\n\t");
        for State { cost, node } in copy {
            output.push_str(&format!("{},{} ", cost, node));
        }
        output.push_str("\n\t");

        for d in &dist_to {
            if *d == i32::MAX {
                output.push_str("INF ");
            } else {
                output.push_str(&format!("{} ", d));
            }
        }

        output.push_str("\n\t");
        for &p in &pred {
            output.push_str(&format!("{} ", p));
        }

        output.push_str("\n</ds>\n");

        if node == D {
            break;
        }

        output.push_str("<adj>\n\t");
        output.push_str(&format!("{}, {}: ", node, cost));

        for &(v, w) in &adj[node] {
            output.push_str(&format!("\n\t{}, {}, ", v, w));
            let new_dist = cost + w;

            if new_dist < dist_to[v] {
                dist_to[v] = new_dist;
                pq.push(State { cost: new_dist, node: v });
                pred[v] = node as i32;
            }

            if new_dist < dist_to[v] {
                output.push_str(&format!("1, {}, {}", pred[v], dist_to[v]));
            } else {
                output.push_str("0, -1, -1");
            }
        }
        output.push_str("\n</adj>\n");
    }

    let mut path = Vec::new();
    let mut v: i32 = D as i32;
    while v != -1 {
        path.push(v as usize);
        v = pred[v as usize];
    }

    path.reverse();

    path
}

fn yen(
    V: usize,
    adj: &Vec<Vec<(usize, i32)>>,
    S: usize,
    D: usize,
    output: &mut String,
    k: usize,
) -> Vec<Vec<usize>> {
    let mut k_shortest_paths = Vec::new();

    for _ in 0..k {
        let path = dijkstra(V, adj, S, D, output);

        if path.is_empty() {
            break;
        }

        k_shortest_paths.push(path.clone());

        output.push_str("<path>");
        for (u, v) in path.iter().zip(path.iter().skip(1)) {
            output.push_str(&format!("\n\t{}, {}: ", u, v));
            if let Some(idx) = adj[*u]
                .iter()
                .position(|&(neighbor, _)| neighbor == *v)
            {
                adj[*u].remove(idx);
            }
        }
        output.push_str("\n</path>\n");
    }

    k_shortest_paths
}


fn make_graph(graph: &str) -> (usize, Vec<Vec<(usize, i32)>>) {
    let mut lines = Vec::new();

    for line in graph.lines() {
        lines.push(line.to_string());
    }

    let mut adj: Vec<Vec<(usize, i32)>> = vec![vec![]; lines.len()];
    for line in &lines {
        let mut iter = line.split('\n');
        if let Some(node_str) = iter.next() {
            let parts: Vec<&str> = node_str.split_whitespace().collect();
            let mut node: usize = 0;
            for i in 0..parts.len() {
                if i == 0 {
                    node = parts[i][..parts[i].len() - 1].parse::<usize>().unwrap() - 1;
                    continue;
                }
                let parsed_values: Vec<i32> = parts[i]
                    .split(',')
                    .map(|part| part.parse::<i32>().unwrap())
                    .collect();

                adj[node].push((parsed_values[0] as usize, parsed_values[1]));
            }
        }
    }

    (lines.len(), adj)
}

fn main() {
    let inp = String::from("0 123 456: 1,2 2,3\n1 789 123: 2,4 3,5\n2 456 789: 0,6 1,7");
    let gout = make_graph(&inp);
    let V = gout.0;
    let mut adj = gout.1;
    // TODO: ALL OF THIS NEEDS TO BE taken in from the request
    let S = 0;
    let k = 0;
    let D = V - 1;
    let mut output = String::from("");
    let mut dist = vec!(i32::MAX; V);
    let mut pred = vec!(-1; V);

    let start_time = Instant::now();
    yen(V, &adj, S, D, &mut output, k);
    let end_time = Instant::now();

    let duration = end_time - start_time;
    let time_taken = duration.as_micros();
    let mut E = 0;
    for (_, element) in adj.iter().enumerate() {
        E += element.len();
    }

    output += "<result>\n\t";

    output += &format!("{} {} {} {}", time_taken, V, E, S);

    for (_, element) in pred.iter().enumerate() {
        output += &format!("{}", element);
    }
    output += "\n\t";
    for (_, element) in dist.iter().enumerate() {
        output += &format!("{}", element);
    }
    output += "\n</result>\n";

}
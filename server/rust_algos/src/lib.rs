mod bellman_ford;
mod dijkstra;
mod floyd_warshall;
mod johnson;
mod spfa;
mod yen;

use wasm_bindgen::prelude::*;

// Surfaces real Rust panic messages (e.g. index-out-of-bounds) through
// console.error / the Node exception instead of an opaque
// "RuntimeError: unreachable" wasm trap.
#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

type Adj = Vec<Vec<(usize, i32)>>;

fn parse_adj(adj: JsValue) -> Adj {
    serde_wasm_bindgen::from_value(adj).expect("invalid adjacency list")
}

/// Wall-clock elapsed time since `start` (from `js_sys::Date::now()`),
/// expressed in the same units the original C++ used
/// (`std::chrono::microseconds`). `Date.now()` only has millisecond
/// resolution, so this is a cosmetic approximation of the original timing,
/// not a precise measurement — it's only ever displayed to the user, never
/// parsed back out by the frontend.
fn elapsed_micros(start: f64) -> i64 {
    ((js_sys::Date::now() - start) * 1000.0) as i64
}

fn count_edges(adj: &Adj) -> usize {
    adj.iter().map(|n| n.len()).sum()
}

/// Port of `Dijkstra_source.cpp`'s `main()`.
#[wasm_bindgen]
pub fn run_dijkstra(v: usize, adj: JsValue, source: usize) -> String {
    let adj = parse_adj(adj);
    let e = count_edges(&adj);
    let mut output = String::new();

    let start = js_sys::Date::now();
    let result = dijkstra::dijkstra_core(v, &adj, source, &mut output, "ds", "adj", false);
    let time_taken = elapsed_micros(start);

    output.push_str("<result>\n\t");
    output.push_str(&format!("{} {} {} {}\n\t", time_taken, v, e, source));
    for &p in &result.pred {
        output.push_str(&format!("{} ", p));
    }
    output.push_str("\n\t");
    for &d in &result.dist {
        output.push_str(&format!("{} ", d));
    }
    output.push_str("\n</result>");

    output
}

/// Port of `Bellman_source.cpp`'s `main()`.
#[wasm_bindgen]
pub fn run_bellman_ford(v: usize, adj: JsValue, source: usize) -> String {
    let adj = parse_adj(adj);
    let edges: Vec<(usize, usize, i32)> = adj
        .iter()
        .enumerate()
        .flat_map(|(u, ns)| ns.iter().map(move |&(nb, w)| (u, nb, w)))
        .collect();
    let e = edges.len();
    let mut output = String::new();

    let start = js_sys::Date::now();
    let result = bellman_ford::bellman_ford_core(
        v,
        &edges,
        source,
        v.saturating_sub(1),
        bellman_ford::INF,
        &mut output,
    );
    let negative_cycle =
        bellman_ford::has_negative_cycle(&edges, &result.dist, bellman_ford::INF);
    let time_taken = elapsed_micros(start);

    output.push_str("<result>\n\t");
    output.push_str(&format!(
        "{} {} {} {} {}\n\t",
        time_taken,
        v,
        e,
        source,
        negative_cycle as u8
    ));
    for &p in &result.pred {
        output.push_str(&format!("{} ", p));
    }
    output.push_str("\n\t");
    for &d in &result.dist {
        output.push_str(&format!("{} ", d));
    }
    output.push_str("\n</result>\n");

    output
}

/// Port of `SPFA_source.cpp`'s `main()`.
#[wasm_bindgen]
pub fn run_spfa(v: usize, adj: JsValue, source: usize) -> String {
    let adj = parse_adj(adj);
    let e = count_edges(&adj);
    let mut output = String::new();

    let start = js_sys::Date::now();
    let result = spfa::spfa(v, &adj, source, &mut output);
    let time_taken = elapsed_micros(start);

    output.push_str("<result>\n\t");
    output.push_str(&format!(
        "{} {} {} {} {}\n\t",
        time_taken,
        v,
        e,
        source,
        result.no_negative_cycle as u8
    ));
    for &p in &result.pred {
        output.push_str(&format!("{} ", p));
    }
    output.push_str("\n\t");
    for &d in &result.dist {
        output.push_str(&format!("{} ", d));
    }
    output.push_str("\n</result>\n");

    output
}

/// Port of `Floyd_warshall_source.cpp`'s `main()`.
#[wasm_bindgen]
pub fn run_floyd_warshall(v: usize, adj: JsValue, source: usize) -> String {
    let adj = parse_adj(adj);
    let mut matrix = floyd_warshall::build_matrix(v, &adj);
    let e = v * v; // matches the original's row-count-based (not edge-count) E
    let mut output = String::new();

    let start = js_sys::Date::now();
    floyd_warshall::floyd_warshall_core(&mut matrix, &mut output);
    let time_taken = elapsed_micros(start);

    output.push_str("<result>\n\t");
    output.push_str(&format!("{} {} {} {}\n\t", time_taken, v, e, source));
    for row in &matrix {
        for &cell in row {
            output.push_str(&format!("{} ", cell));
        }
        output.push_str("\n\t");
    }
    output.push_str("\n</result>\n");

    output
}

/// Port of `Johnson_source.cpp`'s `main()`.
#[wasm_bindgen]
pub fn run_johnson(v: usize, adj: JsValue) -> String {
    let adj = parse_adj(adj);
    let graph = floyd_warshall::build_matrix(v, &adj);
    let e: usize = graph
        .iter()
        .flat_map(|row| row.iter())
        .filter(|&&cell| cell != floyd_warshall::INF)
        .count();
    let mut output = String::new();

    let start = js_sys::Date::now();
    johnson::johnson_core(v, &graph, &mut output);
    let time_taken = elapsed_micros(start);

    output.push_str("<result>\n\t");
    output.push_str(&format!("{} {} {} {}\n", time_taken, v, e, v));
    output.push_str("</result>");

    output
}

/// Port of `Yen_source.cpp`'s `main()`.
#[wasm_bindgen]
pub fn run_yen(v: usize, adj: JsValue, source: usize, dest: usize, k: usize) -> String {
    let mut adj = parse_adj(adj);
    let mut output = String::new();

    let start = js_sys::Date::now();
    let k_paths = yen::yen(v, &mut adj, source, dest, k, &mut output);
    let time_taken = elapsed_micros(start);
    let e = count_edges(&adj); // computed after yen() removes used edges, matching the original

    output.push_str("<result>\n\t");
    output.push_str(&format!(
        "{} {} {} {} {}\n\t",
        time_taken, v, e, source, k
    ));
    for path in &k_paths {
        output.push_str("\n\t");
        for &vertex in path {
            output.push_str(&format!("{} ", vertex));
        }
    }
    output.push_str("\n</result>\n");

    output
}

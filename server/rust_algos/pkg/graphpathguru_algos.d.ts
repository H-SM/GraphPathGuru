/* tslint:disable */
/* eslint-disable */

export function init_panic_hook(): void;

/**
 * Port of `Bellman_source.cpp`'s `main()`.
 */
export function run_bellman_ford(v: number, adj: any, source: number): string;

/**
 * Port of `Dijkstra_source.cpp`'s `main()`.
 */
export function run_dijkstra(v: number, adj: any, source: number): string;

/**
 * Port of `Floyd_warshall_source.cpp`'s `main()`. Also reconstructs the
 * source->destination shortest path via a successor matrix maintained
 * alongside the (faithfully-ported) distance computation — see
 * `floyd_warshall::build_next_matrix` — and appends it as a `<path>` block
 * after `</result>` (space-separated node ids, empty if unreachable).
 */
export function run_floyd_warshall(v: number, adj: any, source: number, destination: number): string;

/**
 * Port of `Johnson_source.cpp`'s `main()`.
 */
export function run_johnson(v: number, adj: any): string;

/**
 * Port of `SPFA_source.cpp`'s `main()`.
 */
export function run_spfa(v: number, adj: any, source: number): string;

/**
 * Port of `Yen_source.cpp`'s `main()`.
 */
export function run_yen(v: number, adj: any, source: number, dest: number, k: number): string;

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
 * Port of `Floyd_warshall_source.cpp`'s `main()`.
 */
export function run_floyd_warshall(v: number, adj: any, source: number): string;

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

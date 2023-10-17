TODO/WIP:
Path to a specific node from source will be made as a function call later.


in dijkstra, there are 2 main "loops":
- Priority Queue loops
- Adjecent elements loops

PQ loops will be demarked by a "<pq>". They will be ended by a </pq>. Example:
if pq = {1, 2, 3, 4, 5}
<pq>
    1, 2, 3, 4, 5
</pq>

Adjacent nodes to some "focus" node will be formatted in the following format:

<adj>
    current node, current distance: 
    check node, check distance, comparision result, new_pred[current node], new_dist[check_node]
</adj>

Note that line 11 will be looped for all adj nodes.
int dtypes: current node, curent distance, check node, check distance, new_pred[current node], new_dist[check_node].

Boolean dtyepes: Comparision result

NOTE: new_pred[current node], new_dist[check_node] will be -1 if comparision result is false.



For results:
<result>
    number of nodes, source node
    (predecessor list)
    (distance from source of each node)
</result>

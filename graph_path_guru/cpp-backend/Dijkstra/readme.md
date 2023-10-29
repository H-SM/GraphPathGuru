(view this as a txt for correct formatting)
TODO/WIP:
Path to a specific node from source will be made as a function call later.


in dijkstra, there are 2 main things that change:
- Values in data structures
- Adjecent elements considered


Data structures will be displayed using the <ds> tag. It will contain data in the following format:


if pq = {{1,1} {2,2}, {3,1} , {4,4}, {5,10}}
if dist = {INF, INF, 10, INF, -1}
if pred = {-1, -1, 4, -1, -1}

(pq is first line, dist is second line, pred is third line)
<ds>
    1,1 2,2 3,1 4,4 5,10    
    INF INF 10 INF -1
    -1 -1 4 -1 -1
</ds>



Adjacent nodes to some "focus" node will be formatted in the following format:


<adj>
    current node, current distance: 
    check node, check distance, comparision result, new_pred[current node], new_dist[check_node]    ***
</adj>


***: This line will be looped for all the adjacent nodes


int dtypes: current node, curent distance, check node, check distance, new_pred[current node], new_dist[check_node].

Boolean dtyepes: Comparision result


NOTE: new_pred[current node], new_dist[check_node] will be -1 if comparision result is false.



For results:
<result>
    number of nodes, source node
    (predecessor list)
    (distance from source of each node)
</result>

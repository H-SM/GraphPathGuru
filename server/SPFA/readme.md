
Adjacent nodes to some "focus" node will be formatted in the following format:


<adj>
    current node, current distance: 
    check node, check distance, comparision result, new_pred[check_node], new_dist[check_node]    ***
</adj>


***: This line will be looped for all the adjacent nodes


int dtypes: current node, curent distance, check node, check distance, new_pred[current node], new_dist[check_node].

Boolean dtyepes: Comparision result

<result> has:
- dist from source to all nodes in dist array (line 1)
- precedence array to reconstruct path (line 2)
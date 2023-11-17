// setting all routes related to file read-write operations 
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Graph = require("../models/graph.js");

//ROUTE 1:GET all the graph history of the validated user : GET "/api/graph/fetchallnotes". login required
router.get("/fetchallgraphs", fetchuser, async (req, res) => {
  try {
    const graphs = await Graph.find({ user: req.user.id });
    res.json(graphs);
  } catch (err) {
    console.error(err);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
  }
});
//ROUTE 2:add a new graphs : POST "/api/graph/addgraph". login required
router.post("/addgraph", fetchuser,[
    body("result", "Enter a valid result").isLength({ min: 1 }),
    body("graph", "Enter a valid graph").isLength({ min: 1 }),
    body("name", "Enter a valid unique name").isLength({ min: 1 }),
    body("favourite", "Enter a valid favourite detail").isBoolean(),
  ],
  async (req, res) => {
    try {
    const { result, graph, name, favourite } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //look over unique naming
    const existingGraph = await Graph.findOne({ name, user: req.user.id });
    if (existingGraph) {
      return res.status(400).json({ status: "validation error", errors: "Name must be unique for the user" });
    }
    let graphFields = {
      result,
      graph,
      name, 
      favourite,
      user: req.user.id,
    };

      const graphy = new Graph(graphFields);
      const savedGraph = await graphy.save();
      res.json(savedGraph);
    } catch (err) {
      console.error(err);
      res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
});
router.put('/updatefavgraph/:id', fetchuser,
  async (req, res) => {
    try {
    const { favourite } = req.body;
    const newGraph = {};
    newGraph.favourite = favourite;
    
    console.log(newGraph);

    let graph =await Graph.findById(req.params.id);
    if(!graph) res.status(404).send("NOT FOUND!");

    if(graph.user.toString() !== req.user.id){
        return res.status(401).send("NOT ALLOWED");
    }

    const graph_upd = await Graph.findByIdAndUpdate(req.params.id, {$set : newGraph},{new : true});
    res.json(graph_upd);
    } catch (err) {
    console.error(err);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
  }
  }
);

router.get('/getgraph/:id',
  async (req, res) => {
    try {
    //find the graph to be given
    let graph =await Graph.findById(req.params.id);
    if(!graph) res.status(404).send("NOT FOUND!");

    res.json({"success" : "graph given", "graph" : graph});
    } catch (err) {
    console.error(err);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
  }
  }
);

module.exports = router;

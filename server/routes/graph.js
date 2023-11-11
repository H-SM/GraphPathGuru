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
  ],
  async (req, res) => {
    try {
    const { result, graph } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    let graphFields = {
      result,
      graph,
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

module.exports = router;

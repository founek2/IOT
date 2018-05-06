var express = require("express");
var router = express.Router();
const Sensors = require("../bin/models/sensors");
var mongoose = require("mongoose");

/* GET home page. */
router.post("/initState", function(req, res, next) {
      /*  var id = mongoose.Types.ObjectId('5aa7ab6599cc091442dabede');
  Sensors.findById(id, {'data':{'$slice':-1}, apiKey: 0}).then((obj) => {
    console.log(obj)
    res.render('index', obj);
  })*/
      Sensors.find({}, { data: { $slice: -1 }, apiKey: 0 }, function(err, docs) {
            if (!err) {
                  res.send({ docs });
            } else {
                  throw err;
            }
      });
});

router.post("/showGraph", function(req, res, next) {
      const {
            id,
            sensor,
            targetTime,
      } = req.body;
      console.log(req.body)
      Sensors.aggregate([
            //             { $project : { _id : id, data : 1, title: 1 } },
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            { $unwind: "$data" },
            { $match: { "data.created": { $gte: new Date(targetTime) } } },
            { $group: { _id: "$_id", data: { $push: "$data" }, title: { $last: "$title" } } }
      ]).then(docs => {
            console.log(docs);
            const doc = docs[0];
            if (doc) {
                  const newData = doc.data.map(item => Number(item[sensor].value));
                  const today = new Date();
                  today.setMinutes(0);
                  today.setHours(0);
                  const labels = doc.data.map(item => item.created);
                  res.send({ data: newData, labels });
            } else {
                  res.send({ data: [] });
            }
      });
});

module.exports = router;

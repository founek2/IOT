var express = require("express");
var router = express.Router();
const Sensors = require("../bin/models/sensors");
var mongoose = require("mongoose");

/* GET home page. */
router.get("/", function(req, res, next) {
  /*    if (!req.query.period) {
            var id = mongoose.Types.ObjectId(req.query.id);
            Sensors.findOne(
                  { _id: id },
                  {
                        data: { $slice: -Math.abs(req.query.numberOfRecords) },
                        apiKey: 0,
                        _id: 0
                  },
                  function(err, doc) {
                        if (!err) {
                              const newData = doc.data.map(item =>
                                    Number(item[req.query.sensor].value)
                              );
                              const labels = doc.data.map(item => {
                                    const time = new Date(item.created);
                                    return (
                                          time.getHours() +
                                          ":" +
                                          ("0" + time.getMinutes()).slice(-2)
                                    );
                              });
                              res.render("graph", {
                                    data: newData,
                                    title: doc.title,
                                    labels,
                                    numberOfRecords: req.query.numberOfRecords,
                                    id,
                                    sensor: req.query.sensor
                              });
                        } else {
                              throw err;
                        }
                  }
            );
      } */

            var id = mongoose.Types.ObjectId(req.query.id);
            console.log(new Date(Number(req.query.targetTime)))
            Sensors.aggregate(
                  [     
           //             { $project : { _id : id, data : 1, title: 1 } },
                        {$match: {"_id": id}},
                        {$unwind: "$data" },
                        {$match: {"data.created": {$gte: new Date(Number(req.query.targetTime))}}},
                        {$group: {_id: "$_id", data: {$push: "$data"}, title: {$last: "$title"}} }
                    ]
            ).then((docs) => {
                 console.log(docs)
                  const doc = docs[0];
                  if (doc){
                  const newData = doc.data.map(item =>
                        Number(item[req.query.sensor].value)
                  );
                  const today = new Date();
                  today.setMinutes(0);
                  today.setHours(0);
                  const labels = doc.data.map(item => {
                        const time = new Date(item.created);

                        if(time < today) {
                              return (
                                    time.getDate() + ". "+
                                    (time.getMonth() + 1) + ". " +
                                    time.getHours() +
                                    ":" +
                                    ("0" + time.getMinutes()).slice(-2)
                              );
                        }else {
                              return (
                                    time.getHours() +
                                    ":" +
                                    ("0" + time.getMinutes()).slice(-2)
                              );
                        }
                        
                  });
                  if(req.query.api == 1){
                        res.send({data: newData, labels})
                  }else {
                        res.render("graph", {
                              data: newData,
                              title: doc.title,
                              numberOfRecords: req.query.numberOfRecords,
                              id,
                              labels,
                              sensor: req.query.sensor
                        });
                  }
            }else {
                  if(req.query.api == 1){
                        res.send({data: []})
                  }else {
                        res.render("graph", {
                              data: [],
                              labels: [],
                              title: "data nejsou k dispozici",
                              numberOfRecords: req.query.numberOfRecords,
                              id,
                              sensor: req.query.sensor
                        });
                  }
            }
            })
});

function daysInMonth(d) {
      return new Date(d.getFullYear(), d.getMonth + 1, 0).getDate();
}
module.exports = router;

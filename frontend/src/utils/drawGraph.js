import Chart from "chart.js";

export default (data, labels, canvas) => {
      var myLineChart = new Chart(canvas, {
            type: "line",
            fill: false,
            data: {
                  labels: labels,
                  datasets: [
                        {
                              data: data,
                              label: "Teplota",
                              borderColor: "#3e95cd",
                              fill: false
                        }
                  ]
            },
            options: {
                  scaleShowVerticalLines: false,
                  responsive: true,
                  maintainAspectRatio: true,
                  layout: {
                        padding: {
                              left: 0,
                              right: 0,
                              top: 20,
                              bottom: 20
                        }
                  },
                  scales: {
                        xAxes: [
                              {
                                    stacked: true,
                                    afterTickToLabelConversion: function(data) {
                                          console.log("old", data);
                                          var xLabels = data.ticks;
                                          console.log("length " + xLabels.length);
                                          const numberOfLabels = 15;
                                          if (xLabels.length > numberOfLabels) {
                                                const coef = Math.floor(xLabels.length / numberOfLabels);
                                                console.log("coef " + coef);
                                                let counter = 0;
                                                xLabels.forEach(function(labels, i) {
                                                      //  console.log(i)
                                                      if (i === coef * counter) {
                                                            console.log("if" + i);
                                                         //   xLabels[i] = "";
                                                            counter++;
                                                      }  else {
                                                            xLabels[i] = "";
                                                      }
                                                });
                                                console.log("new", data);
                                                return data;
                                          }
                                    },
                                    gridLines: {
                                          display: false
                                    },
                                    scaleLabel: {
                                          display: true,
                                          labelString: "Čas"
                                    },
                                    stacked: false,
                                    beginAtZero: true,
                                    /*               ticks: {
                                    stepSize: 1,
                                    min: 0,
                                    autoSkip: false
                              }*/
                                    ticks: {
                                          autoSkip: false
                                    }
                              }
                        ],
                        yAxes: [
                              {
                                    display: true,
                                    scaleLabel: {
                                          display: true,
                                          labelString: "Hodnota"
                                    },
                                    ticks: {
                                          suggestedMin: 0
                                    }
                              }
                        ]
                  }
            }
      });
};

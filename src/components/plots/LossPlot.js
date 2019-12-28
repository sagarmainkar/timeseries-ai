import React, { useRef, useEffect } from "react";
import Chart from "chart.js";
import Container from "@material-ui/core/Container";

const LossPlot = props => {
  let chart = useRef(null);
  const chartColors = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)"
  };

  const chartConfig = useEffect(() => {
    const data = props.data;

    const X = data["X"];
    const y = data["y"];
    const X_label = data["X_label"];
    const y_label = data["y_label"];

    let ctx = document.getElementById("lossPlot");
    if (!chart.current) {
      chart.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: X,
          datasets: [
            {
              label: X_label,
              backgroundColor: chartColors.green,
              borderColor: chartColors.green,
              data: y,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          fill: false,
          title: {
            display: true,
            text: "Loss Plot"
          },
          tooltips: {
            mode: "index",
            intersect: false
          },
          hover: {
            mode: "nearest",
            intersect: true
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: X_label
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: y_label
                }
              }
            ]
          }
        }
      });
    } else {
      chart.current.clear();
      chart.current.data.labels = X;
      chart.current.data.datasets[0].data = y;

      chart.current.update();
    }
  });

  return (
    <Container>
      <canvas id="lossPlot" />
    </Container>
  );
};

export default LossPlot;

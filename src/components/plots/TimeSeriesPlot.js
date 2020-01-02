import React, { useEffect, useRef } from "react";
import Container from "@material-ui/core/Container";
import Chart from "chart.js";
import {useId} from "react-id-generator";

const TimeSeriesPlot = props => {
  const [plotId] = useId();

  const chartColors = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)"
  };
  let chart = useRef(null);

  const chartConfig = useEffect(() => {
    const datasets = props.datasets;

    const X = datasets[0]["X"];
    const y = datasets[0]["y"];
    const X_label = datasets[0]["X_label"];
    const y_label = datasets[0]["y_label"];

    let ctx = document.getElementById(plotId);
    if (!chart.current) {
      chart.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: X,
          datasets: [
            {
              label: X_label,
              backgroundColor: chartColors.red,
              borderColor: chartColors.red,
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
            text: "Series Plot"
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
                type: "time",
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
      chart.current.data.datasets[0] = {
        label: "Actual",
        backgroundColor: chartColors.red,
        borderColor: chartColors.red,
        data: y,
        fill: false
      };
    }
      if (datasets.length > 1) {
        chart.current.data.datasets[1] = {
          label: "Predicted",
          backgroundColor: chartColors.green,
          borderColor: chartColors.green,
          data: datasets[1]["y"],
          fill: false
        };
        chart.current.options.title.text = "Actual vs Predicted";
      } else {
        chart.current.data.datasets[1] = {};
      }

      chart.current.options.scales.xAxes[0].scaleLabel.labelString = X_label;
      chart.current.options.scales.yAxes[0].scaleLabel.labelString = y_label;

      chart.current.update();
    
  });

  return (
    <Container>
      <canvas id={plotId} />
    </Container>
  );
};

export default TimeSeriesPlot;

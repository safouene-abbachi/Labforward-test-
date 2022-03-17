import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { useDataStreamContextContext } from '../context/AppContext';

Chart.register(StreamingPlugin, DataLabelsPlugin);

const StreamData = () => {
  const { state } = useDataStreamContextContext();

  const onRefresh = (stream) => {
    stream.datasets.forEach((dataset) => {
      dataset.data.push({
        x: Date.now(),
        y:
          stream.style === 'line'
            ? (Math.random() * 10).toFixed()
            : (Math.random() * 1).toFixed(),
      });
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      {state.map((datasets) => {
        let data = datasets;
        let options = {
          scales: {
            xAxes: {
              type: 'realtime',
              realtime: {
                onRefresh: () => onRefresh(datasets),
                duration: 20000,
                delay: 1000,
                refresh: 1000,
              },
            },

            yAxes: {
              title: {
                display: true,
                text: 'Value',
              },
              scaleLabel: {
                display: true,
                fontFamily: 'Arial',
                labelString: 'Moment',
                fontSize: 20,
                fontColor: '#6c757d',
              },
              ticks: {
                max: 20,
                min: 0,
              },
            },
          },
          plugins: {
            datalabels: {
              backgroundColor: (context) => context.dataset.borderColor,
              padding: 4,
              borderRadius: 4,
              clip: true,
              color: 'white',
              font: {
                weight: 'bold',
              },
              formatter: (value) => value.y,
            },
          },
        };
        if (datasets.style === 'line') {
          return (
            <div className="chart__box" key={datasets.title}>
              <h3>Click on color boxes to choose a stream</h3>
              <Line data={data} options={options} />
            </div>
          );
        } else {
          return (
            <div className="chart__box" key={datasets.title}>
              <h3>Click on color boxes to choose a stream</h3>
              <Bar data={data} options={options} />
            </div>
          );
        }
      })}
    </div>
  );
};

export default StreamData;

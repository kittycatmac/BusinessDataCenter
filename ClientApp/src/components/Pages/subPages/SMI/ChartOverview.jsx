import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
// API calls
import { getSMILocations } from '../../../../services/InventoryAPIs/smiLocationsTableApi';
import { getSheetMaterialInventory } from '../../../../services/InventoryAPIs/smiApi';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  registerables as registerablesJS
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(...registerablesJS);
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const ChartOverview = () => {
  const [AllData, setAllData] = useState([]);
  const [SMIQoh, setSMIQoh] = useState([]);
  const [ChartData, setChartData] = useState([]);
  const [smiQohLocations, setsmiQohLocations] = useState([]);
  const [totalOhLocations, setTotalOhLocations] = useState([]); 
  const [totalDiffLocations, setTotalDiffLocations] = useState([]);

  const labels = ['Hallway', 'Warehouse', 'Digital Room', 'Landa', 'Trailer', 'Floor'];

  const data = {
    labels,
    datasets: [
        {
        type: 'line',
        label: 'Change between current Qoh and incoming Qoh',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: totalDiffLocations.map(x => x.diff),
        },
        {
        type: 'bar',
        label: 'Incoming new Qoh',
        backgroundColor: 'rgb(75, 192, 192)',
        data: totalOhLocations.map(x => x.totalOh),
        borderColor: 'white',
        borderWidth: 2,
        },
        {
        type: 'bar',
        label: 'Current Qoh',
        backgroundColor: 'rgb(53, 162, 235)',
        data: smiQohLocations.map(x => x.smiQoh),
        borderColor: 'white',
        borderWidth: 2,
        },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    (async () => { 
        try {
            const json = await getSMILocations();
            setAllData(json);
        } catch (error) {
            console.log("error", error);
        }
    })();
  }, []);

  // gets most current smiQoh from JMS
  useEffect(() => {
    (async () => { 
        try {
            const json = await getSheetMaterialInventory();
            let obj1 = {};
            json.forEach((obj) => {
                obj1[obj.smiId] = obj.smiQoh;
            });
            const arr =[];
            arr.push(obj1);
            setSMIQoh(arr);
        } catch (error) {
            console.log("error", error);
        }
    })();
  }, [AllData]);

  // adds up duplicate smiId with totals, add current smiQoh, locations
  useEffect(() => {

    var holder = {};
    AllData.forEach(function(d) {
        if (holder.hasOwnProperty(d.smiId)) {
            holder[d.smiId] = holder[d.smiId] + d.totalOh;
        } else {
            holder[d.smiId] = d.totalOh;
        }
    });

    const obj1 = [];

    for (var prop in holder) {
        obj1.push({ smiId: prop, totalOh: holder[prop]});
    }

    obj1.forEach(obj => {
      SMIQoh.forEach(function(d) {
        for(const p in d) {
          if(p === obj.smiId) {
            var rounded = d[p];
            obj.smiQoh = rounded.toFixed();
          }
        }
      });
    });

    obj1.forEach(obj => {
      AllData.forEach(function(d) {
        //console.log(d);
        if(Number(obj.smiId) === d.smiId) {
          //console.log(d.location)
          obj['location'] = d.location;
          obj['smiQoh'] = d.smiQoh;
        }
      });
    });

    // breaks down the differance from current jms to new smiQoh
    obj1.forEach(obj => {
        var dif = 0;
        var TF;
        dif = Math.floor(obj.totalOh) - obj.smiQoh;
        if(Math.sign(dif) === -1) {
            TF = false
        } else {
            TF = true;
        }
        obj.Diff = dif;
        obj.Bool = TF;
    });
    // set AllData for charts
    setChartData(obj1);
  }, [AllData, SMIQoh]);

  useEffect(() => {

    const objHolder1 = {};
    ChartData.forEach(obj => {
      if(objHolder1.hasOwnProperty(obj.location)) {
        objHolder1[obj.location] = objHolder1[obj.location] + obj.smiQoh;
      } else {
        objHolder1[obj.location] = obj.smiQoh;
      }
    });

    const Arr1 = [];
    for (var prop in objHolder1) {
      Arr1.push({ label: prop, smiQoh: objHolder1[prop]});
    }

    //console.log(Arr1);
    setsmiQohLocations(Arr1);

    const objHolder2 = {};
    ChartData.forEach(obj => {
      if(objHolder2.hasOwnProperty(obj.location)) {
        objHolder2[obj.location] = objHolder2[obj.location] + obj.totalOh;
      } else {
        objHolder2[obj.location] = obj.totalOh;
      }
    });

    const Arr2 = [];
    for (var prop in objHolder2) {
      Arr2.push({ label: prop, totalOh: objHolder2[prop]});
    }

    //console.log(Arr2);
    setTotalOhLocations(Arr2);

    const objHolder3 = {};
    ChartData.forEach(obj => {
      if(objHolder3.hasOwnProperty(obj.location)) {
        objHolder3[obj.location] = objHolder3[obj.location] + obj.Diff;
      } else {
        objHolder3[obj.location] = obj.Diff;
      }
    });

    const Arr3 = [];
    for (var prop in objHolder3) {
      Arr3.push({ label: prop, diff: objHolder3[prop]});
    }

    //console.log(Arr3);
    setTotalDiffLocations(Arr3);

  },[ChartData]);

  return (
    <div className="center"> 
      <div className="row"> 
      <div className='col-2'></div>
        <div className='col-8'>
          <Grid 
            style={{width: '100%', height: '600px'}}
            className="mt-5"
            >
              <Chart
                  type='bar'
                  options={options}
                  data={data}
              />
          </Grid>
        </div>
        <div className='col-2'></div>
      </div>
    </div>
  );
};
export default ChartOverview;
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
// API calls
import { getSMILocations } from '../../../../../services/InventoryAPIs/smiLocationsTableApi';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import {
  Chart
} from 'react-chartjs-2';


ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const ChartLocations = () => {
    const [AllData, setAllData] = useState([]);
    const [hallwayData, setHallwayData] = useState([]);
    const [warehouseData, setWarehouseData] = useState([]);
    const [digitalRoomData, setDigitalRoomData] = useState([]);
    const [landaData, setLandaData] = useState([]);
    const [trailerData, setTrailerData] = useState([]);
    const [floorData, setFloorData] = useState([]);

    const dataHallway = {
        labels : hallwayData.map(x => x.label),
        datasets: [
            {
            type: 'bubble',
            label: 'Total Loose Qty',
            backgroundColor: 'rgb(75, 192, 192)',
            data: hallwayData.map(x => x.totalLooseQty),
            },
            {
            type: 'bubble',
            label: 'Total Container Qty',
            backgroundColor: 'rgb(53, 162, 235)',
            data: hallwayData.map(x => x.totalContainerQty),
            },
        ],
    };

    const dataWarehouse = {
        labels : warehouseData.map(x => x.label),
        datasets: [
            {
            type: 'bubble',
            label: 'Total Loose Qty',
            backgroundColor: 'rgb(75, 192, 192)',
            data: warehouseData.map(x => x.totalLooseQty),
            },
            {
            type: 'bubble',
            label: 'Total Container Qty',
            backgroundColor: 'rgb(53, 162, 235)',
            data: warehouseData.map(x => x.totalContainerQty),
            },
        ],
    };

    const dataDigitalRoom = {
        labels : digitalRoomData.map(x => x.label),
        datasets: [
            {
            type: 'bubble',
            label: 'Total Loose Qty',
            backgroundColor: 'rgb(75, 192, 192)',
            data: digitalRoomData.map(x => x.totalLooseQty),
            },
            {
            type: 'bubble',
            label: 'Total Container Qty',
            backgroundColor: 'rgb(53, 162, 235)',
            data: digitalRoomData.map(x => x.totalContainerQty),
            },
        ],
    };

    const dataLanda = {
        labels : landaData.map(x => x.label),
        datasets: [
            {
            type: 'bubble',
            label: 'Total Loose Qty',
            backgroundColor: 'rgb(75, 192, 192)',
            data: landaData.map(x => x.totalLooseQty),
            },
            {
            type: 'bubble',
            label: 'Total Container Qty',
            backgroundColor: 'rgb(53, 162, 235)',
            data: landaData.map(x => x.totalContainerQty),
            },
        ],
    };

    const dataTrailer = {
        labels : trailerData.map(x => x.label),
        datasets: [
            {
            type: 'bubble',
            label: 'Total Loose Qty',
            backgroundColor: 'rgb(75, 192, 192)',
            data: trailerData.map(x => x.totalLooseQty),
            },
            {
            type: 'bubble',
            label: 'Total Container Qty',
            backgroundColor: 'rgb(53, 162, 235)',
            data: trailerData.map(x => x.totalContainerQty),
            },
        ],
    };

    const dataFloor = {
        labels : floorData.map(x => x.label),
        datasets: [
            {
            type: 'bubble',
            label: 'Total Loose Qty',
            backgroundColor: 'rgb(75, 192, 192)',
            data: floorData.map(x => x.totalLooseQty),
            },
            {
            type: 'bubble',
            label: 'Total Container Qty',
            backgroundColor: 'rgb(53, 162, 235)',
            data: floorData.map(x => x.totalContainerQty),
            },
        ],
    };

    const options = {
        radius: 10,
        interaction: {
            intersect: false,
            mode: 'index',
          },
        elements: {
            point: {
                pointStyle: 'rectRounded',
            }
        },
        scales: {
            y: {
              title: {
                display: true,
                text: '# of Sheets'
              }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    },
                    footer: function(items) {
                        let totalOH = 0;
                        items.forEach(function(item) {
                            totalOH += item.parsed.y;
                        });
                        return 'Total Sheets ' + totalOH;
                    }
                }
            }
        }  
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

    // when AllData changes this grabs all data per location and adds up totals per bwt
    useEffect(() => {

        // --------> Hallway
        var Hallway = AllData.filter(obj => {
            return obj.location === 'Hallway';
        });
        
        // adds up totalLooseQty per Bwt
        var holderLoose1 = {};
        Hallway.forEach(function(d) {
            if (holderLoose1.hasOwnProperty(d.smiBwt)) {
                holderLoose1[d.smiBwt] = holderLoose1[d.smiBwt] + Math.round(d.totalLooseQty);
            }
            else {
                holderLoose1[d.smiBwt] = Math.round(d.totalLooseQty);
            }
        });

        var ArrLoose1 = [];
        for(var prop in holderLoose1 ) {
            ArrLoose1.push({label: prop, totalLooseQty: holderLoose1[prop]})
        };

        // adds up totalQty per Bwt
        var holderContainers1 = {};
        Hallway.forEach(function(d) {
            if (holderContainers1.hasOwnProperty(d.smiBwt)) {
                holderContainers1[d.smiBwt] = holderContainers1[d.smiBwt] + d.totalQty;
            }
            else {
                holderContainers1[d.smiBwt] = d.totalQty;
            }
        });

        var ArrContainers1 = []
        for(var prop in holderContainers1 ) {
            ArrContainers1.push({label: prop, totalContainerQty: holderContainers1[prop]})
        };

        // merges ArrLoose and ArrContainers on label key (Bwt)
        const mergedData1 = ArrLoose1.map(data=>({
            ...data,
            ...ArrContainers1.find(newData=>newData.label == data.label)
        }));
        setHallwayData(mergedData1);


        // --------> Warehouse
        var Warehouse = AllData.filter(obj => {
            return obj.location === 'Warehouse';
        });
        
        // adds up totalLooseQty per Bwt
        var holderLoose2 = {};
        Warehouse.forEach(function(d) {
            if (holderLoose2.hasOwnProperty(d.smiBwt)) {
                holderLoose2[d.smiBwt] = holderLoose2[d.smiBwt] + Math.round(d.totalLooseQty);
            }
            else {
                holderLoose2[d.smiBwt] = Math.round(d.totalLooseQty);
            }
        });

        var ArrLoose2 = [];
        for(var prop in holderLoose2 ) {
            ArrLoose2.push({label: prop, totalLooseQty: holderLoose2[prop]})
        };

        // adds up totalQty per Bwt
        var holderContainers2 = {};
        Warehouse.forEach(function(d) {
            if (holderContainers2.hasOwnProperty(d.smiBwt)) {
                holderContainers2[d.smiBwt] = holderContainers2[d.smiBwt] + d.totalQty;
            }
            else {
                holderContainers2[d.smiBwt] = d.totalQty;
            }
        });

        var ArrContainers2 = []
        for(var prop in holderContainers2 ) {
            ArrContainers2.push({label: prop, totalContainerQty: holderContainers2[prop]})
        };

        // merges ArrLoose and ArrContainers on label key (Bwt)
        const mergedData2 = ArrLoose2.map(data=>({
            ...data,
            ...ArrContainers2.find(newData=>newData.label == data.label)
        }));
        setWarehouseData(mergedData2);


        // --------> DigitalRoom
        var DigitalRoom = AllData.filter(obj => {
            return obj.location === 'DigitalRoom';
        });
        
        // adds up totalLooseQty per Bwt
        var holderLoose3 = {};
        DigitalRoom.forEach(function(d) {
            if (holderLoose3.hasOwnProperty(d.smiBwt)) {
                holderLoose3[d.smiBwt] = holderLoose3[d.smiBwt] + Math.round(d.totalLooseQty);
            }
            else {
                holderLoose3[d.smiBwt] = Math.round(d.totalLooseQty);
            }
        });

        var ArrLoose3 = [];
        for(var prop in holderLoose3 ) {
            ArrLoose3.push({label: prop, totalLooseQty: holderLoose3[prop]})
        };

        // adds up totalQty per Bwt
        var holderContainers3 = {};
        DigitalRoom.forEach(function(d) {
            if (holderContainers3.hasOwnProperty(d.smiBwt)) {
                holderContainers3[d.smiBwt] = holderContainers3[d.smiBwt] + d.totalQty;
            }
            else {
                holderContainers3[d.smiBwt] = d.totalQty;
            }
        });

        var ArrContainers3 = []
        for(var prop in holderContainers3 ) {
            ArrContainers3.push({label: prop, totalContainerQty: holderContainers3[prop]})
        };

        // merges ArrLoose and ArrContainers on label key (Bwt)
        const mergedData3 = ArrLoose3.map(data=>({
            ...data,
            ...ArrContainers3.find(newData=>newData.label == data.label)
        }));
        setDigitalRoomData(mergedData3);


        // --------> Landa
        var Landa = AllData.filter(obj => {
            return obj.location === 'Landa';
        });
        
        // adds up totalLooseQty per Bwt
        var holderLoose4 = {};
        Landa.forEach(function(d) {
            if (holderLoose4.hasOwnProperty(d.smiBwt)) {
                holderLoose4[d.smiBwt] = holderLoose4[d.smiBwt] + Math.round(d.totalLooseQty);
            }
            else {
                holderLoose4[d.smiBwt] = Math.round(d.totalLooseQty);
            }
        });

        var ArrLoose4 = [];
        for(var prop in holderLoose4 ) {
            ArrLoose4.push({label: prop, totalLooseQty: holderLoose4[prop]})
        };

        // adds up totalQty per Bwt
        var holderContainers4 = {};
        Landa.forEach(function(d) {
            if (holderContainers4.hasOwnProperty(d.smiBwt)) {
                holderContainers4[d.smiBwt] = holderContainers4[d.smiBwt] + d.totalQty;
            }
            else {
                holderContainers4[d.smiBwt] = d.totalQty;
            }
        });

        var ArrContainers4 = []
        for(var prop in holderContainers4 ) {
            ArrContainers4.push({label: prop, totalContainerQty: holderContainers4[prop]})
        };

        // merges ArrLoose and ArrContainers on label key (Bwt)
        const mergedData4 = ArrLoose4.map(data=>({
            ...data,
            ...ArrContainers4.find(newData=>newData.label == data.label)
        }));
        setLandaData(mergedData4);


        // --------> Trailer 
        var Trailer = AllData.filter(obj => {
            return obj.location === 'Trailer';
        });

        // adds up totalLooseQty per Bwt
        var holderLoose5 = {};
        Trailer.forEach(function(d) {
            if (holderLoose5.hasOwnProperty(d.smiBwt)) {
                holderLoose5[d.smiBwt] = holderLoose5[d.smiBwt] + Math.round(d.totalLooseQty);
            }
            else {
                holderLoose5[d.smiBwt] = Math.round(d.totalLooseQty);
            }
        });

        var ArrLoose5 = [];
        for(var prop in holderLoose5 ) {
            ArrLoose5.push({label: prop, totalLooseQty: holderLoose5[prop]})
        };

        // adds up totalQty per Bwt
        var holderContainers5 = {};
        Trailer.forEach(function(d) {
            if (holderContainers5.hasOwnProperty(d.smiBwt)) {
                holderContainers5[d.smiBwt] = holderContainers5[d.smiBwt] + d.totalQty;
            }
            else {
                holderContainers5[d.smiBwt] = d.totalQty;
            }
        });

        var ArrContainers5 = []
        for(var prop in holderContainers5 ) {
            ArrContainers5.push({label: prop, totalContainerQty: holderContainers5[prop]})
        };

        // merges ArrLoose and ArrContainers on label key (Bwt)
        const mergedData5 = ArrLoose5.map(data=>({
            ...data,
            ...ArrContainers5.find(newData=>newData.label == data.label)
        }));
        setTrailerData(mergedData5);


        // --------> Floor 
        var Floor = AllData.filter(obj => {
            return obj.location === 'Floor';
        });

        // adds up totalLooseQty per Bwt
        var holderLoose6 = {};
        Floor.forEach(function(d) {
            if (holderLoose6.hasOwnProperty(d.smiBwt)) {
                holderLoose6[d.smiBwt] = holderLoose6[d.smiBwt] + Math.round(d.totalLooseQty);
            }
            else {
                holderLoose6[d.smiBwt] = Math.round(d.totalLooseQty);
            }
        });

        var ArrLoose6 = [];
        for(var prop in holderLoose6 ) {
            ArrLoose6.push({label: prop, totalLooseQty: holderLoose6[prop]})
        };

        // adds up totalQty per Bwt
        var holderContainers6 = {};
        Floor.forEach(function(d) {
            if (holderContainers6.hasOwnProperty(d.smiBwt)) {
                holderContainers6[d.smiBwt] = holderContainers6[d.smiBwt] + d.totalQty;
            }
            else {
                holderContainers6[d.smiBwt] = d.totalQty;
            }
        });

        var ArrContainers6 = []
        for(var prop in holderContainers6 ) {
            ArrContainers6.push({label: prop, totalContainerQty: holderContainers6[prop]})
        };

        // merges ArrLoose and ArrContainers on label key (Bwt)
        const mergedData6 = ArrLoose6.map(data=>({
            ...data,
            ...ArrContainers6.find(newData=>newData.label == data.label)
        }));
        setFloorData(mergedData6);

    },[AllData]);

  return (
    <div className="center">  
        <div className='row ml-4 mr-3'>
            <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '550px'}}
                    className="mt-5"
                    >
                        <h3>Hallway</h3>
                    <Chart
                        type='bar'
                        options={options}
                        data={dataHallway}
                    />
                    <h6 style={{color: 'gray'}}>Sheet Material Bwt #</h6>
                </Grid>
            </div>
            <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '550px'}}
                    className="mt-5"
                    >
                        <h3>Warehouse</h3>
                    <Chart
                        type='bar'
                        options={options}
                        data={dataWarehouse}
                    />
                    <h6 style={{color: 'gray'}}>Sheet Material Bwt #</h6>
                </Grid>
            </div>
        </div>
        <div className='row ml-4 mr-3'>
            <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '550px'}}
                    className="mt-5"
                    >
                        <h3>DigitalRoom</h3>
                    <Chart
                        type='bar'
                        options={options}
                        data={dataDigitalRoom}
                    />
                    <h6 style={{color: 'gray'}}>Sheet Material Bwt #</h6>
                </Grid>
            </div>
            <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '550px'}}
                    className="mt-5"
                    >
                        <h3>Landa</h3>
                    <Chart
                        type='bar'
                        options={options}
                        data={dataLanda}
                    />
                    <h6 style={{color: 'gray'}}>Sheet Material Bwt #</h6>
                </Grid>
            </div>
        </div>
        <div className='row ml-4 mr-3'>
            <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '550px'}}
                    className="mt-5"
                    >
                        <h3>Trailer</h3>
                    <Chart
                        type='bar'
                        options={options}
                        data={dataTrailer}
                    />
                    <h6 style={{color: 'gray'}}>Sheet Material Bwt #</h6>
                </Grid>
            </div>
            <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '550px'}}
                    className="mt-5"
                    >
                        <h3>Floor</h3>
                    <Chart
                        type='bar'
                        options={options}
                        data={dataFloor}
                    />
                    <h6 style={{color: 'gray'}}>Sheet Material Bwt #</h6>
                </Grid>
            </div>
        </div>
    </div>
  );
};
export default ChartLocations;
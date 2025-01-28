import React, { useState, useEffect } from 'react';
// API calls
import { getChartSurveys, getChartYearSurveys } from '../../services/SurveyAPIs/surveyTableApi';
import { Typography, Grid } from '@mui/material';
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
import 'chartjs-adapter-date-fns';

const JobPerformance = () => {
    const [dayData, setDayData] = useState([]);
    const [yearData, setYearData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const [json1, json2] = await Promise.all([
                    getChartSurveys(),
                    getChartYearSurveys(),
                ]);
    
                if (json1.length === 0 && json2.length === 0) {
                    console.log('Both endpoints returned empty data.');
                } else {
                    //console.log('Data from first endpoint day:', json1);
                    var objHolder1 = [];
                    const dateValueMap = {};
                    json1.forEach((j, i) => {
                        const shipDate = new Date(j.shShipdate);
                        const formattedDate = shipDate.toISOString().split('T')[0]; // Extract date without time
                        // If the date exists in the dictionary, add the value to it
                        if (dateValueMap[formattedDate]) {
                            dateValueMap[formattedDate].shipValueTotal += j.shipValueTotal;
                            dateValueMap[formattedDate].shipmentCount += 1;
                            if(j.shippedOnTime === 1) {
                                dateValueMap[formattedDate].onTimeCt += 1
                            } else if(j.shippedOnTime === 2) {
                                dateValueMap[formattedDate].slightlyLateCt += 1
                            } else if(j.shippedOnTime === 3) {
                                dateValueMap[formattedDate].veryLateCt += 1
                            } 
                            if(j.shippedProdQuality === 1) {
                                dateValueMap[formattedDate].excellentCt += 1
                            } else if(j.shippedProdQuality === 2) {
                                dateValueMap[formattedDate].asExpectedCt += 1
                            } else if(j.shippedProdQuality === 3) {
                                dateValueMap[formattedDate].minorProblemsCt += 1
                            } else if(j.shippedProdQuality === 4) {
                                dateValueMap[formattedDate].signifProblemsCt += 1
                            } 
                        } else {
                            dateValueMap[formattedDate] = {
                                shShipdate: formattedDate,
                                shipValueTotal: j.shipValueTotal,
                                onTimeCt: 0,
                                slightlyLateCt: 0,
                                veryLateCt: 0,
                                excellentCt: 0,
                                asExpectedCt: 0,
                                minorProblemsCt: 0,
                                signifProblemsCt: 0,
                                shipmentCount: 1,
                            };
                        }
                    });
                    objHolder1 = Object.values(dateValueMap);
                    setDayData(objHolder1);
                    //console.log('Data from second endpoint year:', json2);
                    var objHolder2 = [];
                    const dateValueMap2 = {};
                    json2.forEach((j, i) => {
                        const shipDate = new Date(j.shShipdate);
                        const year = shipDate.getFullYear();
                        const month = shipDate.getMonth();
                        const formattedMonth = `${year}-${(month + 1).toString().padStart(2, '0')}`; // Format as "YYYY-MM"
                        // If the month exists in the dictionary, add the value to it
                        if (dateValueMap2[formattedMonth]) {
                            dateValueMap2[formattedMonth].shipValueTotal += j.shipValueTotal;
                            dateValueMap2[formattedMonth].shipmentCount += 1;
                            if (j.shippedOnTime === 1) {
                                dateValueMap2[formattedMonth].onTimeCt += 1;
                            } else if (j.shippedOnTime === 2) {
                                dateValueMap2[formattedMonth].slightlyLateCt += 1;
                            } else if (j.shippedOnTime === 3) {
                                dateValueMap2[formattedMonth].veryLateCt += 1;
                            }
                            if (j.shippedProdQuality === 1) {
                                dateValueMap2[formattedMonth].excellentCt += 1;
                            } else if (j.shippedProdQuality === 2) {
                                dateValueMap2[formattedMonth].asExpectedCt += 1;
                            } else if (j.shippedProdQuality === 3) {
                                dateValueMap2[formattedMonth].minorProblemsCt += 1;
                            } else if (j.shippedProdQuality === 4) {
                                dateValueMap2[formattedMonth].signifProblemsCt += 1;
                            }
                        } else {
                            dateValueMap2[formattedMonth] = {
                                shShipdate: formattedMonth,
                                shipValueTotal: j.shipValueTotal,
                                onTimeCt: 0,
                                slightlyLateCt: 0,
                                veryLateCt: 0,
                                excellentCt: 0,
                                asExpectedCt: 0,
                                minorProblemsCt: 0,
                                signifProblemsCt: 0,
                                shipmentCount: 1,
                            };
                        }
                    });
                    objHolder2 = Object.values(dateValueMap2);    
                    setYearData(objHolder2);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        })();
    }, []);

    var totalShipDataDay = [];
    dayData.forEach(function(e, i) {
        totalShipDataDay.push({
            x: e.shShipdate,
            y: e.shipValueTotal,
            r: 10,
            onTimeCt: e.onTimeCt,
            slightlyLateCt: e.slightlyLateCt,
            veryLateCt: e.veryLateCt,
            excellentCt: e.excellentCt,
            asExpectedCt: e.asExpectedCt,
            minorProblemsCt: e.minorProblemsCt,
            signifProblemsCt: e.signifProblemsCt,
            shipmentCount: e.shipmentCount,         
        });
    });

    var totalShipDataYear = [];
    yearData.forEach(function(e, i) {
        totalShipDataYear.push({
            x: e.shShipdate,
            y: e.shipValueTotal,
            r: 10,
            onTimeCt: e.onTimeCt,
            slightlyLateCt: e.slightlyLateCt,
            veryLateCt: e.veryLateCt,
            excellentCt: e.excellentCt,
            asExpectedCt: e.asExpectedCt,
            minorProblemsCt: e.minorProblemsCt,
            signifProblemsCt: e.signifProblemsCt,
            shipmentCount: e.shipmentCount, 
        });
    });

    const dataDay = {
        labels: dayData.map(x => x.shShipdate), 
        datasets: [
            {
                type: 'bubble',
                label: 'Total Shipments per day',
                backgroundColor: 'rgb(75, 192, 192, 0.5)',
                data: totalShipDataDay
            },
        ],
    };

    const dataYear = {
        labels: yearData.map(x => x.shShipdate), 
        datasets: [
            {
                type: 'bubble',
                label: 'Total Shipments per month',
                backgroundColor: 'rgb(53, 162, 235, 0.5)',
                data: totalShipDataYear
            }
        ],
    };

    const optionsDay = {
        interaction: {
            intersect: false,
            mode: 'index',
          },
        elements: {
            point: {
                pointStyle: 'circle',
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Shipped Date'
                },
            },
            y: {
              title: {
                display: true,
                text: '$ Value'
              },
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(context) {
                        return 'Date: ' + context[0].label;
                    },
                    afterTitle: function(context) {
                        return 'Total Day Value: ' + context[0].parsed.y.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          });
                    },
                    label: function(context) {
                        // shows how many shipments per date
                        let label = '';
                        if (context.raw.shipmentCount !== undefined) {
                            label += `# of Shipments: ${context.raw.shipmentCount}\n`;
                        }
                        // shows # of On Time shipments
                        if (context.raw.onTimeCt !== 0) {
                            label += `On-Time: ${context.raw.onTimeCt}\n`;
                        }
                        if (context.raw.slightlyLateCt !== 0) {
                            label += `Slightly Late: ${context.raw.slightlyLateCt}\n`;
                        }
                        if (context.raw.veryLateCt !== 0) {
                            label += `Very Late: ${context.raw.veryLateCt}\n`;
                        }
                        // shows # of Quality shipments
                        if (context.raw.excellentCt !== 0) {
                            label += `Excellent Quality: ${context.raw.excellentCt}\n`;
                        }
                        if (context.raw.asExpectedCt !== 0) {
                            label += `As Expected Quality: ${context.raw.asExpectedCt}\n`;
                        }
                        if (context.raw.minorProblemsCt !== 0) {
                            label += `Minor Problems Quality: ${context.raw.minorProblemsCt}\n`;
                        }
                        if (context.raw.signifProblemsCt !== 0) {
                            label += `Significant Problems Quality: ${context.raw.signifProblemsCt}\n`;
                        }
                        return label.split('\n');
                    },
                   
                }
            }
        }
    };

    const optionsYear = {
        interaction: {
            intersect: false,
            mode: 'index',
          },
        elements: {
            point: {
                pointStyle: 'circle',
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month'
                },
                title: {
                    display: true,
                    text: 'Month'
                },
            },
            y: {
              title: {
                display: true,
                text: '$ Value'
              },
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(context) {
                        return 'Month: ' + context[0].label;
                    },
                    afterTitle: function(context) {
                        return 'Value: ' + context[0].parsed.y.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          });
                    },
                    label: function(context) {
                        // shows how many shipments per month
                        let label = '';
                        if (context.raw.shipmentCount !== undefined) {
                            label += `# of Shipments: ${context.raw.shipmentCount}\n`;
                        }
                        // shows # of On Time shipments
                        if (context.raw.onTimeCt !== 0) {
                            label += `On-Time: ${context.raw.onTimeCt}\n`;
                        }
                        if (context.raw.slightlyLateCt !== 0) {
                            label += `Slightly Late: ${context.raw.slightlyLateCt}\n`;
                        }
                        if (context.raw.veryLateCt !== 0) {
                            label += `Very Late: ${context.raw.veryLateCt}\n`;
                        }
                        // shows # of Quality shipments
                        if (context.raw.excellentCt !== 0) {
                            label += `Excellent Quality: ${context.raw.excellentCt}\n`;
                        }
                        if (context.raw.asExpectedCt !== 0) {
                            label += `As Expected Quality: ${context.raw.asExpectedCt}\n`;
                        }
                        if (context.raw.minorProblemsCt !== 0) {
                            label += `Minor Problems Quality: ${context.raw.minorProblemsCt}\n`;
                        }
                        if (context.raw.signifProblemsCt !== 0) {
                            label += `Significant Problems Quality: ${context.raw.signifProblemsCt}\n`;
                        }
                        return label.split('\n');
                    },
                }
            }
        }
    };

    return (
        <div className="inventory center">
            <Typography sx={{ width: '100%', color: 'text.primary' }} variant={'h5'}>
                Job Performance Overview
            </Typography>
            <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                Here are the job performances for each day for the past 30 days and for each month for the past year. 
            </Typography>
            <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                Total value, total number of shipments and how many shipments for each survey option per day or per month can be seen when hovering each data point.
            </Typography>
            <div className="row"> 
                <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '600px'}}
                    className="mt-5"
                    >
                    <Chart
                        type='bubble'
                        options={optionsDay}
                        data={dataDay}
                    />
                </Grid>
                </div>
                <div className='col-6'>
                <Grid 
                    style={{width: '100%', height: '600px'}}
                    className="mt-5"
                    >
                    <Chart
                        type='bubble'
                        options={optionsYear}
                        data={dataYear}
                    />
                </Grid>
                </div>
            </div>
        </div>
    );
}

export default JobPerformance;
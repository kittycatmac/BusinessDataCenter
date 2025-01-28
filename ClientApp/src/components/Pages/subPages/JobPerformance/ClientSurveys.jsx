import React, { useState, useEffect }  from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
// API calls
import { getChartSurveys } from '../../../../services/SurveyAPIs/surveyTableApi';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
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

const ClientSurveys = () => {
    const location = useLocation();
    const [showMainPageContent, setShowMainPageContent] = useState(true);
    const [items, setItems] = useState([]);

    const Active = {
          color: '#35A2EB'
    }

    const notActive = {
          color: '#91a3b0'
    }

    useEffect(() => {
        let isMounted = true; // Flag to track component mount status
        // Check if the current path is the main page path
          // Check if the current path is one of the main page paths
        switch (location.pathname) {
            case "/JobPerformance/Surveys/OnTime":
            case "/JobPerformance/Surveys/Quality":
            case "/JobPerformance/Surveys/EditShip":
            case "/JobPerformance/Surveys/EditJob":
            case "/JobPerformance/Surveys/SearchIds":
            if (isMounted) {
                setShowMainPageContent(true);
            }
            break;
            default:
            if (isMounted) {
                setShowMainPageContent(false);
            }
            break;
        }
    }, [location]);

    useEffect(() => {
        (async () => {
        try {
            const json = await getChartSurveys();
            if(json.length == 0) {
                console.log('empty');
            } else if (json.length > 0) {
                console.log(json);
                var objHolder = [];
                const encounteredDates = new Set();
                json.forEach((j, i) => {
                    const shipDate = new Date(j.shShipdate);
                    // creates a unqiue time for better visibility 
                    if (encounteredDates.has(shipDate.toString())) {
                        shipDate.setMinutes(shipDate.getMinutes() + i); // Increment by i minutes
                    } else {
                        encounteredDates.add(shipDate.toString());
                    }
                    objHolder.push({
                        projMgr: j.projMgr,
                        jobId: j.jobId,
                        jobDesc: j.jobDesc,
                        shipId: j.shShipid,
                        shQuantity: j.shQuantity,
                        shShipdate: shipDate.toISOString(), 
                        shipValueTotal: j.shipValueTotal, 
                        shippedOnTime: j.shippedOnTime, 
                        shippedProdQuality: j.shippedProdQuality,
                        shSurveyCompleted: j.surveyCompleted,
                        jobSurveyCompleted: j.jobSurveyCompleted,
                    });
                });
                setItems(objHolder);
            }
        } catch (error) {
            console.log("error", error);
        }
        })();
    }, []);
    
    var chartData = [];

    items.forEach(function(e, i) {
        chartData.push({
            x: e.shShipdate,
            y: e.shipValueTotal,
            r: 5,
            shippedOnTime: e.shippedOnTime * 10,
            shippedProdQuality: e.shippedProdQuality * 10,
            jobId: e.jobId,
            shipId: e.shipId
        });
    });

    const data = {
        labels: items.map(x => x.shShipdate), 
        datasets: [
            {
                type: 'bubble',
                label: 'Shipment Data',
                backgroundColor: 'rgb(53, 162, 235, 0.5)',
                data: chartData
            },
        ],
    };

    const options = {
        interaction: {
            intersect: true,
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
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM d'
                    },
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
                        return 'JobId: ' + context[0].raw.jobId + ' ShipId: ' + context[0].raw.shipId;
                    },
                    afterTitle: function(context) {
                        const rawDate = context[0].label;
                        const formattedDate = new Date(rawDate).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                        return 'ShipDate: ' + formattedDate + 
                                ' ShipValue: ' + context[0].parsed.y.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        });
                    },
                    label: function(context) {
                        let label = '';
                        // OnTime translation
                        label += context.raw.shippedOnTime/10 === 1 ? 'Timming: On Time --' : context.raw.shippedOnTime/10 === 2 ? 'Timming: Slightly Late --' : 
                        context.raw.shippedOnTime/10 === 3 ? 'Timming: Very Late --' : 'Timming: Missing Survey --' ;
                        // Quality translation
                        label += context.raw.shippedProdQuality/10 === 1 ? ' Quality: Excellent Quality' : context.raw.shippedProdQuality/10 === 2 ? ' Quality: As Expected' : 
                        context.raw.shippedProdQuality/10 === 3 ? ' Quality: Minor Problems' : context.raw.shippedProdQuality/10 === 4 ? ' Quality: Significant Problems' : 
                        ' Quality: Missing Survey';

                        return label;
                    },
                   
                }
            }
        }
    };

    return (
        <div className="center">  
            <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            className="mb-3"
            >
            <Breadcrumbs aria-label="breadcrumb"> 
                <Link to="/JobPerformance/Surveys"
                    style={location.pathname === "/JobPerformance/Surveys" ? Active : notActive}>
                        Client Surveys
                </Link>
                <Link to="/JobPerformance/Surveys/OnTime"
                    style={location.pathname === "/JobPerformance/Surveys/OnTime" ? Active : notActive}>
                        On Time Surveys
                </Link>
                <Link to="/JobPerformance/Surveys/Quality"
                    style={location.pathname === "/JobPerformance/Surveys/Quality" ? Active : notActive}>
                        Quality Surveys
                </Link>
                <Link to="/JobPerformance/Surveys/EditShip" 
                    style={location.pathname === "/JobPerformance/Surveys/EditShip" ? Active : notActive}>
                        Edit On Time Surveys
                </Link>
                <Link to="/JobPerformance/Surveys/EditJob" 
                    style={location.pathname === "/JobPerformance/Surveys/EditJob" ? Active : notActive}>
                        Edit Quality Surveys
                </Link>
                <Link to="/JobPerformance/Surveys/SearchIds" 
                    style={location.pathname === "/JobPerformance/Surveys/SearchIds" ? Active : notActive}>
                        Search Job Ids
                </Link>
            </Breadcrumbs>
            </Grid> 
            {showMainPageContent ? <Outlet /> : 
                <div>   
                    <Typography sx={{ width: '100%', color: 'text.primary' }} variant={'h5'}>
                        Client Surveys
                    </Typography>
                    <Typography sx={{ width: '100%', color: 'text.secondary' }}>
                        Chart is showing all job shipment surveys for the past 30 days. Hover over each data point to see details. 
                    </Typography>         
                    <div className="row"> 
                    <div className='col-2'></div>
                        <div className='col-8'>
                        <Grid 
                            style={{width: '100%', height: '600px'}}
                            className="mt-5"
                            >
                            <Chart
                                type='bubble'
                                options={options}
                                data={data}
                            />
                        </Grid>
                        </div>
                        <div className='col-2'></div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ClientSurveys;
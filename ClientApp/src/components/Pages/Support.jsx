import React, { useState, useRef, useEffect }from 'react';

const useMountEffect = fun => useEffect(fun, []);

const Support = () => {

    const myRefsmi = useRef(null);
    const myRefsurveys = useRef(null);
    const myRefAsmi = useRef(null);
    const myRefAsurveys = useRef(null);

    const [hoverSMI, setHoverSMI] = useState(false);
    const [hoverSurveys, setHoverSurveys] = useState(false);

    useEffect(() => {
        //console.log(hover);
        const targetSMITitleEl = myRefAsmi.current;
        targetSMITitleEl.style.color = hoverSMI ? '#3e6aab' : '';
        const targetSurveyTitleEl = myRefAsurveys.current;
        targetSurveyTitleEl.style.color = hoverSurveys ? '#3e6aab' : '';

    }, [hoverSMI, hoverSurveys]);


    const smiexecuteScroll = () => myRefsmi.current.scrollIntoView();
    useMountEffect(smiexecuteScroll); // Scroll on mount

    const surveyexecuteScroll = () => myRefsurveys.current.scrollIntoView();
    useMountEffect(surveyexecuteScroll); // Scroll on mount

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
      }, []);

    return (
        <>
            <div className="support center">
                <h1>Support</h1>
                <p>Please email cmcmillen@HudsonPrinting.com (Catherine McMillen) or IT@HudsonPrinting.com for any issues, bugs or questions.</p>
            </div>
            <div className='ml-5'>
                <h2>Documentation</h2>
                <br></br>
                <h2>Table of Contents</h2>
                <h3><a  ref={myRefAsmi}
                            onMouseEnter={()=>{
                                setHoverSMI(true);
                            }}
                            onMouseLeave={()=>{
                                setHoverSMI(false);
                            }}
                        onClick={smiexecuteScroll}>Sheet Material Inventory
                    </a>
                </h3>
                <h3><a  ref={myRefAsurveys}
                            onMouseEnter={()=>{
                                setHoverSurveys(true);
                            }}
                            onMouseLeave={()=>{
                                setHoverSurveys(false);
                            }}
                        onClick={surveyexecuteScroll}>Shipment and Job Surveys
                    </a>
                </h3>
                <br></br>
                <br></br>
                <div id="smi" ref={myRefsmi}>
                    <h3>Sheet Material Inventory</h3>
                    <h4>Navigate Menu</h4>
                    <p>Inventory -&gt; Sheet Material</p>
                    <h4>Locations</h4>
                    
                    <h5>Hallway</h5>
                    <p>There are four tabs Overview, Skids, Cartons, Misc.</p>

                    <h5>Warehouse</h5>
                    <p>There are four tabs Overview, Skids, Cartons, Misc.</p>

                    <h5>DigitalRoom</h5>
                    <p>There are four tabs Overview, Skids, Cartons, Misc.</p>

                    <h5>Landa</h5>
                    <p>There are four tabs Overview, Skids, Cartons, Misc.</p>

                    <h5>Trailer</h5>
                    <p>There is the Overview tab and many tabs for each trailer S-170, etc..</p>

                    <h5>Floor</h5>
                    <p>There are four tabs Overview, Skids, Cartons, Misc.</p>

                    <h5>Overview tabs</h5>
                    <p>Here all the rows from all the tabs are listed, reference the tab column.</p>
                    <p>Use the menu in the table for hidden columns, filtering, density of the table spaces, export to csv (excel sheet), printing.</p>
                    <p>Hover over any column to use (up arrow) sort and (three vertical dots) menu options.</p>
                    <p>The menu has sort options, filter (look up Inv#), hide (hide column), show columns (toggle hidden columns).</p>
                    <p>Use the select checkboxes far left on table for the "Pull Product" button.</p>
                    <p>Selected rows with be listed in popup to pull/transfer product from current location to anothor location.</p>
                    <p>To transfer product, enter either number of skids, cartons or inches, if nothing to transfer then enter 0, choose location from dropdown.</p>
                    <p>Scroll to bottom of pop up and click "Pull" button.</p>
                    <p>Double click on the cell for Tab column to edit which tab the row should be on.</p>

                    <h5>All other tabs</h5>
                    <p>Use the select checkboxes for the "Delete Rows" button and a pop up with all Inv# will be listed, click "Yes" button after checking.</p>
                    <p>Use the "Add Row" button to add additional rows to table, type the Inv# and either click the + button or use the hot key, tab.</p>
                    <p>Either options will auto populate the JMS data to your Inv#, add all other additional information for the row, once done either use "Submit" or hot key enter.</p>
                    <p>Double click the cell for QtyPerSkid, Qty Skids, QtyPerCarton, Qty Cartons, Date Time, Notes columns to edit.</p>
                    <p>Use the hot keys to edit vertically in a single column.</p>

                    <h5>Table Edit hot keys</h5>
                    <p>Double click cell, make changes, enter key, moves to below cell, enter key to edit, make changes, enter key, moves to below cell, etc.</p>

                    <h4>Overview</h4>
                    <p>This table has all the rows listed from all the locations. Use the select checkboxes to check data in the row.</p>
                    <p>"Save QOH To JMS" button gathers all the inv# and adds up all rows for the final quantity on hand number.</p>
                    <p>In the check product pop up Inv #, JMS Qoh (quantity currently in JMS), New Qoh (totals from collecting sheet inventory) and the difference between those two numbers.</p>
                    <p>Use the difference column to see an major changes. Once checked scroll to the bottom and click the "Submit Qoh" button.</p>
                    <p>New numbers will then be sent to JMS.</p>
                    <p>"Clear Total" button does what it says, clears all totals in all locations back to zero, use with caution.</p>

                    <h4 style={{color: '#2984d9'}}>Blue Text</h4>
                    <p>When the text in a row is blue, this means that if your on a tab then there is another row with the same Inv#.
                        If you are at the overview for a location then there is a row with the same Inv# at that location.
                        If you at the Overview for all the locations together then there is a row with the same Inv# for all the locations combined.
                        This is for the user to check those rows to make sure numbers are correct.
                    </p>
                </div>
                <div id="surveys" ref={myRefsurveys}>
                    <h3>Shipment and Job Surveys</h3>
                    <h4>Navigate Menu</h4>
                    <p>Job Performance -&gt; Client Surveys</p>
                    <p>Remember to complete the survey in the eyes of the customer!</p>
                    
                    <h4>On Time Surveys</h4>
                    <p>On Time surveys are where the daily shipment surveys are available. 
                        The surveys are pulling one day back from current day for one days worth of shipments.
                    </p>

                    <h4>Quality Surveys</h4>
                    <p>Quality surveys are where the daily job surveys are available.
                        The surveys are pulling one days worth of completed jobs from seven days ago.
                    </p>

                    <h4>Edit On Time Surveys</h4>
                    <p>Search using the job id and shipment id to make changes or add new surveys.
                        Use the daily email for surveys half completed or missing  in the csv file.
                    </p>

                    <h4>Edit Quality Surveys</h4>
                    <p>Search using the job id to make changes or add new surveys.
                        Use the daily email for surveys half completed or missing in the csv file.
                    </p>

                    {/* <h4>Missing Surveys</h4>
                    <p>If the survey can't be found in the edit surveys then add here in missing surveys. 
                        Enter the job id and shipment id to create new survey.
                        Use email for daily missing surveys or if client already knows before HDC lists out the shipment/job.
                    </p> */}
                </div>
            </div>
        </>
    );
}

export default Support;
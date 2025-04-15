import {React, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

const Results = () => {

  const [apiResults, setResults] = useState([]);

  // Retrieve postcode array from previous page
  const location = useLocation();
  // Have an optional empty list in case a user manages to navigate here directly
  const {postcodeList} = location.state || {postcodeList: []};

  var invalidDataBool = false;
  var invalidDataStr  = '';

  // Check for postcode format, does not check if the postcode actually exists

  // If there is less that 2 items, don't bother checking array contents
  if (postcodeList.length < 2) {
    invalidDataBool = true;
    console.log("Less than 2 postcodes")
  }
  else { // If we have more than 2 items, continue

    for (var i = 0; i < postcodeList.length; i++) {
      // Get item in the list
      var postcode = postcodeList[i].postcode;

      // If there is an empty item
      if ( postcode == "" ) {
        invalidDataBool = true;
        console.log("No postcode given", postcode)
        break;
      }

      postcode = postcode.toUpperCase();

      // Check if given postcode does NOT match regex 
      if ( ! postcode.match(/^([A-Z]{1,2}[0-9][0-9A-Z]? [0-9][A-Z]{2})$/) ) {
        invalidDataBool = true;
        invalidDataStr = postcode;
        console.log("Postcode does not conform", invalidDataStr, i)
        break;
      }
    }
  }


  // If all is good, begin API call


  // Build route list
  var routeList = "";

  for (var i = 0; i < postcodeList.length; i++) {
    // If we are not on the first item, add a comma
    if ( i != 0 ) {
      routeList += ", ";
    }
    // Append current postcode, capitalised
    routeList += postcodeList[i].postcode.toUpperCase();
  }


  const format = "Miles";
  const trafficMode = "best_guess";
  const travelMode = "Driving";
  
  const completeURL = "https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx?Route=PL19%209AG,EX4%209BJ,T%20Q1%201BG&Format=Miles&TravelMode=Driving";// `/Travel/JourneyPlan.aspx?Route=${routeList}&Format=${format}&TrafficMode=${trafficMode}&TravelMode=${travelMode}`;
  
  console.log(routeList)

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await fetch("https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx?Route=PL19%209AG,EX4%209BJ,T%20Q1%201BG&Format=Miles&TravelMode=Driving");

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const rawData = await response();
        const pairs = rawData.split(';').filter(pair => pair.trim() !== '');

        console.log(rawData)
        
        const parsedData = pairs.map(pair => {
          const [distance, time] = pair.split(',').map(value => parseFloat(value.trim()));
          return { distance, time };
        });

        setResults(parsedData);
      } catch (error) {
        console.error('API call failed:', error);
      }
    };

    fetchData();
  }, [postcodeList]);

  // If there is any invalids, display error message and retry button
  if ( invalidDataBool ) {
    return (
      <div>
        <br/><br/>
        <div className='poshBox'>
          <h3 className='invalidAlert'>Invalid Postcode Given: {invalidDataStr}</h3>
          <Link to="/postcodes"><button>Start again</button></Link>
        </div>
      </div>
    ); 
  }




  // Call API


};

export default Results;
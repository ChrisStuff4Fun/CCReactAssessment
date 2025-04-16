import {React, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

const Results = () => {

  // API results array
  const [apiResults, setResults] = useState([]);
  // Variables needed as a useState, as they may change in api call
  const [invalidDataBool, setInvalidDataBool] = useState(false);
  const [invalidDataStr,  setInvalidDataStr]  = useState("");
  
  // Loading bool variable
  const [loading, setLoading] = useState(true);

  // Retrieve postcode array from previous page
  const location = useLocation();
  // Have an optional empty list in case a user manages to navigate here directly
  const {postcodeList, travelMode} = location.state || {postcodeList: [], travelMode: ""};

  const postcodeListLength = postcodeList.length

  // Manually set variables that can't be changed in the API yet
  const format = "Miles";
  const trafficMode = "best_guess";


  useEffect(() => {
    const fetchData = async () => {
      // *Should* already be true, but just in case... 
      setLoading(true);

        // Check for postcode format, does not check if the postcode actually exists

        // If there is less that 2 items, don't bother checking array contents
        if (postcodeListLength < 2) {
          setInvalidDataBool(true);
          console.log("Less than 2 postcodes")
        }
        else { // If we have more than 2 items, continue

          for (var i = 0; i < postcodeListLength; i++) {
            // Get item in the list
            var postcode = postcodeList[i].postcode;

            // If there is an empty item
            if ( postcode == "" ) {
              setInvalidDataBool(true);
              console.log("No postcode given", postcode)
              break;
            }

            postcode = postcode.toUpperCase();

            // Check if given postcode does NOT match regex 
            if ( ! postcode.match(/^([A-Z]{1,2}[0-9][0-9A-Z]? [0-9][A-Z]{2})$/) ) {
              setInvalidDataBool(true);
              setInvalidDataStr(postcode);
              console.log("Postcode does not conform", invalidDataStr, i)
              break;
            }
          }
        }

        // If all is good, begin API call

        // Build route list
        var routeList = "";

        for (var i = 0; i < postcodeListLength; i++) {
          // If we are not on the first item, add a comma
          if ( i != 0 ) {
            routeList += ", ";
          }
          // Append current postcode, capitalised
          routeList += postcodeList[i].postcode.toUpperCase();
        }

        // Build URL
        const completeURL = `https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx?Route=${routeList}&Format=${format}&TrafficMode=${trafficMode}&TravelMode=${travelMode}`;
        
        console.log(routeList, travelMode)

      try {
        const response = await fetch(completeURL);

        // If something is wrong, tell me
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        // Get api response
        const rawData = await response.text();
        // Split by ; into an array, removing any blank elements
        const pairs = rawData.split(';').filter(pair => pair !== '');
        
        // If there is a mismatch of time/distance pairs to the amount of postcodes we gave the api, set invalid data to true
        if ( (pairs.length + 1) !== postcodeListLength) { 
          setInvalidDataBool(true);
          return;
        }
        
        const parsedTD = pairs.map(pair => {
          // Split each array item into time and distance, and convert to float
          const [time, distance] = pair.split(',').map(value => parseFloat(value));
          // Return object of time/distance pairs
          return { time, distance };
        });

        // Build final results array
        var finalResults = [];
        var totalDist    = 0;
        var totalTime    = 0;

        for (let i = 0; i < parsedTD.length; i++) {
          // Add distance/time to running total
          totalDist += parsedTD[i].distance;
          totalTime += parsedTD[i].time;
  
          // Add current journey row to array
          finalResults.push([ postcodeList[i].postcode.toUpperCase(), postcodeList[i + 1].postcode.toUpperCase(), parsedTD[i].time, parsedTD[i].distance ]);
        }

        // Add final results row
        finalResults.push([ postcodeList[0].postcode.toUpperCase(), postcodeList[postcodeListLength - 1].postcode.toUpperCase(), totalTime, totalDist ]);

        console.log(finalResults)


        setResults(finalResults);
      } catch (error) {
        console.error('API call failed:', error);
      }
      finally {
        // Set loading to false, start displaying data
        setLoading(false);
      }
    };

    fetchData();
    // Run all the above when postcodeList is changed (loaded)
  }, [postcodeList]);




    return (
      
      <div>
        <br/>
        <br/>

        {/*Show as loading, then switch when loading turns to false*/}
        {loading ? (
          <div>Loading...</div>
        ) : (
        <div className="poshBox">
          {/*Only show error message if we have issues*/}
          {invalidDataBool && (
          <h3 className='invalidAlert'>Invalid Postcode Given {invalidDataStr}</h3>
          )} 

          {/* Only show the rest if all is good */}
          {!invalidDataBool && (
            <>
              {/*Table titles*/}
              <table>
                <thead>
                  <tr> <th>From</th> <th>To</th> <th>Time</th> <th>Distance</th> </tr>
                </thead>
                <tbody>
                  {/*Show all but last row (summary)*/}
                  {apiResults.slice(0, -1).map((row, idx) => (
                    <tr key={idx}> <td>{row[0]}</td> <td>{row[1]}</td> <td>{row[2]} Mins</td> <td>{row[3]} {format}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary row */}
              <br />
              <h4>Journey Summary:</h4>
              <table>
                <thead>
                  <tr> <th>Origin</th> <th>End</th> <th>Total Time</th> <th>Total Distance</th> </tr>
                </thead>
                <tbody>
                  {/*Show last row summary*/}
                  <tr> <td>{apiResults.at(-1)[0]}</td> <td>{apiResults.at(-1)[1]}</td> <td>{apiResults.at(-1)[2]} Mins</td> <td>{apiResults.at(-1)[3]} {format}</td> </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
        )}

        <br/>
        <br/>
        {/*Start again button*/}
        <div className='poshBox'>
          <Link to="/postcodes"><button>Start again</button></Link>
        </div>
      </div>
    ); 
};

export default Results;
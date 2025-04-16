import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';


const EnterPostcodes = () => {

  // Postcode list 
  const [postcodeList, setPostcodeList] = useState([{postcode: ''}, {postcode: ''}]);
  // Mode of transport
  const [travelMode, setTravelMode] = useState("Driving");

  console.log(postcodeList);
  
  // Copy postcode list and add another element on the end
  const addRow = () => {
    setPostcodeList([...postcodeList, {postcode: ''}])
  }


  // Remove given element using splice on a given index value
  const delRow = (indexVal) => {
    // Make a copy of the old list
    const newPostcodeList = [...postcodeList]
    // Splice out 1 element starting from the given index 
    newPostcodeList.splice(indexVal, 1)
    // Set master list to the updated list
    setPostcodeList(newPostcodeList)
  }
  


  // Update element values in postcode list each time there is a change in one of the input forms
  const postcodeUpdate = (e, indexVal) => {
    // Get name and value of changed item (name will always be postcode since its a 1D array)
    const {name, value} = e.target;
    // Make a copy of the old list
    const newPostcodeList = [...postcodeList];
    // Replace old value in the same index with new value
    newPostcodeList[indexVal][name] = value;
    // Set the master list to the new one
    setPostcodeList(newPostcodeList);

  }

  return (
    <div>

      <br/>

      <div className='poshBox'>

        <h2>Journey Calculator</h2>

        {/* Button to dynamically add more fields*/}
        <button onClick={addRow}>Add row</button>

        <p> Postcodes must be given with a space, such as: PL19 9DP</p>

        <br/>
        <br/>

        <div id='postcodeContainer'>

          {/* Map fields to postcode list */}
          {postcodeList.map((singlePostcode, indexVal) => (

          <div key={indexVal}> 
            <input type='text' value={singlePostcode.postcode} onChange={(e) => postcodeUpdate(e, indexVal)} name='postcode' placeholder='Enter postcode'/>

            {/* Only show remove button if there is > 2 fields */}
            {postcodeList.length > 2 && (
            <button onClick={() => delRow(indexVal)}>Remove</button> 
            )} 
          </div>
          ))}
        </div>

        <br/>

        {/*Mode of transport toggle buttons*/}
        <div className="travelToggle">
          <button onClick={() => setTravelMode("Driving")} className={travelMode == "Driving" ? "active" : ""} >Driving</button>
          <button onClick={() => setTravelMode("Bicycling")} className={travelMode == "Bicycling" ? "active" : ""} >Cycling</button>
          <button onClick={() => setTravelMode("Walking")} className={travelMode == "Walking" ? "active" : ""} >Walking</button>
        </div>

        {/* Send postcode list to results component*/}
        <Link to="/results" state={{ postcodeList, travelMode }}><button>Calculate journey</button></Link>
      </div>
        
    </div>
  );
};





export default EnterPostcodes;
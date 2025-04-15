import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';


const EnterPostcodes = () => {

  const [postcodeList, setPostcodeList] = useState([{postcode: ''}, {postcode: ''}]);

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
        {/* Button to dynamically add more fields*/}
        <button onClick={addRow}>Add</button>
      </div>

      <br/>

      <div className='poshBox' id='postcodeContainer'>

        {/* Map fields to postcode list */}
        {postcodeList.map((singlePostcode, indexVal) => (

        <div key={indexVal}> 
          <input type='text' value={singlePostcode.postcode} onChange={(e) => postcodeUpdate(e, indexVal)} name='postcode'/>

          {/* Only show remove button if there is > 2 fields */}
          {postcodeList.length > 2 && (
          <button onClick={() => delRow(indexVal)}>Remove</button> 
          )} 
        </div>
        ))}

      </div>

      <br/>

      <div className='poshBox'>
      {/* Send postcode list to results component*/}
      <Link to="/results" state={{ postcodeList }}><button>Calculate</button></Link>
      </div>
        
    </div>
  );
};





export default EnterPostcodes;
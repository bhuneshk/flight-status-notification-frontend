import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const FlightSearch = ({ onSelectFlight, source, setSource, destination, setDestination }) => {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    const [sourceList, setSourceList] = useState([]);
    const [destinationList, setDestinationList] = useState([]);

    const autoSearch = async (key, type) => {
        try {
            if(key.length==0){
                setDestinationList([]);
                setSource("");
                setDestination("");
                setSourceList([]);
            }
            else{
            const response = await axios.get(`http://localhost:5000/api/flights/autoSearch`, {
                params: { key, type }
            });
            let reslength = response.data.length;
            console.log(response);
            let array_list = [];
            let dest_array_list = [];
            if (type === "source") {
                for (let i = 0; i < reslength; i++) {
                    array_list.push(response.data[i].source);
                }
                setSource(key);
                setSourceList(array_list);
            }
            else {
                for (let i = 0; i < reslength; i++) {
                    dest_array_list.push(response.data[i].destination);
                }
                setDestination(key);
                setDestinationList(dest_array_list);
            }
        }
            setError('');
        } catch (error) {
            setError('Failed to fetch flights');
        }
    }
    const handleSearch = async (e) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/flights/search`, {
                params: { source, destination }
            });
            setFlights(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch flights');
        }
    };

    const handleSelectFlight = (flight) => {
        onSelectFlight(flight);
    };

    return (
        <div>
            <h1>Search Flights</h1>
            <div>
                <label htmlFor="source">Source:</label>
                <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => autoSearch(e.target.value, "source")}
                />
                {sourceList?.map((a) => <div onClick={()=>{
                    setSourceList([]);
                    setSource(a);}}>
                    {a}
                </div>)}
                <></>
            </div>
            <div>
                <label htmlFor="destination">Destination:</label>
                <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => autoSearch(e.target.value, "destination")}
                />
                {destinationList?.map((a) => <div onClick={()=>{
                    setDestinationList([]);
                    setDestination(a);
                    }}>
                    {a}
                </div>)}
            </div>
            <button onClick={handleSearch}>Search</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {flights.map(flight => (
                    <li key={flight._id}>
                        Flight Number: {flight.flightNumber}, Fare: ${flight.fare}, Gate: {flight.gateNumber || 'N/A'}
                        <button onClick={() => handleSelectFlight(flight)}>Select</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlightSearch;

import React, { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import ArgonBox from "components/ArgonBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard1 from "examples/Cards/StatisticsCards/DetailedStatisticsCard1";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MyMapComponent from "./MyMapComponent";
import Timeline from "./Timeline";
import { AuthContext } from "../../AuthContext";
import Loader from "./Loader";
import axios from 'axios';
function Default() {
  const { vesselId } = useParams(); // Retrieve vesselId from URL
  const [vessels, setVessels] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const { role, id } = useContext(AuthContext);
  const [loading, setloading]=useState(false);
  const [error,setError]= useState("");



  const [events, setEvents] = useState([
    { id: '1', title: 'Event 1', date: '2024-10-10', description: 'First event description' },
    { id: '2', title: 'Event 2', date: '2024-10-11', description: 'Second event description' },
    { id: '3', title: 'Event 3', date: '2024-10-12', description: 'Third event description' }
  ]);

  
  // useEffect(() => {
  //   const baseURL = process.env.REACT_APP_API_BASE_URL;
  
  //   fetch(`${baseURL}/api/get-tracked-vessels`)
  //     .then(response => response.json())
  //     .then(data => {
  //       // Apply filtering logic based on role
  //       const filteredData = data.filter(vessel => {
  //         if (role === 'hyla admin') {
  //           return vessel.trackingFlag;
  //         } else if (role === 'organization admin' || role === 'organizational user') {
  //           const userOrgPart = id.split('_')[1] || id;
  //           const vesselOrgPart = (vessel.loginUserId || '').split('_')[1] || vessel.loginUserId;
  //           return vessel.trackingFlag && vesselOrgPart === userOrgPart;
  //         } else if (role === 'guest') {
  //           return vessel.trackingFlag && vessel.loginUserId === id;
  //         }
  //         return false;
  //       });
  
  //       setVessels(filteredData);
  
  //       // Find the vessel by name if vesselId is present
  //       const vessel = filteredData.find(vessel => vessel.AIS.NAME === decodeURIComponent(vesselId));
  
  //       // If no vessel found by ID, set the first vessel as default if it exists
  //       if (vessel) {
  //         setSelectedVessel(vessel);
  //       } else if (filteredData.length > 0) {
  //         setSelectedVessel(filteredData[0]); // Set the first vessel as default
  //         setloading(false);
  //       }
  //     })
  //     .catch(error => console.error("Error fetching vessels:", error));
  // }, [vesselId, role, id]);
  





  
 // Helper function to fetch tracked vessels by user
 const fetchTrackedVesselsByUser = async (userId) => {
  try {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const response = await axios.get(`${baseURL}/api/get-vessel-tracked-by-user`);
    // console.log(response);
    return response.data.filter(vessel => vessel.loginUserId === userId);
   
    
  } catch (error) {
    console.error("Error fetching tracked vessels by user:", error);
    return [];
  }
};

  
 // Helper function to fetch tracked vessels by user
 const fetchTrackedVesselsByOrg = async (orgId) => {
  try {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const response = await axios.get(`${baseURL}/api/get-vessel-tracked-by-user`);
    // console.log(response);
    return response.data.filter(vessel => vessel.OrgId === orgId);
   
    
  } catch (error) {
    console.error("Error fetching tracked vessels by user:", error);
    return [];
  }
};



// new start

const fetchVesselIMOValues = async (userId) => {
  try {
    // Extract orgId from userId
    let OrgId = userId.includes('_') ? userId.split('_')[1] : userId.split('_')[0];
    
    // Define the base URL for the API
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    // Fetch only the relevant vessels from the server based on orgId
    const response = await axios.get(`${baseURL}/api/get-vessel-tracked-by-user-based-on-OrgId`, {
      params: {
        OrgId: OrgId
      }
    });

    // console.log('abcddddddddddddddddddd',response.data);

    // Extract IMO values from the response
    const vesselsFiltered = response.data;

 
    
    return vesselsFiltered;
  } catch (error) {
    console.error("Error fetching IMO values:", error);
    return [];
  }
};



// new end

const fetchVesselById = async (userId) => {
  try {
  
    
    // Define the base URL for the API
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    // Fetch only the relevant vessels from the server based on orgId
    const response = await axios.get(`${baseURL}/api/get-vessel-tracked-by-user-based-on-loginUserId`, {
      params: {
        loginUserId : userId
      }
    });

   

    // Extract IMO values from the response
    const vesselsFiltered = response.data;

 
    
    return vesselsFiltered;
  } catch (error) {
    console.error("Error fetching vessels values:", error);
    return [];
  }
};




const fetchVessels = async (role, userId) => {
  try {
    // Fetch the tracked vessels for the user first
    const trackedByUser = await fetchTrackedVesselsByUser(userId);
    // console.log(trackedByUser);

    // Ensure tracked vessels have a valid IMO and extract them
    const trackedIMO = trackedByUser.filter(vessel => vessel.IMO).map(vessel => vessel.IMO);

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    // Now fetch all vessels
   
    const response = await axios.get(`${baseURL}/api/get-tracked-vessels`);
    
    const allVessels = response.data;
    
   // Initialize an empty array to store the filtered vessels
    const filteredVessels = [];


      if (role === 'hyla admin') {
        // For 'hyla admin', return all vessels whose IMO is in the tracked IMO list
        filteredVessels.push(...allVessels); // Spread allVessels into filteredVessels to avoid nested array
      } else if (role === 'organization admin' || role === 'organizational user') {
      

        // Now, you need to fetch the IMO values for the user
        const vesselsFiltered = await fetchVesselIMOValues(userId); // Await this async function

        // Check if the vessel IMO is in the fetched IMO values
        filteredVessels.push(...vesselsFiltered); // to avoid array inside array nested
       
        
      } else if (role === 'guest') {
        // For 'guest', filter vessels based on loginUserId
     

            // Now, you need to fetch the IMO values for the user
            const vesselsFiltered = await fetchVesselById(userId); // Await this async function
            filteredVessels.push(...vesselsFiltered); // to avoid array inside array nested
      }else{
        console.log('not found')
      }
    
    

  

    // console.log('Filtered Vessels:', finalVessels);
    return filteredVessels;

  } catch (error) {
    console.error("Error fetching vessels:", error);
    return [];
  }
};



useEffect(() => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  

  fetchVessels(role, id)
    .then(filteredVessels => {
      // Process filtered data
// console.log(filteredVessels);
      const transformedData = filteredVessels.map((vessel) => ({
        SpireTransportType: vessel.SpireTransportType|| '',
        name: vessel.AIS?.NAME || "-",
        imo: vessel.AIS?.IMO || 0,
        speed: vessel.AIS?.SPEED || 0,
        lat: vessel.AIS?.LATITUDE || 0,
        lng: vessel.AIS?.LONGITUDE || 0,
        heading: vessel.AIS?.HEADING || 0,
        status: vessel.AIS?.NAVSTAT || 0,
        eta: vessel.AIS?.ETA || 0,
        destination: vessel.AIS?.DESTINATION || '',
        zone: vessel.AIS?.ZONE || '',
      }));
      // console.log(transformedData);


      setVessels(filteredVessels);

            // Find the vessel by name if vesselId is present
            const vessel = filteredData.find(vessel => vessel.AIS.NAME === decodeURIComponent(vesselId));
  
            // If no vessel found by ID, set the first vessel as default if it exists
            if (vessel) {
              setSelectedVessel(vessel);
            } else if (filteredData.length > 0) {
              setSelectedVessel(filteredData[0]); // Set the first vessel as default
              setloading(false);
            }
    
        
     
    })
    .catch((err) => {
      console.error("Error fetching vessel data:", err);
      setError(err.message);
    })
    .finally(() => {
      // setLoading(false);
    });
}, [role,id,vessels,vesselId]);


  
 


useEffect(() => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  // setLoading(true);

  fetchVessels(role, id)
    .then(filteredData => {
      // Process filtered data

      const transformedData = filteredData.map((vessel) => ({
        SpireTransportType:vessel.SpireTransportType|| '',
        name: vessel.AIS.NAME || '',
        imo: vessel.AIS.IMO || 0,
        speed: vessel.AIS.SPEED || 0,
        lat: vessel.AIS.LATITUDE || 0,
        lng: vessel.AIS.LONGITUDE || 0,
        heading: vessel.AIS.HEADING || 0,
        status: vessel.AIS.NAVSTAT || 0,
        eta: vessel.AIS.ETA || 0,
        destination: vessel.AIS.DESTINATION || '',
      }));


      setVessels(filteredData);
      console.log(transformedData);

      // Find the vessel by name if vesselId is present
        const vessel = filteredData.find(vessel => vessel.AIS.NAME === decodeURIComponent(vesselId));
  
        // If no vessel found by ID, set the first vessel as default if it exists
        if (vessel) {
          setSelectedVessel(vessel);
        } else if (filteredData.length > 0) {
          setSelectedVessel(filteredData[0]); // Set the first vessel as default
          setloading(false);
        }

    
  
    })
    .catch((err) => {
      console.error("Error fetching vessel data:", err);
      setError(err.message);
    })
    .finally(() => {
      // setLoading(false);
    });
}, [vesselId,role, id]);


  //       // Find the vessel by name if vesselId is present
  //       const vessel = filteredData.find(vessel => vessel.AIS.NAME === decodeURIComponent(vesselId));
  
  //       // If no vessel found by ID, set the first vessel as default if it exists
  //       if (vessel) {
  //         setSelectedVessel(vessel);
  //       } else if (filteredData.length > 0) {
  //         setSelectedVessel(filteredData[0]); // Set the first vessel as default
  //         setloading(false);
  //       }
  //     })
  //     .catch(error => console.error("Error fetching vessels:", error));
  // }, [vesselId, role, id]);



  function handleSelect(event, value) {
    if (!value) {
      setSelectedVessel(null);
      return;
    }

    const vesselData = vessels.find(vessel => vessel.AIS.NAME === value.AIS.NAME);
    setSelectedVessel(vesselData || null);
  }

  const destination = selectedVessel?.AIS?.DESTINATION || "-";
  const speed = selectedVessel?.AIS?.SPEED ? `${selectedVessel.AIS.SPEED} kn` : "-";

  const eta = selectedVessel?.AIS?.ETA || "-";
  const zone = selectedVessel?.AIS?.ZONE || "-";





// Simulated function that fetches new event data (could be replaced by API calls)
const fetchNewEvent = () => {
  return new Promise((resolve) => {
      setTimeout(() => {
          const eventId = (events.length + 1).toString();
          const newEvent = {
              id: eventId,
              title: `Event ${eventId}`,
              date: new Date().toLocaleString(),
              description: `New event added: ${eventId}`
          };

          // Randomly decide to return new event or null (to simulate no new events)
          const hasNewEvent = Math.random() > 0.5; // 50% chance to get a new event
          resolve(hasNewEvent ? newEvent : null);
      }, 2000); // Simulate a delay for fetching
  });
};

if (loading) {
  return <Loader/>;
}

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={12}>
            <DetailedStatisticsCard1 vessel={selectedVessel} />
          </Grid>

          {selectedVessel && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <DetailedStatisticsCard
                  title="Destination"
                  count={destination}
                  icon={{ color: "info", component: <i className="fa fa-ship" /> }}
                  percentage={{ color: "success", count: "+3%", text: "since yesterday" }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DetailedStatisticsCard
                  title="Speed"
                  count={speed}
                  icon={{ color: "info", component: <i className="fa fa-map-marker" /> }}
                  percentage={{ color: "success", count: "+3%", text: "since last week" }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DetailedStatisticsCard
                  title="ETA"
                  count={eta}
                  icon={{ color: "info", component: <i className="fa fa-map" /> }}
                  percentage={{ color: "error", count: "-2%", text: "since last quarter" }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <DetailedStatisticsCard
                  title="Zone"
                  count={zone}
                  icon={{ color: "info", component: <i className="fa fa-crosshairs" /> }}
                  percentage={{ color: "success", count: "+5%", text: "than last month" }}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Card
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "17px",
            boxShadow: 1,
            padding: 2,
          }}
        >
          <CardContent
            sx={{
              backgroundColor: "#ffffff",
              padding: 0,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Vessel Search
            </Typography>
            <Autocomplete
              options={vessels}
              getOptionLabel={(option) => option.AIS.NAME || ""}
              value={selectedVessel} // Set the selected value
              onChange={handleSelect}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" />
              )}
            />
          </CardContent>
        </Card>
        <Grid container my={0}>
          {/* <Grid item xs={12} md={0} lg={3.5}></Grid>
          <Grid item xs={12} md={0} lg={3.5}></Grid> */}
          <Grid item xs={12} md={0} lg={12} ml={0} mt={3}>
            <MyMapComponent 
              selectedVessel={selectedVessel} // Pass selectedVessel to the map
              style={{ borderRadius: '20px' }} 
            />
          </Grid>
        </Grid>


 {selectedVessel && (
        <Grid container spacing={0} mt={1}>
            <Grid item xs={12} md={12}>
                <Card sx={{ padding: 1 }} style={{ alignContent: "center", position: "relative", paddingBottom:"15px" }}>
                    <CardContent>
                        {/* You can add any header or title here if needed */}
                        <h5 style={{color:"#344767"}}>Alert Timeline</h5>
                    </CardContent>
                   
                    <Timeline initialEvents={events} fetchNewEvent={fetchNewEvent} selectedVessel={selectedVessel}/>
                   
                </Card>
            </Grid>
        </Grid>
   )}

      </ArgonBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Default;



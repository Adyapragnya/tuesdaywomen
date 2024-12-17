import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import axios from 'axios';

const columns = [
  { name: 'vesselName', header: 'Vessel Name', minWidth: 150 },
  { name: 'geofence', header: 'Geofence Name', minWidth: 150 },
  { name: 'status', header: 'Status', minWidth: 100 },
  { name: 'entryTime', header: 'Entered', minWidth: 150 },
  { name: 'exitTime', header: 'Depatured', minWidth: 150 },
  { name: 'speed', header: 'Speed', minWidth: 100 },
  { name: 'heading', header: 'Heading', minWidth: 100 },
  { name: 'destination', header: 'Destination', minWidth: 150 },
];





useEffect(() => {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    axios.get(`${baseURL}/api/getvesselHistory/${vesselID}`)
      .then((response) => {
      
      })
      .catch((err) => {
        console.error("Error fetching vessel history data:", err);
      });
  }, []);

  // Log the vesselEntries whenever it changes
  useEffect(() => {
    console.log("Vessel Entries Updated:", vesselEntries);
  }, [vesselEntries]);
const formatEntries = (entries = {}, vessels = []) => {
  const entriesArray = Array.isArray(entries)
    ? entries
    : Object.entries(entries || {}).map(([key, value]) => ({
        ...value,
        vesselName: key,
      }));

  return vessels.map(vessel => {
    const entry = entriesArray.find(e => e.vesselName === vessel.name) || {};

    return {
      vesselName: vessel.name,
      geofence: entry.geofence || 'N/A',
      status: entry.status || 'Outside',
      entryTime: entry.entryTime ? new Date(entry.entryTime).toLocaleString() : 'N/A',
      exitTime: entry.exitTime ? new Date(entry.exitTime).toLocaleString() : 'N/A',
      speed: vessel.speed || 'N/A',
      heading: vessel.heading || 'N/A',
      destination: vessel.destination || 'N/A',
    };
  });
};

const HistoryTable = ({ vesselEntries = {}, vessels = [], onRowClick }) => {
  const dataSource = formatEntries(vesselEntries, vessels);
  const [insideVessels, setInsideVessels] = useState([]);

 


  const handleRowClick = (rowData) => {
    onRowClick(rowData.data); // Call the original onRowClick function
  };

  return (
    <div className="geofence-message">
      {dataSource.length === 0 ? (
        <p>No vessels to display</p>
      ) : (
        <ReactDataGrid
          columns={columns}
          dataSource={dataSource}
          style={{ minHeight: 500 }}
          pagination
          paginationPosition="bottom"
          defaultSortInfo={{ name: 'entryTime', dir: 'desc' }}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

HistoryTable.propTypes = {
  vesselEntries: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        vesselName: PropTypes.string.isRequired,
        geofence: PropTypes.string.isRequired,
        entryTime: PropTypes.string,
        exitTime: PropTypes.string,
      }).isRequired
    ),
    PropTypes.objectOf(
      PropTypes.shape({
        entryTime: PropTypes.string,
        exitTime: PropTypes.string,
        geofence: PropTypes.string,
      }).isRequired
    ),
  ]).isRequired,
  vessels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      speed: PropTypes.number,
      heading: PropTypes.number,
      destination: PropTypes.string,
    }).isRequired
  ).isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default HistoryTable;

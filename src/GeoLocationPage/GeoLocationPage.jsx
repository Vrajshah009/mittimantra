import React from 'react'
import { useState, useEffect } from "react";
import "./GeoLocationPage.css";

const GeoLocationPage = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [savedLocations, setSavedLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)

  const redirectToUserInput = () => {
    window.location.href = "/user-input";
  };

  useEffect(() => {
   if(!navigation.geolocation){
    setError("Genolocation is not supported by this browser")
    setLoading(false)
    return;
   }

   const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setLocaation({
        lat: latitude,
        lon: longitude
      })
      setError(null)
      setLoading(false)
    },
    (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("Location permission denied by user.");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location information unavailable. Please check your device settings.");
          break;
        case err.TIMEOUT:
          setError("Location request timed out. Please try again.");
          break;
        default:
          setError("An unknown error occurred while getting location.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
   )

   return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const mapSrc = `https://www.google.com/maps?q=${location.lat},${location.lon}&z=19&t=k&output=embed`;

  const handleSaveLocation = () => {
    setSavedLocations([...savedLocations, { ...location, name: locationName }]);
    setLocationName("");
  }


  return (
    <>
      <div className="geo-location-page">
        <div className='geo-location-content'>
          <div className='goe-location-details'>
            <div className='geo-location-box'>
              {location.lat && location.lon ? (
                <>
                  <div className='geo-location-detail'>Country: India</div>
                  <div className='geo-location-detail'>State: Gujarat</div>
                  <div className='geo-location-detail'>District: Anand</div>
                  <input type="text" placeholder="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} className='name-input-field' />
                  <div className='button' onClick={handleSaveLocation}>Save Location</div>
                  <div className='button' onClick={redirectToUserInput}>Next</div>
                </>
              ) : (
                <p>Tracking location...</p>
              )}
            </div>
          </div>
          <div className='geo-location-map'>
            {location.lat && location.lon ? (
              <>
                <iframe
                  src={mapSrc}
                  width="600"
                  height="450"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </>
            ) : (
              <p>Tracking location...</p>
            )}
          </div>
        </div>
        <div className='saved-location-content'>
          {savedLocations.length > 0 && (
            <div className='saved-locations'>
              <h2>Saved Locations</h2>
              <ul className='saved-location-list'>
                {savedLocations.map((loc, index) => (
                  <li key={index} onClick={() => setLocation({lat: loc.lat, lon: loc.lon})} className='saved-location'>
                    <div>Location Name: {loc.name}</div>
                    <div>Latitude: {loc.lat}</div>
                    <div>Longitude: {loc.lon}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GeoLocationPage
import React from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
//npm i use-places.autocomplete
//npm i @reach/combobox
import "./style.css";
import  GoogleMapStyle from "./GoogleMapSytle"
import  imglogo from "./recursos/logo.png"
import ubicacion from './recursos/ubicacion.png'
// npm install --save-dev @iconify/react @iconify/icons-ion
import { Icon} from '@iconify/react';
import locateIcon from '@iconify/icons-ion/locate';
import { useState, useEffect } from 'react';
import { IonLoading } from '@ionic/react';
const libraries = ["places"];
const GoogleMaps= (props) => {
  const { center, getGeoLocation, loading, maker1,setMaker1 } = props


  
//Cargar
const { isLoaded, loadError } = useLoadScript({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  libraries,
});

const [marker, setMarker] = React.useState([ {
  lat: 0,
  lng: 0,
  time: new Date(),
} ]);

//coordenadas iniciales



const onMarkerDragEnd = (coord) => {
  if (coord && coord.latLng) {
    const { latLng } = coord;
    setMaker1( latLng.lat(),latLng.lng())
    setMarker( [
      {
        lat: latLng.lat(),
        lng: latLng.lng(),
        time: new Date(),
      },
    ]);
  }
}
const mapContainer = {
  height: "100vh",
  width: "100vw",
};

const options = {
  styles: GoogleMapStyle,
  disableDefaultUI: true,

 // streetViewControl: true,
 // rotateControl: true,
 // fullscreenControl: true,
   // zoomControl: true,
  //mapTypeControl: true,
};



const ChangeCoord=( lat, lng ) => {
  setMaker1(  lat,lng)
  setMarker( [
    {
      lat: lat,
      lng: lng,
      time: new Date(),
    },
  ])
};

//referencia al mapa
const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
}, []);

useEffect(() => {
  const geo=()=>{
    getGeoLocation()
  }
  geo();
 
}, []);
//Validar Carga
  if (loadError) return <div>"Error al cargar el mapa"</div>;
  if (loading) return <IonLoading isOpen={loading } message={"Buscando tu ubicaciòn..."}/> 
  if (!isLoaded) return <IonLoading isOpen={!isLoaded} message={"Cargando mapa..."}/> 

  return (
    <>
 
    
    <div>
    <h1>
      <img className="logoimg"src={imglogo} alt="logoTome" />  
    </h1>
 
    <Search panTo={panTo} ChangeCoord={ChangeCoord}/>
    <Locate panTo={panTo} ChangeCoord={ChangeCoord} />
    
    <GoogleMap
    id="map"
    mapContainerStyle={mapContainer}
    center={center}
    zoom={16}
    options={options}
    onClick={e=>ChangeCoord(e.latLng.lat(), e.latLng.lng())}
    onLoad={onMapLoad}
    >

    {maker1.map((marker) => (
      console.log(marker),
      <Marker
        key={marker.time.toISOString()}
        position={{ lat: marker.lat, lng: marker.lng }}
        draggable={true}
        onDragEnd={e => onMarkerDragEnd(e)}
        icon={{
          url: ubicacion,
          scaledSize: new window.google.maps.Size(30, 50),
        }}
        />
      ))}
      
      </GoogleMap>
      </div></>
  );
  
}
function Locate({ panTo, ChangeCoord}) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords)
            const { latitude, longitude } =position.coords
            ChangeCoord(latitude, longitude);
            panTo({
              lat:  latitude,
              lng: longitude,
            });
          },
          () => null
        );
      }}
    >
        <Icon icon={locateIcon} className='locateimg' width="40px"/>
    </button>
  );
}

function Search({ panTo , ChangeCoord}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => -2.19616, lng: () => -79.88621},
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({address});
      const { lat, lng } = await getLatLng(results[0]);
      ChangeCoord( lat, lng );
      panTo({ lat, lng });
    } catch (error) {console.log("Error: ", error);}
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Busca el lugar"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );

 
}
export default GoogleMaps;
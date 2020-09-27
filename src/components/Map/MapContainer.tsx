import React, { Component } from 'react';
import MapCall from './GoogleMaps.js';
import { Capacitor, Plugins, CallbackID } from "@capacitor/core";
import LocationService from './Location';

const { Geolocation, Toast } = Plugins;

class HomeContainer extends Component {
    state: any;
    watchId: CallbackID = '';
    constructor(props: any) {
        super(props);
        
        this.state = {
            center: {
                lat: -2.19616,
                lng: -79.88621,
            },
            loading: false,
            maker:[ {
                lat: -2.19616,
                lng: -79.88621,
                time: new Date(),
              }]
        };
    }
    
    setMarker= async (lat:any,lng:any) =>{
        this.state.maker.map((marker: { lat: any; lng: any; time: Date; }) => (
            marker.lat= lat,
            marker.lng= lng,
            marker.time= new Date()
        ))
    }

    checkPermissions = async () => {
        const hasPermission = await LocationService.checkGPSPermission();
        if (hasPermission) {
            if (Capacitor.isNative) {
                const canUseGPS = await LocationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else {
                this.postGPSPermission(true);
            }
        }
        else {
            console.log('14');
            const permission = await LocationService.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNative) {
                    const canUseGPS = await LocationService.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                }
                else {
                    this.postGPSPermission(true);
                }
            }
            else {
                await Toast.show({
                    text: 'User denied location permission'
                })
            }
        }
    }

    postGPSPermission = async (canUseGPS: boolean) => {
        if (canUseGPS) {
            this.watchPosition();
        }
        else {
            await Toast.show({
                text: 'Please turn on GPS to get location'
            })
        }
    }

   watchPosition = async () => {
        try {
            this.setState({
                 loading: true
            })
            this.watchId = Geolocation.watchPosition({}, (position, err) => {

                if (err) {
                    return;
                }
                this.setState({
                   center: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    loading: false,
                    maker:[{
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        time: new Date(),
                    }],
                }, () => {
                    this.clearWatch();
                })
            })
        }
        catch (err) { console.log('err', err) }
    }
     Locate=()=> {
        
        navigator.geolocation.getCurrentPosition((position) => {
           
              this.state.center.lat= position.coords.latitude
              this.state.center.lng= position.coords.longitude
              this.state.vari=true
              console.log(this.state.center)
            })
    
    }

    clearWatch() {
        if (this.watchId != null) {
            Geolocation.clearWatch({ id: this.watchId });
        }
        this.setState({
            loading: false
        })
    }
   
    render() {
        const { center, loading ,maker} = this.state
        return (
            
            <MapCall
               center={center}
                getGeoLocation={this.checkPermissions}
                loading={loading}
                maker1={maker}
                setMaker1={this.setMarker}
            />

        );
    }
}

export default HomeContainer;
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Capacitor } from "@capacitor/core";
const LocationService = {
    askToTurnOnGPS: async (): Promise<boolean> => {
        return await new Promise((resolve, reject) => {
            LocationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    // iOS ignorará la opción de accuracy
                    LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => {
                            resolve(true);
                        },
                        error => { resolve(false); }
                    );
                }
                else { resolve(false); }
            });
        })
    },

    // comprobar permisos de acceso al GPS
    checkGPSPermission: async (): Promise<boolean> => {
        return await new Promise((resolve, reject) => {
            if (Capacitor.isNative) {
                AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                    result => {
                        if (result.hasPermission) {
                            // muestre el diálogo 'Activar GPS'
                            resolve(true);
                        } else {
                            // pedir permiso
                            resolve(false);
                        }
                    },
                    err => { alert(err); }
                );
            }
            else { resolve(true); }
        })
    },

    requestGPSPermission: async (): Promise<string> => {
        return await new Promise((resolve, reject) => {
            LocationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    resolve('CAN_REQUEST');
                } else {
                    // Mostrar el cuadro de diálogo 'Solicitud de permiso de GPS'
                    AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                        .then(
                            (result) => {
                                if (result.hasPermission) {
                                    // llamada para encender el GPS
                                    resolve('GOT_PERMISSION');
                                } else {
                                    resolve('DENIED_PERMISSION');
                                }
                            },
                            error => {
                                // si el usuario elige 'No, gracias'
                                alert('requestPermission Error requesting location permissions ' + error);
                            }
                        );
                }
            });
        })

    }
}
export default LocationService;
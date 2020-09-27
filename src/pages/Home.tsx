import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import GoogleMaps from '../components/Map/MapContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
       
        <GoogleMaps/>

      </IonContent>
    </IonPage>
  );
};

export default Home;

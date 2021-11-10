import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import React from 'react';



let renderPage = <>
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <canvas id="canvas"/>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
</>


const Tab1: React.FC = () => {
  return (renderPage);
};

export default Tab1;

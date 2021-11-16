import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import React from 'react';
import CanvasThing from './CanvasThing.js';
import CanvasJs from './CanvasJs.jsx';





const Tab1: React.FC = () => {

//removed evil <ioncontent> that caused bullshittery with my precious 
  return (<IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Canvas</IonTitle>
        </IonToolbar>
      </IonHeader>
        <CanvasJs />
    </IonPage>);
};

export default Tab1;

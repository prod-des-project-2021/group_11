import {IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import React, {useState} from 'react';
import CanvasThree from './canvas/CanvasThree.jsx';






const Tab1: React.FC = () => {

let [shapeArray, setShapeArray] = useState([])
/*const addShape =(n:any)=>{
  let tempArray:any = shapeArray.map(i => i)
  let newArray = tempArray.push(n)
  setShapeArray(newArray)

}*/


//removed evil <ioncontent> that caused bullshittery with my precious 
  return (<IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
          <CanvasThree id="models"/>
        </IonToolbar>
      </IonHeader>
        
    </IonPage>);
};

export default Tab1;

import {IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';
import './Tab1.css';
import React, {useState} from 'react';
import CanvasThree from './canvas/CanvasThree.jsx';




const Tab1: React.FC = () => {
let [ctrlMode, setCtrlMode] = useState("")
let changeMode = (key:String)=>{
  switch (key) {
    case "1":setCtrlMode("translate"); break;
    case "2":setCtrlMode("rotate"); break;
    case "3":setCtrlMode("scale"); break;
    default : setCtrlMode("translate"); break;
  }
}
//removed evil <ioncontent> that caused bullshittery with my precious
  return (<IonPage onKeyPress={(e:any)=>changeMode(e.key)} tabIndex={0}>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{textAlign: "center"}}>SimpleMaps <br/>Simple Maps For Simpletons Like Us!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <CanvasThree id="models" ctrlMode={ctrlMode}/>
    </IonPage>);
};

export default Tab1;

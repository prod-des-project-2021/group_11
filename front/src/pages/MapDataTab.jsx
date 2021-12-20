import React, { useState } from 'react';
import { IonPopover, IonContent, IonItem, IonLabel, IonButton, IonListHeader, IonSelect, IonSelectOption } from '@ionic/react';
import './canvasStyle.css'


export default function MapDataTab (props) {

  let [openMenu, closeMenu] = useState(false);
  var randoms
  let maps = props.maps

  let mapButtons = maps? maps.map((map,it) =><IonItem button onClick={()=>props.setMap(it)} key={map.map_id}>get {map.map_id}</IonItem>):null

openMenu ? randoms = (<>
 
    <IonPopover isOpen={true} >
      <IonContent>
        {mapButtons}
      </IonContent>
    </IonPopover>
  </> ): randoms = null


return (
<>
  <IonButton id="hover-button" onClick={() => closeMenu(!openMenu)} >Load map</IonButton>
  {randoms}
</>
);
};
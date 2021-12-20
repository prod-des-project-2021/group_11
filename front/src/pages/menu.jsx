import React, { useState } from 'react';
import { IonPopover, IonContent, IonItem, IonLabel, IonButton, IonListHeader, IonSelect, IonSelectOption } from '@ionic/react';
import './canvasStyle.css'




export const PopoverExample = (props) => {

  let [openMenu, closeMenu] = useState(false);
  var randoms
  let [nsize, setNSize] = useState("")

   

    openMenu ? randoms = (
    <>
        <IonPopover isOpen={true} >
          <IonContent>
            <IonItem button onClick={() => props.makeShape()}>Add Thing</IonItem>
            <IonItem>
              <IonLabel>Size</IonLabel>
              <IonSelect value={nsize} onIonChange={(e) => { setNSize(e.detail.value); closeMenu(false); closeMenu(true);}} okText="Okay" cancelText="Dismiss">
                <IonSelectOption value="small">small</IonSelectOption>
                <IonSelectOption value="medium">medium</IonSelectOption>
                <IonSelectOption value="large">large</IonSelectOption>
                <IonSelectOption value="huge">huge</IonSelectOption>
                <IonSelectOption value="gargantuan">gargantuan</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem button onClick={() =>{ props.addUnit(nsize)}}>Add Unit</IonItem>
            <IonItem button onClick={() => props.sendData()}>Get Json Data</IonItem>
            {/* <IonItem lines="none" detail={false} button onClick={onHide}>
            Close
            </IonItem> */}
          </IonContent>
        </IonPopover>
      </> ): randoms = null
  
  
  return (
    <>
      <IonButton id="hover-button" onMouseOver={() => closeMenu(!openMenu)} >Hover to open</IonButton>
      {randoms}
    </>
  );
};

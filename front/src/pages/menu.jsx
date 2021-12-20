/* import React from 'react';
import { IonButton, IonContent, IonItem, IonList, IonListHeader, IonPage, useIonPopover } from '@ionic/react';

export default PopoverList = (props) => {
  onHide()
    ({ onHide }); (
      <IonList>
        <IonListHeader>Click Me!</IonListHeader>
        <IonItem onClick={() => props.makeShape()}>Add Thing</IonItem>
        <IonItem onClick={() => props.addUnit()}>Add Unit</IonItem>
        <IonItem onClick={() => props.sendData()}>Get Json Data</IonItem>
        <IonItem button>GitHub Repo</IonItem>
        <IonItem lines="none" detail={false} button onClick={onHide}>
          Close
        </IonItem>
      </IonList>
    );
}

const PopoverExample = () => {
  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
  });

  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={(e) =>
            present({
              event: e.nativeEvent,
            })
          }
        >§
          Show Popover
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

interface props {

  makeShape: Function

}

export const PopoverList: React.FunctionComponent<{ onHide: () => void; }> = ({ onHide }) => (

  <IonList>
    <IonListHeader>Click Me!</IonListHeader>
    <IonItem onClick={() => props.makeShape()}>Add Thing</IonItem>
    <IonItem onClick={() => props.addUnit()}>Add Unit</IonItem>
    <IonItem onClick={() => props.sendData()}>Get Json Data</IonItem>
    <IonItem button>GitHub Repo</IonItem>
    <IonItem lines="none" detail={false} button onClick={onHide}>
      Close
    </IonItem>
  </IonList>

);

const PopoverExample: React.FunctionComponent = (props) => {
  const [present, dismiss] = useIonPopover(PopoverList, {
    onHide: () => dismiss(),
  });

  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={(e) =>
            present({
              event: e.nativeEvent,
            })
          }
        >
          Show Popover
        </IonButton>
      </IonContent>
    </IonPage>
  );
};


 */

import React, { useState } from 'react';
import { IonPopover, IonContent, IonItem, IonLabel, IonButton, IonListHeader, IonSelect, IonSelectOption } from '@ionic/react';
import './canvasStyle.css'

/* type Props = {

  makeShape: Function
  addUnit: Function
  sendData: Function

} */


export const PopoverExample = (props) => {

  let [openMenu, closeMenu] = useState(false);
  var randoms
  let [nsize, setNSize] = useState("")

   

    openMenu ? randoms = (
    <>
        <IonPopover isOpen={true} >
          <IonContent>
            <IonListHeader>Click Me!</IonListHeader>
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
            <IonItem button onClick={()=>{ props.addUnit(nsize)}}>Add Unit</IonItem>
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

/* const PopoverDisplay = () => {
  const [present, dismiss] = useIonPopover(PopoverExample, { onHide: () => dismiss() });
  
  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={(e) =>
            present({
              event: e.nativeEvent,
            })
          }
        >
          Show Popover
        </IonButton>
      </IonContent>
    </IonPage>
  );
}; */
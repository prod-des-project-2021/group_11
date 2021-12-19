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
import { IonPopover, IonContent, IonItem, IonLabel, IonButton, IonListHeader } from '@ionic/react';
import './canvasStyle.css'

/* type Props = {

  makeShape: Function
  addUnit: Function
  sendData: Function

} */


export const PopoverExample = (props) => {

  let [openMenu, closeMenu] = useState(null);

  function menuItems(props) {

    !openMenu ? closeMenu(

    <>
        <IonPopover isOpen={true} >
          <IonContent>
            <IonListHeader>Click Me!</IonListHeader>
            <IonItem button onClick={() => props.makeShape()}>Add Thing</IonItem>
            <IonItem button onClick={() => props.addUnit()}>Add Unit</IonItem>
            <IonItem button onClick={() => props.sendData()}>Get Json Data</IonItem>
            {/* <IonItem lines="none" detail={false} button onClick={onHide}>
            Close
            </IonItem> */}
          </IonContent>
        </IonPopover>
    </> ): closeMenu(null)
  }

  return (
    <>
      <IonButton id="hover-button" onMouseOver={() => menuItems()} >Hover to open</IonButton>
        {openMenu} 
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
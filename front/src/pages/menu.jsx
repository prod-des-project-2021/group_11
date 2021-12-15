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

/* type Props = {

  makeShape: Function
  addUnit: Function
  sendData: Function

} */


export const PopoverExample = (props) => {
  

  return (
    <>
      {/* Default */}
      <IonPopover isOpen={true}>
        <IonContent>
          <IonListHeader>Click Me!</IonListHeader>
          <IonItem onClick={() => props.makeShape()}>Add Thing</IonItem>
          <IonItem onClick={() => props.addUnit()}>Add Unit</IonItem>
          <IonItem onClick={() => props.sendData()}>Get Json Data</IonItem>
          <IonItem button>GitHub Repo</IonItem>
          {/* <IonItem lines="none" detail={false} button onClick={onHide}>
            Close
          </IonItem> */}
        </IonContent>
      </IonPopover>
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
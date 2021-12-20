import React, { useState, useEffect } from 'react';
import { IonContent, IonButton, IonInput } from '@ionic/react';

export default function Login(props) {

    let [username, setUsername] = useState('')
    let [password, setPassword] = useState('')

    //props.login(username, password)

    openMenu ? randoms(
        <>
            <IonPopover>
                <IonContent>
                    <IonButton onClick={() => loginUser()}>Login!</IonButton>
                </IonContent>
            </IonPopover>
        </>
    ) : randoms = null




    return (
        <>
            <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)} />
            <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)} />
            {randoms}
        </>

    )


}
import React, { useState, useEffect } from 'react';
import { IonContent,  IonButton, IonInput } from '@ionic/react';

export default function Login (props) {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    function loginUser () {
        props.login(username, password)
    }
    
    return (<>
        <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
        <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
        <IonButton onClick={()=>loginUser()}>Login!</IonButton></>
    )
}
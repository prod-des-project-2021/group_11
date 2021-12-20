import React, { useState, useEffect } from 'react';
import { IonContent,  IonButton, IonInput } from '@ionic/react';

<<<<<<< HEAD
export default function Login (props) {
=======
export function Login () {
>>>>>>> three-js
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
<<<<<<< HEAD
    function loginUser () {
        props.login(username, password)
    }
    
    return (<>
        <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
        <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
        <IonButton onClick={()=>loginUser()}>Login!</IonButton></>
=======
    function userLogin () {

    }
    
    return (
            <IonContent>
                <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
                <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
                <IonButton onClick={userLogin()}>Login!</IonButton>
                <p>Don't have an account? Create one now!</p>
            </IonContent>
>>>>>>> three-js
    )
}
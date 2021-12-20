import React, { useState, useEffect } from 'react';
import { IonContent, IonItem, IonLabel, IonButton, IonHeader, IonListHeader, IonSelect, IonSelectOption, IonIcon, IonInput, IonToolbar } from '@ionic/react';

export function Login () {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    function userLogin () {

    }
    
    return (
            <IonContent>
                <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
                <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
                <IonButton onClick={userLogin()}>Login!</IonButton>
                <p>Don't have an account? Create one now!</p>
            </IonContent>
    )
}
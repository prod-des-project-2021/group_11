import React, { useState, useEffect } from 'react';
import { IonContent, IonItem, IonLabel, IonButton, IonHeader, IonListHeader, IonSelect, IonSelectOption, IonIcon, IonInput, IonToolbar } from '@ionic/react';

export function login () {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    function userLogin () {
        
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome to DnD Character Map! Please Log In!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
                <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
                <IonButton onClick={loginUser}>Login!</IonButton>
            </IonContent>
        </IonPage>
    )
}
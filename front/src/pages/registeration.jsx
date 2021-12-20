import React, { useState, useEffect } from 'react';
import { IonContent, IonItem, IonLabel, IonButton, IonHeader, IonListHeader, IonSelect, IonSelectOption, IonIcon, IonInput, IonToolbar } from '@ionic/react';

export function Register () {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    function userRegister () {
        
    }
    
    return (

            <IonContent>
                <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
                <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
                <IonInput placeholder="Confirm Password" onIonChange={e => setConfirmPassword(e.target.value)}/>
                <IonButton onClick={userRegister()}>Register</IonButton>
                <p>Registered already? Click to Log in!</p>
            </IonContent>
        
    )
}
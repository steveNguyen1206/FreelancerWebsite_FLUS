import React, { useState } from 'react';
import userDataService from '@/services/userDataServices';
import gmailService from '@/services/gmailServices';
import { useParams } from 'react-router-dom';

const TryGmail = () => {

    const handleGmail = () => {
        gmailService.gmail()
            .then(response => {
                // Handle the response data
                console.log(response);
                console.log('Update successful');
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
                console.log('Update failed');
            });
    }

    return (
        <div>
            <button onClick={handleGmail}>Update Avatar</button>
        </div>
    );
    
};


export default TryGmail;
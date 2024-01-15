import React from "react";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import "./offerDetailPopup.css";
import contactService from '@/services/contactServices';
import OfferDetailTag from "@/components/Offer/offerDetailTag";

const OfferDetailPopup = ({setPopUpAppear, checkOwner}) => {
  const { id } = useParams();
  const [contactOnes, setContactOnes] = useState([]);
  useEffect(() => {
    fetchContacts();
  }, []);
  const [numberOffer, setNumberOffer] = useState(0);
  const fetchContacts = async () => {
    try {
      const contactsData = await contactService.findZeroStatusBids(id);
      setContactOnes(contactsData.data);
      console.log('data', contactsData.data);
      const countBid = await contactService.countBids(id);
      setNumberOffer(countBid.data);
    } catch (error) {
      console.error('Error fetching Bid:', error);
    }
  };


  const handleExitClick = () => {
    setPopUpAppear(false);
  };

  return (
    <div className="popup-container-background">
      <div className="popup-container-offer">
        <div className="row-wrapper">
          <div className="exit-container" onClick={handleExitClick}>
            <div className="text-wrapper">x</div>
          </div>
        </div>
          
          <div className="div-wrapper">
            <div className="text-wrapper-title">Applications</div>
          </div>
          <div className="avg">
            <div className="text-wrapper-2">{numberOffer} Offers</div>
          </div>
          
          <div className="offer-container">
            {/* <OfferDetailTag/>
            <OfferDetailTag/>
            <OfferDetailTag/>
            <OfferDetailTag/> */}
            {contactOnes.map((contactOne) => (
              <OfferDetailTag contactOne={contactOne} checkOwner={checkOwner}/>
            ))}
          </div>
      </div>
    </div>
    
  );
};

export default OfferDetailPopup;
import React from 'react'
import "./star.css"
import Rating from 'react-rating';
import starFull from "../../assets/StarRating/starFullGreen.png"
import starEmpty from "../../assets/StarRating/starEmpty.png"

const star = ({rating, width}) => {
    // const percentage = (rating / 5) * 100;
    return(
        <div className="ratingContainer" style={{width:width}} >
            <Rating start={0} stop={5} step={1} fractions={10} 
            readonly={true}
            initialRating={rating}
            emptySymbol={<img src={starEmpty} className="icon" alt='star empty'/>}
            fullSymbol={<img src={starFull} className="icon" alt='star full' />}
            style={{fontSize:"100%"}}
            />
            
        </div>
        
    );
}
export default star
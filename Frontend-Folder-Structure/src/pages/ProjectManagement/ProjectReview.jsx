import React from "react";
import "./style.css";
import StarModifier from "@/components/StarRating/star-modified";
import { TextField } from "@mui/material";
import reviewService from "@/services/reviewServices";
import { useProjectManageContext } from "./ProjectManageProvider";
import { useEffect } from "react";

export const ProjectReview = ()=> {

    const {isOwn, project, error, setError} = useProjectManageContext();

    let review = {
        rating: 0,
        message: "",   
        reviewer_id: (isOwn) ? project.owner_id : project.member_id,
        reviewee_id: (isOwn) ? project.member_id : project.owner_id,
        type: (isOwn) ? 1:0,
    }

    const handleMessageChange = (event) => {
        const { name, value } = event.target;
        review.message = value;
        console.log(review);
    };
    
    const handleRatingChange = (value) => {
    review.rating = value;
      console.log(review);
    };

    const ValidateReview = () => {
        console.log(review);
        if (review.rating == 0 || review.message == "") {
            console.log("false")
          return false;
        }
        return true;
      };

    const handleSubmit = () => {
        if(ValidateReview())
        {
            reviewService
            .createReview(project.id, review, localStorage.getItem('AUTH_TOKEN'))
            .then((response) => {
              console.log(response.data);
            })
            .catch((e) => {
              console.log(e);
            });
            setError(null);
        }
        else
        {
            setError("Please fill in the message and pick a rate");
        }
    }

    useEffect(() => {
        setError(null);
        }
    , []);

    return (
        <div className="project-content-container" style={{justifyContent: 'center'}}>
            <div className="project-content-container" style={{padding: '24px'}}>

             <div className="field-container">
                <div className="title-text">Make a rating to your partner</div>
              </div>
            <div className="" style={{height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            
                <StarModifier key={"count"} onChange={handleRatingChange}/> 
                
              
            </div>  
            </div>

            <div className="project-content-container" style={{padding: '24px'}}>
                <div className="title-text" style={{ marginTop: 16 }}>
                    Write your review here
                </div>
                <TextField
                multiline
                name="message"
                placeholder="Your are a wonderfull partner!"
                sx={{ backgroundColor: '#EBE8E8' }}
                minRows={5}
                onChange={handleMessageChange}
                style={{width: '100%'}}
                />
                </div>

            <div style={{ height: '30px', width: '100%' }}> 
              <div className="value-text --size-14 --color-error">{error}</div>
            </div>
            <button
                className="my-button --button-green"
                onClick={handleSubmit}
              >
                Send your review
              </button>
        </div>
    )

};

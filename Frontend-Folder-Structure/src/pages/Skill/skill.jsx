import React from 'react';
import vietnam from '../../assets/vietnam.png';
import profileimage from '../../assets/profile_image.png';
import './Skill.css';
import { StarRating } from '@/components';
import delivery from '../../assets/delivery.png';
import revision from '../../assets/revision.png';
import github from '../../assets/github.png';
import line from '../../assets/line.png';
import Comment from '@/components/Comment/CommentProjectPost';
import { Carousel } from 'react-bootstrap';

const Skill = () => {
  let skillTitle = 'SEO, Link Building, Marketing, Google Adwords, WordPress';

  return (
    <div className="sskill">
      <button className="button-edit-skill">Edit</button>
      <div className="skill-title">
        <p>{skillTitle}</p>
      </div>
      <div className="main-skill">
        <div className="left-skill">
          <div className="main-post">
            <div className="border-skill-title"></div>
            <div className="skill-post">
              <div className="skill-poster">
                <img src={profileimage} alt="profile" />
                <div className="skill-name-rating-left">
                  <div className="skill-name-wrapper-left">
                    <div className="skill-name-left">Nguyen Thi Truc </div>
                    <div className="skill-username-left">(cogai20)</div>
                    <div className="skill-location-left">
                      <img src={vietnam} alt="vietnam" />
                    </div>
                  </div>
                  <div className="skill-rating-left">
                    <StarRating rating={4} />
                    <div className="skill-stars-left">
                      <p>4.0</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="skill-body">
                <Carousel>
                  <Carousel.Item>
                    <img src={github} alt="github" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img src={github} alt="github" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img src={github} alt="github" />
                  </Carousel.Item>
                </Carousel>

                <div className="skill-detail">
                  No logo? Bad logo? Ugly logo? Don't stress! I've got you
                  covered with high-quality, unique logos tailored to your
                  brand. Make a great first impression with a professional,
                  high-end design. With 20+ years of design and branding
                  experience, I can make you and your brand look good. Why
                  Should we work together? I specialise in developing Brand
                  Identities for new startups and companies. I have an adaptive
                  design style that helps me find solutions for any personality
                  or business genre.
                  <br />
                  Why Should we work together? I specialise in developing Brand
                  Identities for new startups and companies. I have an adaptive
                  design style that helps me find solutions for any personality
                  or business genre.
                </div>

                <div className="seller-detail">
                  <div className="seller-detail-title">
                    <p>About the seller</p>
                  </div>
                  <div className="seller-detail-body">
                    I'm a full-time graphic designer/art director with over a
                    decade of professional experience. I provide the
                    highest-quality graphic design: branding, logo design,
                    photoshop editing, illustrations, typographic designs,
                    posters, brochures, postcards, invitations, and folder
                    design. As a highly motivated, dedicated, and skilled
                    professional, I will make sure my designs and services are
                    on par with your expectations. I strove deeper into the
                    design field and took my talent to the field of graphic
                    design as an independent contractor. Don't forget to SAVE my
                    gig!!
                  </div>
                </div>
              </div>
            </div>
            <div className="skill-line">
              <img src={line} alt="line" />
            </div>
          </div>

          <div className="reviews-skill">
            <div className="reviews-skill-title">
              <div className="review-title-and-star">
                <p>Reviews</p>
                <StarRating rating={4} />
                <p>4.0</p>
              </div>
              <div className="num-reviews">
                <p>1 review</p>
              </div>

              <div className="review-skill-detail">
                <Comment />
              </div>
            </div>
            <div className="skill-line">
              <img src={line} alt="line" />
            </div>
          </div>
        </div>

        <div className="right-skill">
          <div className="skill-price">$500-$700</div>
          <div className="skill-title-right">
            1 Professional Logo concept + Jpeg + PNG
          </div>

          <div className="skill-right-time">
            <div className="skill-right-delivery"></div>
            <div className="skill-right-revision"></div>
          </div>
          <div className="skill-right-description">
            <ul>
              <li>1 concept included</li>
              <li>Logo transparency</li>
              <li>Include 3D mockup</li>
              <li>Include source file</li>
              <li>Include social media kit</li>
              <li>Printable file</li>
              <li>Vector file</li>
            </ul>
          </div>
          <div className="button-hire-and-contact">
            <button className="button-hire">Hire Me</button>
            <button className="button-contact">Contact Me</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skill;

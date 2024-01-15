import React from 'react';
import './card.css';
import vietnam from '../../assets/vietnam.png';
import userDataService from '@/services/userDataServices';
import categoryServices from '@/services/categoryServices';

const SmallProj = () => {
  return (
    <div className="ctn">
      <div className="overlap-11">
        <div className="img-2">
          <div className="overlap-group-3">
            <div className="text-wrapper-12">Image</div>
          </div>
        </div>
        <div className="gr-tags">
          <div className="gr">
            <div className="overlap-group-4">
              <div className="text-wrapper-13">AI</div>
            </div>
          </div>
          <div className="gr-tag">
            <div className="overlap-12">
              <div className="text-wrapper-14">UI/UX</div>
            </div>
          </div>
        </div>
        <p className="detail-text">
          {' '}
          Detail text here hjhjhjhj <br /> Hello everyone, my name is Duy Khang
          Ho. This job is hard...{' '}
        </p>
        <div className="gr-title">
          <div className="overlap-13">
            <p className="p">This is a long header / title ...</p>
          </div>
        </div>
        <div className="budget">$500-700</div>
        <div className="group-11">
          <div className="overlap-14">
            <div className="text-wrapper-15">Go to Project</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export { SmallProj };

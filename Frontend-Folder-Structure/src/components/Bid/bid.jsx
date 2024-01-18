import './bid.css';
import bidServices from '@/services/bidServices';
import gmailService from '@/services/gmailServices';

const Bid = ({ bid, onChangeBid, onChangeProjectId, isOwnerProjectPost }) => {
  let projectId = 0;

  const handleAccept = () => {
    bidServices
      .acceptBid(bid.id, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        console.log('response: ', response);
        onChangeBid();
        const emailData = {
          email: bid.email,
          url: 'http://localhost:8081/project-manage/' + response.data.projectId,
        };
        console.log('emailData: ', emailData);
        gmailService.sendEmail(emailData).then((response) => {
          console.log('response: ', response);
        });
        onChangeProjectId(response.data.projectId);
        projectId = response.data.projectId;
      });
  };

  const handleReject = () => {
    bidServices
      .rejectBid(bid.id, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        console.log('response: ', response);
        onChangeBid();
      });
  };

  return (
    <div className="bid-cont">
      <div className="bid-header">
        <div className="image-profile">
          <img src={bid.user.avt_url} alt="profile" />
        </div>
        <div className="bid-username">
          <h5>{bid.user.account_name}</h5>
          <p style={{ color: 'green' }}>{bid.subcategory.subcategory_name}</p>
        </div>
        <div className="bid-rating">
          <p>{bid.user.avg_rating}</p>
        </div>
      </div>
      <div className="bid-body-detail">
        <div className="bid-price">
          <p>{bid.price + '$'}</p>
        </div>
      </div>
      {isOwnerProjectPost && (
        <div className="bid-button">
          <button className="reject" onClick={handleReject}>
            Reject
          </button>
          <button className="accept" onClick={handleAccept}>
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default Bid;

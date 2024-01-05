import './bid.css';
import bidServices from '@/services/bidServices';
import gmailService from '@/services/gmailServices';
import projectPostServices from '@/services/projectPostServices';
import projectService from '@/services/projectServices';

const Bid = ({
  bidId,
  username,
  price,
  skill,
  profileImage,
  rating,
  email,
  projectId,
  onChangeBid,
  duration,
  freelancerId,
}) => {
  const [projectDetail, setProjectDetail] = useState({});

  useEffect(() => {
    bidServices.getProjectPostfromBid(bidId).then((response) => {
      setProjectDetail(response.data);
    });
  }, []);

  const handleAccept = () => {
    console.log('accept');
    bidServices.changeBidStatus(bidId, 1).then((response) => {
      console.log('response: ', response);

      console.log(email);
      // send email to freelancer
      const emailData = {
        email: email,
        url: 'http://localhost:3000/project-detail/' + projectId,
      };

      // TODO: Change url to correct project management page for freelancer

      gmailService.sendEmail(emailData).then((response) => {
        console.log('response: ', response);
      });

      // change other bids to rejected
      bidServices.changeOtherBidStatus(bidId, -1).then((response) => {
        console.log('response: ', response);
      });

      // change project post status
      projectPostServices.changeStatus(projectId, 0).then((response) => {
        console.log('response: ', response);
      });

      const today = new Date();
      const date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();

      // endDate = currentDate + duration
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      const endDateString =
        endDate.getFullYear() +
        '-' +
        (endDate.getMonth() + 1) +
        '-' +
        endDate.getDate();

      const projectData = {
        name: projectDetail.title,
        description: projectDetail.detail,
        startData: date,
        endDate: endDateString,
        budget: price,
        bid_id: bidId,
        tag_id: projectDetail.tag_id,
        owner_id: projectDetail.user_id,
        member_id: freelancerId,
      };

      // TODO: create project
      projectService.createProject(projectData).then((response) => {
        console.log('response: ', response);
      });

      // TODO: navigate to project detail page
      onChangeBid();
    });
  };

  const handleReject = () => {
    console.log('reject');
    bidServices.changeBidStatus(bidId, -1).then((response) => {
      console.log('response: ', response);
      onChangeBid();
    });
  };

  return (
    <div className="bid-cont">
      <div className="bid-header">
        <div className="image-profile">
          <img src={profileImage} alt="profile" />
        </div>
        <div className="bid-username">
          <h5>{username}</h5>
          <p style={{ color: 'green' }}>{skill}</p>
        </div>
        <div className="bid-rating">
          <p>{rating}</p>
        </div>
      </div>
      <div className="bid-body-detail">
        <div className="bid-price">
          <p>{price + '$'}</p>
        </div>
      </div>

      <div className="bid-button">
        <button className="reject" onClick={handleReject}>
          Reject
        </button>
        <button className="accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default Bid;

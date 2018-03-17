import React from 'react';

const PayoutList = (props) => {
  if (props.payoutList.length == 0) {
    return <h3 className="col-md-6 col-md-offset-1 col-sm-12">No Payout History Available</h3>
  } else {
    return (
      <p>{props.payoutList}</p>
    )
  }
};

export default PayoutList;

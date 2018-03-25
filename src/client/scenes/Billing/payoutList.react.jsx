import React from 'react';
import { Table, TableRow } from '../../components/tables.react';

const PayoutList = (props) => {
  const { payoutList } = props;
  if (payoutList.length === 0) {
    return <h3 className="col-md-6 col-md-offset-1 col-sm-12">No Payout History Available</h3>
  } else {
    return (
      <Table className="table table-hover">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Created</th>
            <th>Arrival Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="table-striped">
          {payoutList.map((record) => {
            return (
              <TableRow key={record.id}>
                <td>{record.balance_transaction}</td>
                <td>{record.created}</td>
                <td>{record.arrival_date}</td>
                <td>{record.amount}</td>
                <td>{record.status}</td>
              </TableRow>
            ) 
          })}
        </tbody>
      </Table>
    );
  }
};

export default PayoutList;

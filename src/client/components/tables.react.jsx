import React from 'react';

export function Table(props) {
  const { className, style, children } = props; // eslint-disable-line
  let self = this;
  return (
    <table
      className={className}
      style={style}
      ref={(node) => {
          console.log('THIS ON TABLE', self);
          self.tableNode = node;
          return self.tableNode;
        }
      }
    >
      {children}
    </table>
  );
}

export function TableRow(props) {
  const { className, style, children } = props; // eslint-disable-line
  let self = this;
  return (
    <tr
      className={className}
      style={style}
      ref={(node) => {
          console.log('inside row node this is:', self);
          self.tableRowNode = node;
          return self.tableRowNode;
        }
      }
    >
      {children}
    </tr>
  );
}

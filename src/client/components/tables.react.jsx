import React from 'react';

export function Table(props) {
  const { className, style, children } = props; // eslint-disable-line
  return (
    <table
      className={className}
      style={style}
      ref={(node) => {
          console.log('THIS ON TABLE', this);
          this.tableNode = node;
          return this.tableNode;
        }
      }
    >
      {children}
    </table>
  );
}

export function TableRow(props) {
  const { className, style, children } = props; // eslint-disable-line
  return (
    <tr
      className={className}
      style={style}
      ref={(node) => {
          console.log('inside row node this is:', this);
          this.tableRowNode = node;
          return this.tableRowNode;
        }
      }
    >
      {children}
    </tr>
  );
}

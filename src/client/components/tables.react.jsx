import React from 'react';

export function Table(props) {
  const { className, style, children } = props; // eslint-disable-line
  return (
    <table
      className={className}
      style={style}
      ref={(node) => {
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
      className={this.props.className}
      style={this.props.style}
      ref={(node) => {
          this.tableRowNode = node;
          return this.tableRowNode;
        }
      }
    >
      {children}
    </tr>
  );
}

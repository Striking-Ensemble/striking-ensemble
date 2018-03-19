import React from 'react';

export function Table(props) {
  const { className, style, children } = props; // eslint-disable-line
  return (
    <table
      className={className}
      style={style}
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
    >
      {children}
    </tr>
  );
}

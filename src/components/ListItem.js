import React from 'react';
import { formatMoney } from '../utils/formatMoney';

export const ListItem = (props) => {
  const {name, company, salary, currency, onEdit, handleEdit, id}= props.props;
  const color= salary < 10000 ? 'red' : '#58eb34';
  const printSalary= currency === 'USD' ? salary / 21.5 : salary;
  const picture= `image${id}`;

  return (
    <tr style={{ cursor: onEdit ? 'pointer' : 'auto' }} onClick={() => onEdit && handleEdit(name, company, salary, id)}>
      <td>
        <img
          src={localStorage.getItem(picture) || localStorage.getItem('image0')}
          alt="Profile pic"
        />
      </td>
      <td>{name}</td>
      <td>{company}</td>
      <td style={{ textAlign: 'right', color, fontFamily: '"Lucida Console", Monaco, monospace' }}>${formatMoney(printSalary)}</td>
    </tr>
  );
};
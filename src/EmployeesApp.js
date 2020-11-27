import React, { useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import data from './media/employees.json';
import { ListItem } from './components/ListItem';
import { Video } from './components/Video';

const modalStyles= {
  content: {
    borderRadius  : '10px',
    bottom        : 'auto',
    left          : '50%',
    marginRight   : '-50%',
    padding       : '0',
    right         : 'auto',
    top           : '50%',
    transform     : 'translate(-50%, -50%)'
  }
};

const headerStyles= {
  marginBottom    : '5px',
  marginLeft      : 'auto',
  marginRight     : 'auto',
  marginTop       : '10px'
};

const imgColumnStyles= {
  borderTopLeftRadius   : '5px',
  width                 : '35px'
};

const salaryColumnStyles= {
  borderTopRightRadius  : '5px',
  textAlign             : 'right'
};

const initForm= {
  name      : '',
  company   : '',
  salary    : 0,
  // id        : 0
};

Modal.setAppElement('#root');

export const EmployeesApp = () => {

  localStorage.setItem('image0', require('./media/user.jpg'));
  const [employees, setEmployees] = useState(JSON.parse(localStorage.getItem('employees')) || data);

  const [currency, setCurrency] = useState('MXN');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [picModalIsOpen, setPicModalIsOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [formValues, setFormValues] = useState(initForm);

  const { name, company, salary, id }= formValues;

  const handleNewSubmit= e => {
    e.preventDefault();
    const newId= employees[employees.length - 1].id + 1;
    localStorage.setItem(`image${newId}`, localStorage.getItem(`imageTemp`) || localStorage.getItem('image0'));
    const newEmployees= [...employees, {...formValues, id: newId}];
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const handleEditSubmit= e => {
    e.preventDefault();
    localStorage.setItem(`image${formValues.id}`, localStorage.getItem(`imageTemp`) || localStorage.getItem(`image${formValues.id}`) || localStorage.getItem('image0'));
    const i= employees.indexOf(employees.find(employee => formValues.id === employee.id));
    const newEmployees= [...employees];
    // newEmployees[i]= formValues;
    newEmployees[i]= {
      name: formValues.name,
      company: newEmployees[i].company,
      salary: formValues.salary,
      id: formValues.id
    };
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const handleEdit= (name, company, salary, id) => {
    setFormValues({ name, company, salary, id });
    setModalIsOpen(true);
  };

  const handleInputChange= ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  };

  const handleSearchChange= ({target}) => {
    setSearch(target.value);
  };

  const closeVideo= image => {
    image && localStorage.setItem('imageTemp', image);
    setPicModalIsOpen(false);
  };

  const changeCurrency= useCallback(
    () => {
      if(currency === 'MXN') {
        setCurrency('USD');
      } else {
        setCurrency('MXN');
      }
    },
    [currency],
  );

  useEffect(() => {
    setFilteredEmployees(employees.filter(employee => employee.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || employee.company.toLocaleLowerCase().includes(search.toLocaleLowerCase())));
  }, [search, employees]);
      
  return (
    <div className='first'>
      <h1 className='header'>Empleados: {employees.length}</h1>
      <div className='main'>
        <Modal
          isOpen={modalIsOpen}
          style={modalStyles}
          onRequestClose={() => {
            localStorage.removeItem('imageTemp');
            setModalIsOpen(false);
          }}
        >
          <form onSubmit={e => {
            onEdit ? handleEditSubmit(e) : handleNewSubmit(e)
            localStorage.removeItem('imageTemp');
            setModalIsOpen(false);
          }}>
            <h1 style={ headerStyles }>Nuevo empleado</h1>
            <img
              onClick={() => {
                setPicModalIsOpen(true);
              }}
              className= 'big'
              src={ localStorage.getItem(`imageTemp`) || localStorage.getItem(`image${id}`) || localStorage.getItem('image0') }
              alt="Profile pic"
              data-tip
              data-for='image'
            />
            <ReactTooltip
              id='image'
              place='bottom'
              type='info'
              effect='solid'
            >
              Click para tomar nueva foto
            </ReactTooltip>
            <label>Nombre completo</label>
            <input 
              type='text'
              name='name'
              placeholder='Nombre completo'
              autoComplete='off'
              value= {name}
              onChange= {handleInputChange}
            />
            <label>Compañía</label>
            <input
              type='text'
              name='company'
              placeholder='Compañia'
              autoComplete='off'
              value= {company}
              onChange= {handleInputChange}
              disabled= {onEdit}
              style={ onEdit ? { pointerEvents: 'none' } : {}} // Remove efects from company input
            />
            <label>Salario (MXN)</label>
            <input 
              type='number'
              name='salary'
              placeholder='Salario mensual'
              autoComplete='off'
              value= {salary}
              onChange= {handleInputChange}
            />
            <button
              className='button'
              type='submit'
            >
              Guardar
            </button>
            <button
              className='button red'
              onClick={() => {
                localStorage.removeItem('imageTemp');
                setModalIsOpen(false);
              }}
            >
              Cancelar
            </button>
          </form>
        </Modal>

        {/* VIDEO BELOW */}
        {
          picModalIsOpen && <Video props={{ closeVideo }}/>
        }

        <div className='headers'>
          <input 
            className='search'
            type='text'
            name='search'
            placeholder='Buscar'
            autoComplete='off'
            value= {search}
            onChange= {handleSearchChange}
          />
          <h1
            className={`currency ${currency}`}
            onClick= {changeCurrency}
            data-tip        
            data-for='currencyTooltip'
          >
            {currency}
          </h1>
          <ReactTooltip
            id='currencyTooltip'
            place='bottom'
            type='light'
            effect='solid'
          >
            {`Click para cambiar a ${currency === 'USD' ? 'MXN' : 'USD'}`}
          </ReactTooltip>
        </div>
        <table cellSpacing='0'>
          <thead>
            <tr>
              <th style={ imgColumnStyles }>   </th>
              <th>Nombre</th>
              <th>Compañía</th>
              <th style={ salaryColumnStyles }>Salario</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredEmployees.map(employee => (
                <ListItem key={employee.id} props={{
                  id: employee.id,
                  name: employee.name,
                  company: employee.company,
                  salary: employee.salary,
                  currency,
                  onEdit,
                  handleEdit
                }} />
              ))
            }
          </tbody>
        </table>
        <br />
        <div className='actions'>
          {
            !onEdit
            &&
            (<button
              className='main-button'
              onClick={() => {
                setFormValues(initForm);
                setModalIsOpen(true);
              }}
            >
              Añadir
            </button>)
          }
          <button
            className='main-button'
            onClick={() => setOnEdit(!onEdit)}
          >
            {onEdit ? 'Finalizar' : 'Editar'}
          </button>
        </div>
      </div>
    </div>
  );
};
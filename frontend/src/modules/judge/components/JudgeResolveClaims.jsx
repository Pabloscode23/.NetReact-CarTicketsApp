import React, { useState } from 'react';
import '../styles/JudgeResolveClaims.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "../../../modules/tickets/styles/AllUserTickets.css";

const reclamos = [
  { id: 1234, date: '28/10/2024', reason: 'Exceso de velocidad', status: "Pendiente", documentUrl: '/documents/doc1234.pdf' },
  { id: 5678, date: '20/09/2024', reason: 'Manejo sin uso del cinturón de seguridad', status: "Pendiente", documentUrl: '/documents/doc5678.pdf' },
  { id: 4658, date: '19/02/2024', reason: 'Exceso velocidad', status: "Pendiente", documentUrl: '/documents/doc4658.pdf' },
  { id: 3456, date: '15/06/2024', reason: 'Manejo sin uso del cinturón de seguridad', status: "Pendiente", documentUrl: '/documents/doc3456.pdf' },
  { id: 4823, date: '29/05/2024', reason: 'Exceso velocidad', status: "Pendiente", documentUrl: '/documents/doc4823.pdf' },
];

export const JudgeResolveClaims = () => {
  const [claims,setClaims]=useState(reclamos)
  const [filteredClaims,setFilteredClaims]=useState(reclamos)

  // Función para manejar la descarga de documentos
  const handleViewDocuments = (documentUrl) => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `documento.pdf`; // Nombre del archivo al descargar
    link.click();
    alert(`Descargando documento: ${documentUrl}`);
  };

  //Para aceptar un reclamo
  const handleAccept = async (id) => {
    try {
      await axios.post(`/api/claims/${id}/accept`);
      alert(`Reclamo aceptado.`);
    } catch (error) {
      console.error(error);
      alert(`Error al aceptar el reclamo con ID ${id}`);
    }
  };

  // Para denegar un reclamo
  const handleDeny = async (id) => {
    try {
      await axios.post(`/api/claims/${id}/deny`);
      alert(`Reclamo con ID ${id} denegado.`);
    } catch (error) {
      console.error(error);
      alert(`Error al denegar el reclamo con ID ${id}`);
    }
  };

  return (
    <div className="container__tickets">
      <h1>Resolver reclamos</h1>
      <p>Aquí el juez puede resolver el reclamo y ver el documento del reclamo.</p>
      <div className="search__container">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
        <input
        onInput={(e)=>{ 
          if (e.target.value == "") {
            setFilteredClaims(claims)
          } else{
            const filtered=claims.filter((c)=>c.id==e.target.value)
            setFilteredClaims(filtered)
          }
        }}
          type="text"
          placeholder="Buscar reclamo"
          className="search__ticket"
        />
      </div>
      <table className="ticket-table">
        <thead>
          <tr className='table__head'>
            <th>ID multa</th>
            <th>Fecha</th>
            <th>Razón de multa</th>
            <th>Estado</th>
            <th>Documentos asociados</th>
            <th>Acción</th>
            <th></th>

          </tr>
        </thead>
        <tbody className='table__children'>
          {filteredClaims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.id}</td>
              <td>{claim.date}</td>
              <td>{claim.reason}</td>
              <td>{claim.status}</td>
              <td>
                <div className='ver-documento'><button
                  onClick={() => handleViewDocuments(claim.documentUrl)}
                  className="btn-view"
                >
                  Ver Documentos
                </button>  </div>
              </td>
              <td>
                <div className='aceptar'>
                <button
                  onClick={() => handleAccept(claim.id)}
                  className="aceptar"
                >
                  Aceptar
                </button>
                </div>
              </td>
              <td>
                <div className='denegar'>
                <button
                  onClick={() => handleDeny(claim.id)}
                  className="denegar-btn "
                >
                  Denegar
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


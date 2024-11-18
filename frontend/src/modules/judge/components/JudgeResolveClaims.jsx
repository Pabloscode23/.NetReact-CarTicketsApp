import { useEffect, useState } from 'react';
import '../styles/JudgeResolveClaims.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "../../../modules/tickets/styles/AllUserTickets.css";
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';



export const JudgeResolveClaims = () => {
  const { user, fetchUser: refetch } = useAuth();
  const [claims, setClaims] = useState(null);
  const [filteredClaims, setFilteredClaims] = useState(null);


  //Para aceptar un reclamo
  const handleAccept = async (id, ticketId) => {
    try {
      await axios.put(`${API_URL}/Claim/${id}`, { status: 'Con Lugar' });
      await axios.put(`${API_URL}/TicketDTO/${ticketId}/status`, { status: 'Absuelta' });
      showSuccessAlert('Reclamo aceptado exitosamente');
      refetch();
    } catch (error) {
      console.error(error);
      showErrorAlert(`Error al aceptar el reclamo con ID ${id}`);
    }
  };

  // Para denegar un reclamo
  const handleDeny = async (id, ticketId) => {
    try {
      await axios.put(`${API_URL}/Claim/${id}`, { status: 'Sin Lugar' });
      await axios.put(`${API_URL}/TicketDTO/${ticketId}/status`, { status: 'Pendiente' });
      showSuccessAlert('Reclamo denegado exitosamente');
      refetch();
    } catch (error) {
      console.error(error);
      showErrorAlert(`Error al denegar el reclamo con ID ${id}`);
    }
  };

  useEffect(() => {
    setClaims(user.claims);
    setFilteredClaims(user.claims);

  }, [user.claims]);

  return (
    <div className="container__tickets">
      <h1>Resolver reclamos</h1>
      <p>Aquí el juez puede resolver el reclamo y ver el documento del reclamo.</p>
      <div className="search__container">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
        <input
          onInput={(e) => {
            if (e.target.value == "") {
              setFilteredClaims(claims)
            } else {
              const filtered = claims.filter((c) => c.id == e.target.value)
              setFilteredClaims(filtered)
            }
          }}
          type="text"
          placeholder="Buscar reclamo"
          className="search__ticket"
        />
      </div>
      {
        !filteredClaims || filteredClaims.length === 0 ? <div className='table__empty'>No hay multas disponibles.</div> : <table className="ticket-table">
          <thead>
            <tr className='table__head'>
              <th>ID multa</th>
              <th>Fecha</th>
              <th>Razón de multa</th>
              <th>Estado</th>
              <th>Documentos</th>
              <th colSpan={2}>Acción</th>

            </tr>
          </thead>
          <tbody className='table__children'>
            {filteredClaims.map((claim) => (
              <tr key={claim.claimId}>
                <td>{claim.ticketId}</td>
                <td>{claim.createdAt}</td>
                <td>{claim.ticket.description}</td>
                <td>{claim.status}</td>
                <td>
                  <div className='ver-documento'>
                    <button className="btn-view">
                      <a
                        href={claim.claimDocument}
                        download={`Reclamo-${claim.claimId}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver
                      </a>
                    </button>
                  </div>

                </td>
                <td>
                  <div className='aceptar'>
                    <button
                      onClick={() => handleAccept(claim.claimId, claim.ticketId)}
                      className="aceptar"
                    >
                      Aceptar
                    </button>
                  </div>
                </td>
                <td>
                  <div className='denegar'>
                    <button
                      onClick={() => handleDeny(claim.claimId, claim.ticketId)}
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
      }
    </div>
  );
};


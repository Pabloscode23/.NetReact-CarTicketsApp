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
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el valor del input de búsqueda

  // Para aceptar un reclamo
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
      await axios.put(`${API_URL}/TicketDTO/${ticketId}/status`, { status: 'En firme' });
      showSuccessAlert('Reclamo denegado exitosamente');
      refetch();
    } catch (error) {
      console.error(error);
      showErrorAlert(`Error al denegar el reclamo con ID ${id}`);
    }
  };

  // Filtrado de los reclamos
  useEffect(() => {
    setClaims(user.claims);
    setFilteredClaims(user.claims);
  }, [user.claims]);

  useEffect(() => {
    // Filtrado en tiempo real de los reclamos basados en el searchTerm
    const filtered = claims.filter((ticket) =>
      ticket.id?.toString()?.includes(searchTerm) ||
      ticket.date?.includes(searchTerm) ||
      (ticket.description && ticket.description?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
      (ticket.amount !== undefined && ticket.amount?.toString()?.includes(searchTerm)) ||
      (ticket.status && ticket.status?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    );
    setFilteredClaims(filtered);
  }, [searchTerm, claims]); // Actualiza el filtro cada vez que cambian searchTerm o claims

  return (
    <div className="container__tickets">
      <h1 className='main__ticket-title'>Resolver reclamos</h1>
      <h2 className='main__ticket-subtitle'>Aquí el juez puede resolver el reclamo y ver el documento del reclamo.</h2>
      <div className="search__container">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
        <input
          type="text"
          placeholder="Buscar reclamo"
          className="search__ticket"
          value={searchTerm} // Vinculando el input con el estado
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizando el estado searchTerm
        />
      </div>

      {
        !filteredClaims || filteredClaims.length === 0 ?
          <div className='table__empty'>No hay reclamos disponibles.</div> :
          <table className="ticket-table">
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
                  <td>{claim.ticket?.description}</td>
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

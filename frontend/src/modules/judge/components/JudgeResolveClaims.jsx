import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/JudgeResolveClaims.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../hooks';
import { API_URL } from '../../../constants/Api';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { formatDate } from '../../../utils/formatDates';

export const JudgeResolveClaims = () => {
  const { user, fetchUser: refetch } = useAuth();

  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Para capturar el texto del input

  // Función para aceptar reclamos
  const handleAccept = async (id, ticketId) => {
    try {
      await axios.put(`${API_URL}/Claim/${id}`, { status: 'Con lugar' });
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
      await axios.put(`${API_URL}/Claim/${id}`, { status: 'Sin lugar' });
      await axios.put(`${API_URL}/TicketDTO/${ticketId}/status`, { status: 'En firme' });
      showSuccessAlert('Reclamo denegado exitosamente');
      refetch();
    } catch (error) {
      console.error(error);
      showErrorAlert(`Error al denegar el reclamo con ID ${id}`);
    }
  };

  // Cargar los reclamos del usuario
  useEffect(() => {
    setClaims(user.claims);
    setFilteredClaims(user.claims);
  }, [user.claims]);

  // Filtrar reclamos según el texto ingresado en el input
  useEffect(() => {
    const filtered = claims.filter((claim) =>
      claim.ticketId?.toString().includes(searchTerm) || // Filtrar por ID del ticket
      claim.status?.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtrar por estado
      claim.ticket?.description?.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por descripción
    );
    setFilteredClaims(filtered);
  }, [searchTerm, claims]);

  const buttonStyle = (disabled) => ({
    backgroundColor: disabled ? '#6C757D' : '', // Cambia el fondo a gris si está deshabilitado
    cursor: disabled ? 'not-allowed' : 'pointer', // Cambia el cursor a no permitido si está deshabilitado
  });



  return (
    <div className="container__tickets">
      <h1 className="main__ticket-title">Resolver Reclamos</h1>
      <h2 className="main__ticket-subtitle">
        Aquí puedes resolver los reclamos y ver los documentos asociados
      </h2>
      {/* Input de búsqueda */}
      <div className="search__container">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
        <input
          type="text"
          placeholder="Buscar reclamo"
          className="search__ticket"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el estado
        />
      </div>
      {/* Tabla de reclamos */}
      {filteredClaims.length === 0 ? (
        <div className="table__empty">No hay reclamos disponibles.</div>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr className="table__head">
              <th>ID Multa</th>
              <th>Fecha</th>
              <th>Tipo de multa</th>
              <th>Estado</th>
              <th>Documentos</th>
              <th colSpan={2}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }).map((claim) => (
              <tr key={claim.ticketId}>
                <td>{claim.ticketId}</td>
                <td>{formatDate(claim.createdAt)}</td>
                <td>{claim.ticket?.description}</td>
                <td>{claim.status}</td>
                <td>
                  <a
                    className='btn-view-judge'
                    href={claim.claimDocument}
                    download={`Reclamo-Ticket-${claim.ticketId}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver
                  </a>
                </td>
                <div className='decision__btns'>
                  <td>
                    <div>
                      <button
                        className="accept__btn"
                        onClick={() => handleAccept(claim.claimId, claim.ticketId)}
                        disabled={claim.status !== "Pendiente"}
                        style={buttonStyle(claim.status !== "Pendiente")}
                      >
                        Aceptar
                      </button>
                    </div>
                  </td>
                  <td>
                    <div>
                      <button
                        className="deny__btn"
                        onClick={() => handleDeny(claim.claimId, claim.ticketId)}
                        disabled={claim.status !== "Pendiente"} // Deshabilitar si el estado no es "Pendiente"
                        style={buttonStyle(claim.status !== "Pendiente")}

                      >
                        Denegar
                      </button>
                    </div>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import { UserClaims } from "../components/UserClaims";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from "../../../hooks";

export const OfficerClaimsPage = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {


        setClaims(user.claims.filter((claim) => claim.status !== "Pendiente"));
    }, [user]); // Fetch claims when userId changes

    const filteredClaims = claims.filter((ticket) => {
        const ticketId = ticket.id ? ticket.id.toString() : "";
        const ticketDate = ticket.date || "";
        const ticketReason = ticket.description ? ticket.description.toLowerCase() : "";
        const ticketAmount = ticket.amount ? ticket.amount.toString() : "";
        const ticketStatus = ticket.status ? ticket.status.toLowerCase() : "";

        return (
            ticketId.includes(searchTerm) ||
            ticketDate.includes(searchTerm) ||
            ticketReason.includes(searchTerm.toLowerCase()) ||
            ticketAmount.includes(searchTerm) ||
            ticketStatus.includes(searchTerm.toLowerCase())
        );
    });



    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Reclamos</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas reclamadas resueltas asignadas.</h2>
            <div className="search__container">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
                <input
                    type="text"
                    placeholder="Buscar multa"
                    className="search__ticket"
                    value={searchTerm} // Bind input value to searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                />
            </div>
            {(filteredClaims.length === 0) ? (
                <div className='table__empty'>No hay reclamos disponibles.</div>
            ) : (

                <table className="ticket-table">
                    <thead>
                        <tr className='table__head'>
                            <th>ID multa</th>
                            <th>Fecha</th>
                            <th>Razón de la multa</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody className='table__children'>
                        {filteredClaims.map((claim) => (
                            <UserClaims key={claim.claimId}
                                id={claim.claimId}
                                date={claim.createdAt}
                                reason={claim.ticket.description}
                                status={claim.status}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

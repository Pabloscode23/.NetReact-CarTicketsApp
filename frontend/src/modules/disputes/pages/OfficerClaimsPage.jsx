import { useEffect, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../hooks";
import { JudgeClaims } from "../components/JudgeClaims";

export const OfficerClaimsPage = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClaims, setFilteredClaims] = useState([]);

    // Filtrar reclamos para excluir los pendientes al cargar
    useEffect(() => {
        if (user?.claims) {
            const resolvedClaims = user.claims.filter((claim) => claim.status !== "Pendiente");
            setClaims(resolvedClaims);
        }
    }, [user]);


    // Filtrar reclamos según el término de búsqueda
    useEffect(() => {
        const filtered = claims.filter((claim) =>
            claim.ticketId?.toString().includes(searchTerm) || // Filtrar por ID del ticket
            claim.status?.toLowerCase().includes(searchTerm.toLowerCase()) || // Filtrar por estado
            claim.ticket?.description?.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por descripción
        );
        setFilteredClaims(filtered);
    }, [searchTerm, claims]);

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Reclamos</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas reclamadas y resueltas</h2>
            {/* Barra de búsqueda */}
            <div className="search__container">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search__icon" />
                <input
                    type="text"
                    placeholder="Buscar multa"
                    className="search__ticket"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Tabla de resultados */}
            {filteredClaims.length === 0 ? (
                <div className="table__empty">No hay reclamos disponibles.</div>
            ) : (
                <table className="ticket-table">
                    <thead>
                        <tr className="table__head">
                            <th>ID del reclamo</th>
                            <th>Fecha</th>
                            <th>Razón de la multa</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody className="table__children">
                        {filteredClaims.map((claim) => (
                            <JudgeClaims
                                key={claim.claimId}
                                id={claim.claimId}
                                date={claim.createdAt}
                                reason={claim.ticket?.description}
                                status={claim.status}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

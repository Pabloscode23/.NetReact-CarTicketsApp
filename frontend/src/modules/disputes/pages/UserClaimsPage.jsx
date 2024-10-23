import { useEffect, useState } from "react";
import { UserClaims } from "../components/UserClaims";

const ApiExample = [
    {
        id: 1,
        date: "01/10/2024",
        reason: "Exceso de velocidad",
        amount: "13434",
        status: "Reclamada",
    }, {
        id: 2,
        date: "01/10/2024",
        reason: "Parqueo mal",
        amount: "12340",
        status: "Pendiente",
    }, {
        id: 3,
        date: "01/10/2024",
        reason: "Ebriedad",
        amount: "660",
        status: "Aprobada",
    }, {
        id: 4,
        date: "01/10/2024",
        reason: "Exceso de velocidad",
        amount: "650",
        status: "Pendiente",
    }, {
        id: 5,
        date: "01/10/2024",
        reason: "Exceso de velocidad",
        amount: "6500",
        status: "Pendiente",
    }
]


export const UserClaimsPage = () => {
    {/**Hacer un context y llamarlo aqui */ }
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        setClaims(ApiExample
            .filter(ticket => ticket.status !== "Pendiente"));
    }, []);
    //Debe de generarse un update en la base de datos

    return (
        <div className="container__tickets">
            <h1 className="main__ticket-title">Reclamos</h1>
            <h2 className="main__ticket-subtitle">Aquí encuentra las multas que ha reclamado</h2>

            <table className="ticket-table">
                <thead>
                    <tr className='table__head'>
                        <th>ID multa</th>
                        <th>Fecha</th>
                        <th>Razón de la multa</th>
                        <th>Monto de la multa</th>
                        <th>Estado</th>

                    </tr>
                </thead>
                <tbody className='table__children'>
                    {claims.map((ticket) => (
                        <UserClaims key={ticket.id}
                            id={ticket.id}
                            date={ticket.date}
                            reason={ticket.reason}
                            amount={ticket.amount}
                            status={ticket.status}

                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

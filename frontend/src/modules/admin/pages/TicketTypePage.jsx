import axios from 'axios';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { API_URL } from '../../../constants/Api';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { TicketTypeTable } from '../components/TicketTypeTable';


export const TicketTypePage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ticketTypes, setTicketTypes] = React.useState([]);

    const fetchTicketTypes = () => {
        axios.get(`${API_URL}/TicketType`)
            .then((response) => {
                setTicketTypes(response.data);
                console.log(response);

            })
            .catch((error) => {
                console.error("Error obteniendo tipos de multa:", error);
            }
            );

    };

    useEffect(() => {
        fetchTicketTypes();
    }, []);

    const onSubmit = (data) => {
        const newData = {
            ...data,
            amount: Number(data.amount)
        };

        axios.post(`${API_URL}/TicketType`, newData).then((response) => {
            if (response.status === 200) {
                showSuccessAlert("Multa creada exitosamente");
                fetchTicketTypes();
            }
        }).catch((error) => {
            showErrorAlert("Error creando multa");
            console.error("Error creando multa:", error);
        });
    }


    return (
        <section className="container" style={{ color: "#4B4B4E", marginTop: "0" }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="formCreate flex-center flex-column border-grey p-40"
            >
                <h1 className="form__header-center main-title">Crear Tipo de Multa</h1>
                <p className="text-left">Aquí se pueden crear tipos de multas.</p>

                <div className="form__content">
                    <div className="row">
                        <div className="input__container">
                            <label>Descripción multa:</label>
                            <input
                                className="form__input-grey"
                                type="text"
                                {...register("description", {
                                    required: "Descripción es requerida",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s]+$/,
                                        message: "Solo se permiten letras en la descripción"
                                    }
                                })}
                            />
                            {errors.description && <p className="form__error">{errors.description.message}</p>}
                        </div>
                        <div className="input__container">
                            <label>Precio multa:</label>
                            <input
                                className="form__input-grey"
                                type="number"
                                {...register("amount", {
                                    required: "Precio es requerido",

                                })}
                            />
                            {errors.amount && <p className="form__error">{errors.amount.message}</p>}
                        </div>
                    </div>

                    <div className="btn__container justify-center mt-20">
                        <button type="submit" className="btn btn-primary align-center">Crear multa</button>
                    </div>
                </div>
            </form>
            <div style={{ minWidth: "100%", marginTop: 30, display: "flex", alignItems: "center", flexDirection: "column" }}>
                <h2 className="main-title">Tipos de Multa</h2>
                {(ticketTypes.length < 1) ? (
                    <div className='table__empty'>No hay reclamos disponibles.</div>
                ) : (
                    <table className="ticket-table" style={{ marginTop: "30px" }}>
                        <thead>
                            <tr className='table__head'>
                                <th>ID multa</th>
                                <th>Razón de la multa</th>
                                <th>Monto de la multa</th>
                            </tr>
                        </thead>
                        <tbody className='table__children'>
                            {ticketTypes.map(ticket => (
                                <TicketTypeTable
                                    key={ticket.id}
                                    ticketType={ticket}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    )
}

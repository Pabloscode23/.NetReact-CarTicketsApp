import axios from 'axios';
import '../styles/TicketsModule.css';
import { useForm } from 'react-hook-form';
import { API_URL } from '../../../constants/Api';
import { useNavigate } from 'react-router-dom';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { useAuth } from '../../../hooks';

export const CreateTicketsPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    const uniqueID = `ticket-${Date.now()}`;
    const ticketData = {
      id: uniqueID,
      userId: data.idNumber, // Usar el número de cédula como userId
      date: new Date().toISOString(), // Fecha actual
      latitude: 0, // Placeholder, ajusta según tu necesidad
      longitude: 0, // Placeholder, ajusta según tu necesidad
      description: data.reason, // Usar el motivo de la multa como descripción
      status: "Pendiente", // Estado inicial
      officerId: user.idNumber, //
    };

    try {
      console.log(`${data.nombre} ${data.apellidos}`);
      console.log(user.name);
      if (user.name == `${data.nombre} ${data.apellidos}`) {
        console.log('Creando ticket:', ticketData);
        const response = await axios.post(`${API_URL}/TicketDTO`, ticketData);
        console.log('Ticket creado:', response.data);
        navigate('/', { replace: true });
      } else {
        alert('El nombre y apellidos no coinciden con el usuario actual.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server response error:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Algo salió mal!'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No se recibió respuesta del servidor.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Error al configurar la solicitud: ' + error.message);
      }
    }
  };

  return (
    <section className="container" style={{ color: "#4B4B4E" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="formCreate flex-center flex-column border-grey p-40"
      >
        <h1 className="form__header-center main-title">Crear Multa</h1>
        <p className="text-left">Aquí el oficial de tránsito podrá crear la multa.</p>

        {/* Caja de Inputs */}
        <div className="form__content">
          {/* Row 1 */}
          <div className="row">
            <div className="input__container">
              <label>Nombre de infractor:</label>
              <input
                className="form__input-grey"
                type="text"
                {...register("nombre", {
                  required: "Nombre es requerido",
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: "Solo se permiten letras en el nombre"
                  }
                })}
              />
              {errors.nombre && <p className="form__error">{errors.nombre.message}</p>}
            </div>
            <div className="input__container">
              <label>Apellidos de infractor:</label>
              <input
                className="form__input-grey"
                type="text"
                {...register("apellidos", {
                  required: "Apellidos son requeridos",
                  maxLength: { value: 50, message: "Apellidos tienen que ser menores a 50 caracteres" },
                  minLength: { value: 2, message: "Apellidos tienen que ser al menos 2 caracteres" },
                  pattern: { value: /^[a-zA-ZÀ-ÿ\s]+$/, message: "Apellidos solo aceptan letras y tildes" }
                })}
              />
              {errors.apellidos && <p className="form__error">{errors.apellidos.message}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="row">
            <div className="input__container">
              <label>Número cédula:</label>
              <input
                className="form__input-grey"
                type="text"
                {...register("idNumber", {
                  required: "Número de cédula es requerido",
                  pattern: { value: /^[0-9]{9}$/, message: "Número de cédula debe ser solo numérico y de 9 caracteres" }
                })}
              />
              {errors.idNumber && <p className="form__error">{errors.idNumber.message}</p>}
            </div>
            <div className="input__container">
              <label>Número de placa:</label>
              <input
                className="form__input-grey"
                type="text"
                {...register("placa", {
                  required: "Número de placa es requerido",
                  pattern: {
                    value: /^[A-Z0-9-]+$/i,
                    message: "Solo se permiten letras, números y guiones en el número de placa"
                  }
                })}
              />
              {errors.placa && <p className="form__error">{errors.placa.message}</p>}
            </div>
          </div>

          {/* Row 3 */}
          <div className="input__container full-width">
            <label>Multa por:</label>
            <select
              className="form__input-grey"
              {...register("reason", { required: "Por favor seleccione el motivo de la multa" })}
            >
              <option value="">Seleccione...</option>
              {Object.entries(TicketsInfo).map(([title]) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
            {errors.reason && <p className="form__error">{errors.reason.message}</p>}
          </div>

          <div className="btn__container justify-center mt-20">
            <button type="submit" className="btn btn-primary align-center">Crear multa</button>
          </div>
        </div>
      </form>
    </section>
  );
};

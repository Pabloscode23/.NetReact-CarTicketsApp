import axios from 'axios';
import '../styles/TicketsModule.css';
import { useForm } from 'react-hook-form';
import { API_URL } from '../../../constants/Api';
import { useNavigate } from 'react-router-dom';
import { TicketsInfo } from '../../../constants/TicketsInfo';
import { useAuth } from '../../../hooks';
import { showErrorAlert, showSuccessAlert } from '../../../constants/Swal/SwalFunctions';
import { useEffect, useState } from 'react';
import { Loader } from '../../../components/Loader';

export const CreateTicketsPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado


  const onSubmit = async (data) => {
    setIsLoading(true);
    let geolocation;

    // Obtener coordenadas reales
    try {
      geolocation = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject("Geolocalización no soportada por el navegador");
        }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error.message)
        );
      });
    } catch (geoError) {
      console.error("Error obteniendo geolocalización:", geoError);
      showErrorAlert(`Error obteniendo ubicación: ${geoError}`);
      setIsLoading(false);
      return; // Detener ejecución si falla la geolocalización
    }

    // Crear el objeto del ticket
    const uniqueID = `ticket-${Date.now()}`;

    const ticketType = ticketTypes.find((type) => type.description === data.reason).amount;

    const ticketData = {
      id: uniqueID,
      userId: data.idNumber,
      date: new Date().toISOString(),
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
      description: data.reason,
      status: "Pendiente",
      officerId: user.idNumber,
      amount: ticketType,
      plate: data.placa,
    };

    try {
      // Llamada a la API para verificar los datos del infractor
      const infractorResponse = await axios.get(`${API_URL}/UserDTO/${data.idNumber}`);
      console.log("Respuesta del infractor:", infractorResponse);
      const infractor = infractorResponse.data;

      // Verifica si el nombre y apellidos coinciden
      if (infractor.name === `${data.nombre} ${data.apellidos}`) {
        console.log("Creando ticket:", ticketData);

        // Llamada a la API para crear el ticket
        try {
          const response = await axios.post(`${API_URL}/TicketDTO`, ticketData);
          console.log("Ticket creado:", response.data);
          showSuccessAlert('Multa creada exitosamente');
          navigate('/', { replace: true });
        } catch (postError) {
          console.error("Error creando ticket:", postError);
          showErrorAlert(`Error al crear ticket: ${postError.response?.data?.message || "Algo salió mal"}`);
        }
      } else {
        showErrorAlert('El nombre y apellidos no coinciden con la identificación del infractor');
      }
    } catch (infractorError) {
      console.error("Error en la llamada al infractor:", infractorError);
      if (infractorError.response) {
        showErrorAlert(`Error: ${infractorError.response.data.message || 'Datos del infractor no encontrados'}`);
      } else if (infractorError.request) {
        showErrorAlert('No se recibió respuesta del servidor al verificar el infractor.');
      } else {
        showErrorAlert('Hubo un error configurando la solicitud al servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/TicketType`)
      .then((response) => {
        setTicketTypes(response.data);
        console.log(response);

      })
      .catch((error) => {
        console.error("Error obteniendo tipos de multa:", error);
      }
      );
  }, []);

  return (
    <section className="container" style={{ color: "#4B4B4E" }}>
      {isLoading ? ( // Mostrar Loader mientras está procesando
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="formCreate flex-center flex-column border-grey p-40"
        >
          <h1 className="form__header-center main-title">Crear Multa</h1>
          <p className="text-left">Aquí el oficial de tránsito podrá crear la multa.</p>

          <div className="form__content">
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

            <div className="input__container full-width">
              <label>Multa por:</label>
              <select
                className="form__input-grey"
                {...register("reason", { required: "Por favor seleccione el motivo de la multa" })}
              >
                <option value="">Seleccione...</option>
                {ticketTypes && ticketTypes.map((ticketType) => (
                  <option key={ticketType.id} value={ticketType.description}>{ticketType.description}</option>
                ))}
              </select>
              {errors.reason && <p className="form__error">{errors.reason.message}</p>}
            </div>

            <div className="btn__container justify-center mt-20">
              <button type="submit" className="btn btn-primary align-center">Crear multa</button>
            </div>
          </div>
        </form>)}
    </section>
  );
};


import '../styles/TicketsModule.css';
import { useForm } from 'react-hook-form';

export const CreateTicketsPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Aquí envías los datos al backend
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
                    value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
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
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                    message: "Solo se permiten letras en los apellidos"
                  }
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
                {...register("cedula", {
                  required: "Número de cédula es requerido",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Solo se permiten números en el número de cédula"
                  }
                })}
              />
              {errors.cedula && <p className="form__error">{errors.cedula.message}</p>}
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
              {...register("multaPor", { required: "Por favor seleccione el motivo de la multa" })}
            >
              <option value="">Seleccione...</option>
              <option value="1">Exceso de velocidad</option>
              <option value="2">Estacionar en lugar prohibido</option>
              <option value="3">Conducir en estado de ebriedad</option>
            </select>
            {errors.multaPor && <p className="form__error">{errors.multaPor.message}</p>}
          </div>

          <div className="btn__container justify-center mt-20">
            <button type="submit" className="btn btn-primary align-center">Crear multa</button>
          </div>
        </div>
      </form>
    </section>
  );
};

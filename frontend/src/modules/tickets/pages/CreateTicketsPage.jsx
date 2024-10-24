import '../styles/TicketsModule.css'


export const CreateTicketsPage = () => {
  return <section className="container" style={{ color: "#4B4B4E" }}>
    <form className='form flex-center flex-column border-grey p-40'>
      <h1 className='form__header-center main-title'>Crear Multa</h1>
      <p className='text-left'>Aquí el oficial de tránsito podrá crear la multa.</p>
      {/* Caja de Inputs */}
      <div className='form__content'>
        {/* Row 1 */}
        <div className="row">
          <div className='input__container'>
            <label>Nombre de infractor:</label>
            <input className='form__input-grey' type="text" />
          </div>
          <div className='input__container'>
            <label>Apellidos de infractor:</label>
            <input className='form__input-grey' type="text" />
          </div>
        </div>
        {/* Row 2 */}
        <div className="row">
          <div className='input__container'>
            <label>Número cédula:</label>
            <input className='form__input-grey' type="text" />
          </div>
          <div className='input__container'>
            <label>Número de placa:</label>
            <input className='form__input-grey' type="text" />
          </div>
        </div>
        <div className='input__container full-width'>
          <label>Multa por:</label>
          <select className='form__input-grey'>
            <option value="1">Exceso de velocidad</option>
            <option value="2">Estacionar en lugar prohibido</option>
            <option value="3">Conducir en estado de ebriedad</option>
          </select>
        </div>
        <div className='btn__container justify-center mt-20'>
          <button className='btn btn-primary align-center'>Crear multa</button>
        </div>
      </div>

    </form>
  </section>;
};



export const CreateTicketsPage = () => {
  return <section className="container" style={{ color: "#4B4B4E" }}>
    <form style={{ textAlign: "left", backgroundColor: "red", minWidth: "80%" }}>
      <h1>Crear Multa</h1>
      <p>Aquí el oficial de tránsito podrá crear la multa.</p>
      {/* Caja de Inputs */}
      <div>
        {/* Row 1 */}
        <div>
          <label>Nombre de infractor:</label>
          <input type="text" />
        </div>
        <div>
          <label>Apellidos de infractor:</label>
          <input type="text" />
        </div>
        {/* Row 2 */}
        <div>
          <label>Número cédula:</label>
          <input type="text" />
        </div>
        <div>
          <label>Número de placa:</label>
          <input type="text" />
        </div>
      </div>
      <div>
        <label>Multa por:</label>
        <select>
          <option value="1">Exceso de velocidad</option>
          <option value="2">Estacionar en lugar prohibido</option>
          <option value="3">Conducir en estado de ebriedad</option>
        </select>
      </div>
    </form>
  </section>;
};

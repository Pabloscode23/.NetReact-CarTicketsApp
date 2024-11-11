import '../styles/Table.css'
import PropTypes from 'prop-types';

export const GlobalTable = ({ columns, children }) => {



    return (
        <>
            <table className="global-table">
                <thead>
                    <tr className='table__head' >
                        {
                            columns.map((column) =>
                                <th key={column} style={{ margin: "0 auto", textAlign: "center" }}>{column}</th>
                            )
                        }
                    </tr>
                </thead>
                <tbody className='table__children' style={{ margin: "0 auto", textAlign: "center" }}>
                    {children}
                </tbody>
            </table >
            {/*             
                TODO: Implementar paginacion si da tiempo
            <div className='pagination'>
                <button className='button-pagination active'>1</button>
                <button className='button-pagination'>2</button>
                <button className='button-pagination'>3</button>
            </div> */}
        </>
    )
}


GlobalTable.propTypes = {
    columns: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
}
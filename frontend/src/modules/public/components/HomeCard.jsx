
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

export const HomeCard = ({ icon, title, description, link }) => {
    return (
        <Link to={link}>
            <div className="card">
                <div className='card__icon-container'>
                    <FontAwesomeIcon icon={icon} size="2x" color='var(--color-blue-dark)' />
                </div>
                <h3 className="card__title">{title}</h3>

                <p className="card__description">{description}</p>
            </div>
        </Link>
    )
}

HomeCard.propTypes = {
    icon: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
}

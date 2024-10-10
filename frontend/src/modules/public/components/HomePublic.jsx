import { InitialHome } from "./InitialHome"
import { NavbarPublic } from "./NavbarPublic"
import '../styles/InitialHome.css';
export const HomePublic = () => {
    return (
        <div className="layout">
            <NavbarPublic />
            <InitialHome />
        </div>
    )
}

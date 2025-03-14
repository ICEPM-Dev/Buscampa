import {Link} from "react-router-dom";
import "./Navigation.css"

export function Navigation() {
    return (
        <div className="navbar">
            <Link to="/campamento">
                <h1 className="titulo-navbar">
                    Buscampa
                </h1>
            </Link>
            <button className="btn-navbar">
                <Link to="/campamento-create">Crear Campamento</Link>
            </button>
        </div>
    );
}

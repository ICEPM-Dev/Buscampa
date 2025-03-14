import {Campamento} from "./Campamento.ts";
import {useNavigate} from "react-router-dom";
import "./CampamentoCard.css"

export function CampamentoCard({campamento}: { campamento: Campamento }) {
    const navigate = useNavigate();

    return (
        <div className="my-element" onClick={() => navigate(`/campamento/${campamento.id}`)}>
            <h1 className="titulo">{campamento.nombre}</h1>
            <p className="info">Iglesia: {campamento.iglesia}</p>
            <p className="info">Precio: ${campamento.precio}</p>
            <p className="info">Fecha Desde: {new Date(campamento.fechaDesde).toLocaleDateString()}</p>
            <p className="info">Fecha Hasta: {new Date(campamento.fechaHasta).toLocaleDateString()}</p>
            {campamento.descripcion && <p className="info">Descripcion: {campamento.descripcion}</p>}
        </div>
    );
}
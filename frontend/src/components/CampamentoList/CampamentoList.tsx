import {useEffect, useState} from "react";
import {getAllCampamentos} from "../../api/campamento.api.ts";
import {CampamentoCard} from "../CampamentoCard/CampamentoCard.tsx";
import {Campamento} from "../CampamentoCard/Campamento.ts";
import "./CampamentoList.css"
import {Backdrop, CircularProgress} from "@mui/material";

export function CampamentoList() {
    const [campamentos, setCampamentos] = useState<Campamento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadCampamentos(): Promise<void> {
            const res = await getAllCampamentos()
            setCampamentos(res.data)
            setLoading(false)
        }

        loadCampamentos()
    }, [])

    if (loading) {
        return (
            <Backdrop sx={{backgroundColor: "rgba(0, 0, 0, 0.5)"}} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <div>
            {campamentos.length === 0 ? (
                <p className="no-campamentos">
                    No hay campamentos disponibles en este momento.
                </p>
            ) : (
                campamentos.map((campamento) => (
                    <div className="grilla">
                        <CampamentoCard key={campamento.id} campamento={campamento}/>
                    </div>
                ))
            )}
        </div>
    );
}
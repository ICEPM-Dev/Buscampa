import {useForm} from "react-hook-form";
import {createCampamento, deleteCampamento, editCampamento, getCampamento} from "../../api/campamento.api.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "./CampamentoFormPage.css";
import {Backdrop, CircularProgress} from "@mui/material";

export function CampamentoFormPage() {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const [loading, setLoading] = useState<boolean>(true); // Estado de carga
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = handleSubmit(async data => {
        setLoading(true);

        try {
            if (params.id)
                await editCampamento(params.id, data);
            else
                await createCampamento(data);

            navigate("/campamento");
        } catch (error) {
            console.error("Error al guardar el campamento:", error);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        async function loadCampamento() {
            if (params.id) {
                try {
                    const {
                        data: {
                            nombre,
                            iglesia,
                            precio,
                            descripcion,
                            fechaDesde,
                            fechaHasta
                        }
                    } = await getCampamento(params.id);

                    setValue('nombre', nombre);
                    setValue('iglesia', iglesia);
                    setValue('precio', precio);
                    setValue('descripcion', descripcion);
                    setValue('fechaDesde', fechaDesde);
                    setValue('fechaHasta', fechaHasta);
                } catch (error) {
                    console.error("Error al cargar el campamento:", error);
                } finally {
                    setLoading(false);
                }
            } else
                setLoading(false);
        }

        loadCampamento();
    }, [params.id, setValue]);

    const handleDelete = async () => {
        const accepted = window.confirm("¿Quieres eliminarlo?");
        if (accepted) {
            setLoading(true);

            try {
                await deleteCampamento(params.id!);
                navigate("/campamento");
            } catch (error) {
                console.error("Error al eliminar el campamento:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <Backdrop sx={{backgroundColor: "rgba(0, 0, 0, 0.5)"}} open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <input
                    className="form-field"
                    type="text"
                    placeholder="Nombre"
                    {...register("nombre", {required: true})}
                />
                {errors.nombre && <span>Este dato es requerido</span>}

                <input
                    className="form-field"
                    type="text"
                    placeholder="Iglesia"
                    {...register("iglesia", {required: true})}
                />
                {errors.iglesia && <span>Este dato es requerido</span>}

                <input
                    className="form-field"
                    type="number"
                    placeholder="Precio"
                    {...register("precio", {required: true})}
                />
                {errors.precio && <span>Este dato es requerido</span>}

                <textarea
                    className="form-field"
                    rows={10}
                    placeholder="Descripcion"
                    {...register("descripcion")}
                ></textarea>

                <input
                    className="form-date-field"
                    type="date"
                    placeholder="Fecha Desde"
                    {...register("fechaDesde", {required: true})}
                />
                {errors.fechaDesde && <span>Este dato es requerido</span>}

                <input
                    className="form-date-field"
                    type="date"
                    placeholder="Fecha Hasta"
                    {...register("fechaHasta", {required: true})}
                />
                {errors.fechaHasta && <span>Este dato es requerido</span>}

                <button className="form-button" type="submit">Guardar</button>
            </form>

            {params.id && (
                <div className="btn-borrar">
                    <button
                        className="btn-borrar-form"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

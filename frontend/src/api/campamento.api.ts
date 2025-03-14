import axios from 'axios';
import {FieldValues} from "react-hook-form";

const campamentoApi = axios.create({
    baseURL: 'http://localhost:8000/buscampa/api/v1/campamento/',
})

export const getAllCampamentos = () => {
    return campamentoApi.get('/')
}

export const getCampamento = (id: string) => {
    return campamentoApi.get(`/${id}/`)
}

export const createCampamento = (data: FieldValues) => {
    return campamentoApi.post('/', data)
}

export const deleteCampamento = (id: string | undefined) => {
    return campamentoApi.delete(`/${id}/`)
}

export const editCampamento = (id: string, data: FieldValues) => {
    return campamentoApi.put(`/${id}/`, data)
}
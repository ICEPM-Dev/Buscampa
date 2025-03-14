import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {CampamentoFormPage} from "./components/CampamentoFormPage/CampamentoFormPage.tsx";
import {Navigation} from "./components/Navigation/Navigation.tsx";
import {CampamentoList} from "./components/CampamentoList/CampamentoList.tsx";
import "./App.css"

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <Navigation/>
                <Routes>
                    <Route path="/" element={<Navigate to="/campamento"/>}/>
                    <Route path="/campamento" element={<CampamentoList/>}/>
                    <Route path="/campamento-create" element={<CampamentoFormPage/>}/>
                    <Route path="/campamento/:id" element={<CampamentoFormPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
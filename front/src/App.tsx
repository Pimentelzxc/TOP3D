import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
const AdminPage = lazy(() => import("./pages/AdminPage"));
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="admin-loading">
                  <p>Carregando o painel…</p>
                </div>
              }
            >
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <div className="admin-access-message">
              <span className="eyebrow">TOP3D · 404</span>
              <h1>Essa ideia ainda não ganhou forma.</h1>
              <p>A página que você procurou não foi encontrada.</p>
              <Link className="button button-primary" to="/">
                Voltar ao início
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

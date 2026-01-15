// import { Route, Routes, Navigate } from "react-router-dom";
// // Pages and Components
// // Authentication Pages
// import { Login } from "./Ui/Pages/Auth/Login/Login";
// import { Register } from "./Ui/Pages/Auth/Register/Register";
// import { ForgetPasswordModal } from "./Ui/Pages/Auth/ForgetPasswordModal/ForgetPasswordModal";
// import { ResetPassword } from "./Ui/Pages/Auth/ResetPassword/ResetPassword";

// // Dashboards
// import { Analyst } from "./Dashboards/Analyst/Analyst";
// import { AdminDashboard } from "./Dashboards/Admin/AdminDashboard";

// // Hooks and Context
// import { useUser } from "./Hook/Auth/useAuth";
// import ProtectedRoute from "./context/Secure/ProctectedRoute";
// import DashboardRedirect from "./context/Secure/DashboradRedirect";

// // Pages
// import { NOX } from "./Ui/Pages/NOX/NOX";
// import { Header } from "./Ui/Components/Header/header";
// import { Facial } from "./Ui/Pages/Facial/Facial";
// import { Dossiers } from "./Ui/Pages/Dossiers/Dossiers";
// import { NTOC } from "./Ui/Pages/NTOC/NTOC";
// import { INT } from "./Ui/Pages/INT/INT";
// import { FIU } from "./Ui/Pages/FIU/FIU";
// import { Link } from "./Ui/Pages/Links/Link";

// export const App = () => {
//   const { data: user } = useUser();
//   const isLoggedIn = !!user;

//   return (
//     <>
//       {isLoggedIn && <Header />}
//       <Routes>
//         {/* PUBLIC */}
//         <Route
//           path="/"
//           element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
//         />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forget-password" element={<ForgetPasswordModal />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* DASHBOARD REDIRECT */}
//         <Route path="/dashboard" element={<DashboardRedirect />} />

//         {/* USER */}
//         <Route element={<ProtectedRoute role="user" />}>
//           <Route path="/dashboard/auth/user" element={<Analyst />}>
//             <Route path="link" element={<Link />} />
//             <Route path="nox" element={<NOX />} />
//             <Route path="fiu" element={<FIU />} />
//             <Route path="facial" element={<Facial />} />
//             <Route path="int" element={<INT />} />
//             <Route path="ntoc" element={<NTOC />} />
//             <Route path="dossiers" element={<Dossiers />} />
//           </Route>
//         </Route>
//         {/* ADMIN */}
//         <Route element={<ProtectedRoute role="admin" />}>
//           <Route path="/dashboard/auth/admin" element={<AdminDashboard />} />
//         </Route>
//         {/* FALLBACK */}
//         <Route
//           path="*"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/dashboard/auth/user" />
//             ) : (
//               <>
//                 <Navigate to="/" />
//               </>
//             )
//           }
//         />
//       </Routes>
//     </>
//   );
// };



import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// ==============================
//  AUTH PAGES (LAZY LOADED)
// ==============================
const Login = lazy(() =>
  import("./Ui/Pages/Auth/Login/Login").then((m) => ({ default: m.Login }))
);

const Register = lazy(() =>
  import("./Ui/Pages/Auth/Register/Register").then((m) => ({
    default: m.Register,
  }))
);

const ForgetPasswordModal = lazy(() =>
  import(
    "./Ui/Pages/Auth/ForgetPasswordModal/ForgetPasswordModal"
  ).then((m) => ({ default: m.ForgetPasswordModal }))
);

const ResetPassword = lazy(() =>
  import("./Ui/Pages/Auth/ResetPassword/ResetPassword").then((m) => ({
    default: m.ResetPassword,
  }))
);

// ==============================
//  DASHBOARDS (LAZY LOADED)
// ==============================
const Analyst = lazy(() =>
  import("./Dashboards/Analyst/Analyst").then((m) => ({
    default: m.Analyst,
  }))
);

const AdminDashboard = lazy(() =>
  import("./Dashboards/Admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  }))
);

// ==============================
//  PAGES (LAZY LOADED)
// ==============================
const NOX = lazy(() =>
  import("./Ui/Pages/NOX/NOX").then((m) => ({ default: m.NOX }))
);

const Facial = lazy(() =>
  import("./Ui/Pages/Facial/Facial").then((m) => ({ default: m.Facial }))
);

const Dossiers = lazy(() =>
  import("./Ui/Pages/Dossiers/Dossiers").then((m) => ({
    default: m.Dossiers,
  }))
);

const NTOC = lazy(() =>
  import("./Ui/Pages/NTOC/NTOC").then((m) => ({ default: m.NTOC }))
);

const INT = lazy(() =>
  import("./Ui/Pages/INT/INT").then((m) => ({ default: m.INT }))
);

const FIU = lazy(() =>
  import("./Ui/Pages/FIU/FIU").then((m) => ({ default: m.FIU }))
);

const Link = lazy(() =>
  import("./Ui/Pages/Links/Link").then((m) => ({ default: m.Link }))
);

// ==============================
//  COMPONENTS & CONTEXT
// ==============================
import { Header } from "./Ui/Components/Header/header";
import { useUser } from "./Hook/Auth/useAuth";
import ProtectedRoute from "./context/Secure/ProctectedRoute";
import DashboardRedirect from "./context/Secure/DashboradRedirect";

export const App = () => {
  // ==============================
  //  USER AUTH STATE
  // ==============================
  const { data: user } = useUser();
  const isLoggedIn = !!user;

  return (
    <>
      {/* ==============================
           HEADER (ONLY WHEN LOGGED IN)
         ============================== */}
      {isLoggedIn && <Header />}

      {/* ==============================
          SUSPENSE WRAPPER
          Fallback shown while loading chunks
         ============================== */}
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          {/* ==============================
              PUBLIC ROUTES
             ============================== */}
          <Route
            path="/"
            element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPasswordModal />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ==============================
              DASHBOARD REDIRECT
              ROLE BASED REDIRECTION
             ============================== */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* ==============================
              USER DASHBOARD (PROTECTED)
             ============================== */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/dashboard/auth/user" element={<Analyst />}>
              <Route path="link" element={<Link />} />
              <Route path="nox" element={<NOX />} />
              <Route path="fiu" element={<FIU />} />
              <Route path="facial" element={<Facial />} />
              <Route path="int" element={<INT />} />
              <Route path="ntoc" element={<NTOC />} />
              <Route path="dossiers" element={<Dossiers />} />
            </Route>
          </Route>

          {/* ==============================
              ADMIN DASHBOARD (PROTECTED)
             ============================== */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route
              path="/dashboard/auth/admin"
              element={<AdminDashboard />}
            />
          </Route>

          {/* ==============================
              FALLBACK ROUTE
             ============================== */}
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard/auth/user" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

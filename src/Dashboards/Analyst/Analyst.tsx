import { Outlet } from "react-router-dom";

export const Analyst = () => {
  return <>
  <div className="container flex flex-col">
    <h1>Analyst Dashboard</h1>
  </div>
    <Outlet />
  </>;
};
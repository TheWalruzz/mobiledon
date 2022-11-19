import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthHandler } from "./views/AuthHandler";
import { HomeTimeline } from "./views/HomeTimeline";
import { Layout } from "./components/layout/Layout";
import { Login } from "./views/Login";
import { LocalTimeline } from "./views/LocalTimeline";
import { GlobalTimeline } from "./views/GlobalTimeline";
import { TootThread } from "./views/TootThread";

export const Router = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="auth" element={<AuthHandler />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeTimeline />} />
        <Route path="local" element={<LocalTimeline />} />
        <Route path="global" element={<GlobalTimeline />} />
        <Route path="toot/:id" element={<TootThread />} />
      </Route>
    </Routes>
  );
};

import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthHandler } from "./components/views/AuthHandler";
import { HomeTimeline } from "./components/views/HomeTimeline";
import { Layout } from "./components/layout/Layout";
import { Login } from "./components/views/Login";
import { LocalTimeline } from "./components/views/LocalTimeline";
import { GlobalTimeline } from "./components/views/GlobalTimeline";
import { TootThread } from "./components/views/TootThread";
import { User } from "./components/views/User";
import { Hashtag } from "./components/views/Hashtag";

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
        <Route path="user/:acct" element={<User />} />
        <Route path="tag/:name" element={<Hashtag />} />
        {/* TODO: add 404 page */}
      </Route>
    </Routes>
  );
};

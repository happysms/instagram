import React from "react";
import { Route } from "react-router-dom"
import AppLayout from "../components/AppLayout";
import About from "./about"
import Home from "./Home"
import AccountsRoutes from "./accounts";
import LoginRequireRoute from "../utils/LoginRequiredRoute";
import PostNew from "./PostNew";

function Root() {
    return (
        <>
            <LoginRequireRoute exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <LoginRequireRoute exact path="/posts/new" component={PostNew} />
            <Route path="/accounts" component={AccountsRoutes}/>
        </>
    );
}

export default Root;


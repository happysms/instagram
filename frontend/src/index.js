import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from "pages";
import {BrowserRouter} from 'react-router-dom'
import "antd/dist/antd.css";
import { AppProvider } from "store";

ReactDOM.render(
    <BrowserRouter>
        <AppProvider>
            <Root/>
        </AppProvider>
    </BrowserRouter>,
    document.getElementById('root')
);




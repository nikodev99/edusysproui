import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import {ConfigProvider} from "antd";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ConfigProvider>
          <App />
      </ConfigProvider>
  </React.StrictMode>,
)

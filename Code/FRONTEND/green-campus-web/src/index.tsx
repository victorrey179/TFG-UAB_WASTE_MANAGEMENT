import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import global_en from "./locale/en/global.json";
import global_es from "./locale/es/global.json";
import global_ca from "./locale/ca/global.json";
import i18next from "i18next";
import { I18nextProvider } from 'react-i18next';

i18next.init({
  interpolation: { escapeValue: true },
  lng: "es",
  resources: {
    en: {
      global: global_en,
    },
    es: {
      global: global_es,
    },
    ca: {
      global: global_ca,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>
);

reportWebVitals();

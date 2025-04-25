import "../styles/globals.scss";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { store } from "../../src/redux/store";
import { Provider } from "react-redux";
import PopupAlert from "../components/PopupAlert";
import Loader from "../components/Loader";
import SetUp from "../redux/RequestInterceptor";
import React from "react";
import ApiConfig from "../components/ApiConfig";

function MyApp({ Component, pageProps }: AppProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const Loading = store.getState().common.Loading.enable;
    if (event.key === "Tab" && Loading === true) {
      event.preventDefault();
    }
  };

  return (
    <Provider store={store}>
      <div onKeyDown={handleKeyDown} className="MainContent">
        <ApiConfig />
        <Loader />
        <PopupAlert />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
  );
}
SetUp();
export default MyApp;

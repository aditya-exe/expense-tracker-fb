import { type AppType } from "next/dist/shared/lib/utils";
import { AuthUserProvider } from "../firebase/firebase.auth";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
};

export default MyApp;

import React, { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Importa useAuth
import { Navigate, useNavigate } from "react-router-dom";
import LayoutInitialPage from "../components/LayoutInitialPage";
import { ReactComponent as GoogleLogo } from "../images/Google__G__Logo.svg";
import { useLanguage } from "../contexts/LanguageContext";

const Authentication: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInWithEmail, createUserWithEmail } = useAuth(); // Usa useAuth para acceder a las funciones de autenticación
  const navigate = useNavigate();
  const user = useAuth().user;
  const [formType, setFormType] = useState<"login" | "register">("login");
  const { text } = useLanguage();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    await signInWithEmail(email, password);
    navigate("/home");
  };

  const handleSubmitCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    await createUserWithEmail(email, password);
    navigate("/home");
  };

  return (
    <LayoutInitialPage>
      <div className="flex flex-row">
        <div className="flex flex-col items-start justify-center w-2/6 h-full mt-40">
          <div className="flex flex-col text-left mb-5">
            <h1 className="text-7xl font-bold text-white">Blue Campus</h1>
            <h2 className="mt-2 text-4xl font-bold text-white">
              {text("subtitle.text")}
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center w-4/6 h-full">
        <div className="bg-light-primary rounded-lg shadow-lg p-8 m-8 w-2/5">
            {error && <div className="error mb-4 text-red-500">{error}</div>}
            <h1 className="mb-6 text-xl font-bold">
              {formType === "login" ? text("loginPage.title") : text("registerPage.title")}
            </h1>
            {formType === "login" ? (
              <form onSubmit={handleSubmitLogin} className="my-4">
                <input
                  type="email"
                  name="email"
                  placeholder={text("loginPage.email")}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder={text("loginPage.password")}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-900 text-white font-bold rounded transition duration-300 ease-in-out hover:bg-black"
                >
                  {text("loginPage.loginButton")}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitCreate} className="my-3">
                <input
                  type="name"
                  name="name"
                  placeholder={text("registerPage.name")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded "
                />
                <input
                  type="surname"
                  name="surname"
                  placeholder={text("registerPage.surname")}
                  className="mb-2 w-full p-2 border rounded "
                />
                <input
                  type="email"
                  name="email"
                  placeholder={text("registerPage.email")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded "
                />
                <input
                  type="password"
                  name="password"
                  placeholder={text("registerPage.password")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="password*"
                  name="confirmPassword"
                  placeholder={text("registerPage.repeatPassword")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="address"
                  placeholder={text("registerPage.address")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="city"
                  placeholder={text("registerPage.city")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="country"
                  placeholder={text("registerPage.country")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="phone"
                  placeholder={text("registerPage.phone")}
                  className="mb-2 w-full p-2 border rounded"
                />
                <input
                  type="postalCode"
                  name="postalCode"
                  placeholder={text("registerPage.postalCode")+ "*"}
                  required
                  className="mb-2 w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-900 transition duration-300 ease-in-out hover:bg-black text-white font-bold rounded"
                >
                  {text("registerPage.registerButton")}
                </button>
              </form>
            )}
            <button
              onClick={() =>
                setFormType(formType === "login" ? "register" : "login")
              }
            >
              {formType === "login"
                ? text("loginPage.noAcount")
                : text("registerPage.yesAcount")}
            </button>

            {formType === "login" && (
              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-center mt-4 w-full py-2 bg-blue-600 text-white font-bold rounded gap-2 transition duration-300 ease-in-out hover:bg-black"
              >
                <GoogleLogo />
                <h1>{text("loginPage.loginGoogleButton")}</h1>
              </button>
            )}
          </div>
        </div>
      </div>
    </LayoutInitialPage>
  );
};
export default Authentication;

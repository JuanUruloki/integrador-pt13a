import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./App.module.css";
import Form from "./components/Form/Form.jsx";
import Cards from "./components/cards/Cards.jsx";
import Nav from "./components/Nav/Nav";
import Detail from "./components/Detail/Detail.jsx";
import About from "./components/About/About.jsx";
import Favorites from "./components/Favorites/Favorites";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function App() {
  // const EMAIL = "email@gmail.com";
  // const PASSWORD = "pass123";
  const [characters, setCharacters] = useState([]);
  const [access, setAccess] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const URL = "https://rickandmortyapi.com/api/character";

  const onSearch = async (id) => {
    try {
      const response = await axios(`${URL}/${id}`);
      const { data } = response;
      if (data.name && !characters.find((char) => char.id === data.id)) {
        setCharacters((oldChars) => [...oldChars, data]);
      } else {
        window.alert(`Ya llamaste a ${data.name}`);
      }
    } catch (error) {
      window.alert("¡No hay personajes con este ID!");
    }
  };

  const onClose = (id) => {
    setCharacters(characters.filter((char) => char.id !== id));
  };

  /*const login = (userData) => {
    if (userData.email === EMAIL && userData.password === PASSWORD) {
      setAccess(true);
      navigate("/home");
    } else {
      alert("Usuario o password incorrecto");
    }
  }; */

  const login = async (userData) => {
    try {
      const { email, password } = userData;
      const URL = "http://localhost:3001/rickandmorty/login/";
      const response = await axios(
        `${URL}?email=${email}&password=${password}`
      );
      const { data } = response;
      const { access } = data;
      setAccess(data);
      access
        ? navigate("/home")
        : window.alert(`Acceso invalido para usuario ${userData.email}`);
    } catch (error) {
      window.alert(error.message);
    }
  };

  const logout = () => {
    setAccess(false);
    navigate("/");
  };

  useEffect(() => {
    !access && navigate("/");
  }, [access]);

  return (
    <div className={styles.App}>
      {pathname !== "/" && <Nav onSearch={onSearch} logout={logout} />}
      <Routes>
        <Route
          path="/"
          element={<Form login={login} className={styles.form} />}
        />
        <Route
          path="/home"
          element={<Cards characters={characters} onClose={onClose} />}
        />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../supabaseClient';
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const {userEmail,setUserEmail} = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    setUserEmail(email);
    console.log("Login successful!");
  };

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    }
  }, [userEmail]);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', 
      backgroundColor: '#fff' 
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
      backgroundColor: '#fff' 
    },
    input: {
      padding: '10px',
      fontSize: '16px', 
      borderRadius: '4px', 
      border: '1px solid #ccc' 
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: 'black', 
      color: '#fff',
      border: 'none',
      borderRadius: '4px'
    }
  };

  return (
    <main style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        {/* <h4> */}
          Welcome!
        {/* </h4> */}
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Go</button>
      </form>
    </main>
  );
}

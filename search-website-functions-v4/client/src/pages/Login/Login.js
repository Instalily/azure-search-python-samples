import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../supabaseClient';

export default function Login() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    navigate('/home'); 

    try {
      let { data, error } = await supabase.from('partselect').insert([{ name: name }]);
      console.log('Database response:', data, error);
      
      if (error) throw error;
      
      if (data) {
        console.log('Login successful:', data);
        navigate('/home', { replace: true });
      } else {
        console.log('No data returned');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed!');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', 
      backgroundColor: '#ffffff' 
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
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </main>
  );
}

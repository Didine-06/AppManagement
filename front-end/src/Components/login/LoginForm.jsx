import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';
import { z } from 'zod';
import api from '../../../api/axios'; // Importez l'instance Axios
import { useAuth } from '../../Context/UserContext';

const schema = z.object({
  email: z.string().email('Please enter a valid email !'),
  password: z.string().min(6, 'The password must be at least 6 characters long !'),
});

const LoginForm = () => {
  const { setIsLoggedIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement
  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage.getItem('ACCESS_TOKEN')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.parse(form);
      setErrors({});
      setServerError('');
      setLoading(true); // Démarrer le chargement

      // Demander un cookie CSRF avant de soumettre la connexion
      await api.get('/sanctum/csrf-cookie');
      await api.post('/login', form);
      setIsLoggedIn(true);

      window.localStorage.setItem('ACCESS_TOKEN', 'logged');
      navigate('/');
    } catch (err) {
      if (err.errors) {
        // Gestion des erreurs de validation
        const validationErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else if (err.response) {
        setServerError('Connection error, please check your credentials !');
      } else {
        setServerError('"An error occurred. Please try again :)');
      }
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
      Log in here !
      </Typography>
      <form onSubmit={handleSubmit}>
        {['email', 'password'].map((field) => (
          <TextField
            key={field}
            label={field === 'email' ? 'Email' : 'Password'}
            variant="outlined"
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            fullWidth
            margin="normal"
            value={form[field]}
            onChange={handleChange}
            error={!!errors[field]}
            helperText={errors[field] && <span style={{ color: 'red' }}>{errors[field]}</span>}
          />
        ))}
        {serverError && <Typography color="error" style={{ marginTop: '10px' }}>{serverError}</Typography>}
        <div className="relative">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading} // Désactive le bouton pendant le chargement
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Connecting...' : 'Log in'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ color: '#fff' }}
            />
          )}
        </div>
      </form>
    </Container>
  );
};

export default LoginForm;

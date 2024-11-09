import {  useState } from 'react';
import { Snackbar, Alert, LinearProgress } from '@mui/material';
import { CloudUpload } from 'lucide-react'; // Utiliser les icônes Lucide-React

import api from '../../../api/axios';


const CsvImportForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Pour gérer l'affichage du pop-up
    const [snackbarType, setSnackbarType] = useState('success'); // Type de pop-up (success/error)
    
    
    
    
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setSnackbarType('error');
            setMessage("Please select a CSV file !");
            setOpenSnackbar(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        setLoading(true);

        try {
            const response = await api.post('/api/students/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSnackbarType('success');
            setMessage(response.data.message);
            setErrors([]);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setSnackbarType('error');
                setErrors(error.response.data.errors || []);
                setMessage('');
            } else {
                setSnackbarType('error');
                setMessage("An error occurred during the import !");
                setErrors([]);
            }
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="flex flex-col h-full w-full justify-center items-center p-6">
            <form onSubmit={handleSubmit} className="w-full flex items-center justify-center space-x-4">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="border p-2 rounded-md w-1/2"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-500 text-white rounded-md flex items-center hover:bg-indigo-600"
                    disabled={loading}
                >
                    <CloudUpload className="mr-2" />
                    Import
                </button>
            </form>

            {loading && <LinearProgress className="w-full mt-2" />}

            {/* Pop-up Snackbar pour afficher les messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
                    {message || errors.join(', ')}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CsvImportForm;

import { useState, useEffect } from 'react';
import { TextField, Card, CardContent, Typography, List, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../api/axios';
import { Edit } from 'lucide-react';

const SearchShowStudents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false); // État pour ouvrir la boîte de dialogue d'édition
    const [selectedStudent, setSelectedStudent] = useState(null); // Stocke l'étudiant à éditer








    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get(`/api/students?search=${searchTerm}`);
                setStudents(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des étudiants :", error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                fetchStudents();
            } else {
                setStudents([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleDelete = (id) => {
        setStudentToDelete(id);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/students/${studentToDelete}`);
            setStudents((prevStudents) => prevStudents.filter(student => student.id !== studentToDelete));
            setOpenDialog(false);
            setStudentToDelete(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'étudiant :", error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setStudentToDelete(null);
    };

    const handleEdit = (student) => {
        setSelectedStudent(student); // Définir l'étudiant à éditer
        setOpenEditDialog(true); // Ouvrir la boîte de dialogue d'édition
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setSelectedStudent(null);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await api.put(`/api/students/${selectedStudent.id}`, selectedStudent);
            setStudents((prev) =>
                prev.map((student) => (student.id === selectedStudent.id ? response.data.student : student))
            );
            setOpenEditDialog(false);
            setSelectedStudent(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'étudiant :", error);
        }
    };

    return (
        <div className="flex flex-col h-full w-full justify-center items-center p-6">
            <div className="w-full flex items-center justify-center">
                <TextField
                    label="Search for students by Name, Familyname, or registration number"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    InputProps={{
                        startAdornment: (
                            <Search style={{ marginRight: '8px' }} />
                        ),
                    }}
                />
            </div>

            <div className="mt-4 w-full">
                {students.length > 0 ? (
                    <List>
                        {students.map((student) => (
                            <Card key={student.id} variant="outlined" className="mb-2">
                                <CardContent className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <Typography variant="h6">{student.nom} {student.prenom}</Typography>
                                        <Typography color="textSecondary">
                                            Registration Number: {student.matricule} | Level: {student.groupe?.section?.niveau?.nom} | Specialization: {student.groupe?.section?.niveau?.specialite?.nom} | Section: {student.groupe?.section?.nom} | Group: {student.groupe?.nom}
                                        </Typography>
                                    </div>
                                    <div>
                                        <IconButton onClick={() => handleEdit(student)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(student.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="textSecondary">No students found !</Typography>
                )}
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this student?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Boîte de dialogue pour l'édition */}
            <Dialog open={openEditDialog} onClose={handleEditClose}>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent>
                    <div className='flex justify-between'>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            value={selectedStudent?.prenom || ''}
                            onChange={(e) => setSelectedStudent(prev => ({ ...prev, prenom: e.target.value }))}
                            sx={{ width: '45%' }}
                            margin="normal"
                        />
                        <TextField
                            label="Family Name"
                            variant="outlined"
                            value={selectedStudent?.nom || ''}
                            onChange={(e) => setSelectedStudent(prev => ({ ...prev, nom: e.target.value }))}
                            sx={{ width: '45%' }}
                            margin="normal"
                        />
                    </div>
                    <TextField
                        label="Level"
                        variant="outlined"
                        value={selectedStudent?.groupe?.section?.niveau?.nom || ''}
                        onChange={(e) =>
                            setSelectedStudent((prev) => ({
                                ...prev,
                                groupe: {
                                    ...prev.groupe,
                                    section: {
                                        ...prev.groupe.section,
                                        niveau: {
                                            ...prev.groupe.section.niveau,
                                            nom: e.target.value
                                        }
                                    }
                                }
                            }))}

                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Specialization"
                        variant="outlined"
                        value={selectedStudent?.groupe?.section?.niveau?.specialite?.nom || ''}
                        onChange={(e) =>
                            setSelectedStudent((prev) => ({
                                ...prev,
                                groupe: {
                                    ...prev.groupe,
                                    section: {
                                        ...prev.groupe.section,
                                        niveau: {
                                            ...prev.groupe.section.niveau,
                                            specialite: {
                                                ...prev.groupe.section.niveau.specialite,
                                                nom: e.target.value
                                            }
                                        }
                                    }
                                }
                            }))}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Section"
                        variant="outlined"
                        value={selectedStudent?.groupe?.section?.nom || ''}
                        onChange={(e) =>
                            setSelectedStudent((prev) => ({
                                ...prev,
                                groupe: {
                                    ...prev.groupe,
                                    section: {
                                        ...prev.groupe.section,

                                        nom: e.target.value
                                    }
                                }


                            }))}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Group"
                        variant="outlined"
                        value={selectedStudent?.groupe?.nom || ''}
                        onChange={(e) =>
                            setSelectedStudent((prev) => ({
                                ...prev,
                                groupe: {
                                    ...prev.groupe,
                                                nom: e.target.value
                                            }
                                        
                            }))}
                        fullWidth
                        margin="normal"
                    />
                    {/* Ajouter d'autres champs nécessaires */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">Cancel</Button>
                    <Button onClick={handleEditSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SearchShowStudents;

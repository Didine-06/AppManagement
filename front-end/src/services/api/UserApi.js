import api from "../../api/axios";

export const UserApi = {

    getCsrf: async () =>{
        return await api.get('/sanctum/csrf-cookie');
    },

    login: async (form) => {
        return await api.post('/login', form);
    }
}
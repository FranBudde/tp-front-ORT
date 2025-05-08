const userService = {
    async get() {
        try {
            const response = await fetch("http://localhost:3000/api/user");
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    async getById(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/${id}`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async postUser(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/${id}`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
    },
}

export default userService;
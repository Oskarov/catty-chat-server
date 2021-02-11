module.exports = {
    Query: {
        getUsers: () => {
            const users = [
                {
                    username: 'mika',
                    email: '123'
                }
            ];
            return users;
        }
    }
}
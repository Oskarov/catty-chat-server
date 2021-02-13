const {User} = require('../models');
const bcrypt = require('bcryptjs');
const {validateRegisterInput, validateLoginInput} = require('../util/validators');
const {UserInputError} = require('apollo-server');

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll();
                return users;
            } catch (err) {
                console.log(err);
            }
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            let {username, email, password, confirmedPassword} = args;
            let {valid, errors} = validateRegisterInput(username, email, password, confirmedPassword);

            try {
                const userByUserName = await User.findOne({where: { username }});
                const userByEmail = await User.findOne({where: { email }});

                if (userByUserName) {
                    errors.username = 'Username is taken';
                    valid = false;
                }
                if (userByEmail) {
                    errors.email = 'Email is taken';
                    valid = false;
                }

                if (!valid) {
                    throw new UserInputError('Errors', {errors});
                }

                password = await bcrypt.hash(password, 6);
                const user = await User.create({
                    username, email, password
                });
                return user;
            } catch (err) {
                console.log(err);
                if (err.name == 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(e => (
                        errors[e.path] = e.message
                    ))
                }
                throw new UserInputError('Errors', {err});
            }
        }
    }
}
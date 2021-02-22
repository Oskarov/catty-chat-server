const {User} = require('../models');
const bcrypt = require('bcryptjs');
const {validateRegisterInput, validateLoginInput} = require('../util/validators');
const checkAuth = require('../util/checkAuth');
const {UserInputError} = require('apollo-server');
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config');
const {Op} = require('sequelize');

function generateToken(res){
    return jwt.sign({
        username: res.username,
    }, SECRET_KEY, {expiresIn: '1h'});
}

module.exports = {
    Query: {
        getUsers: async () => {
            const authUser = checkAuth(context);
            try {
                const users = await User.findAll({where: {username: {[Op.ne]: authUser.username}}});
                return users;
            } catch (err) {
                console.log(err);
            }
        },
        getUser: async (parent, args, context, info) => {
            const authUser = checkAuth(context);
            const token = context.req.headers.authorization.split('Bearer ')[1];
            const user = await User.findOne({where: { username: authUser.username }});
            console.log(user.toJSON())
            return {...user.toJSON(), token}
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
                const token = generateToken({username});

                return {
                    ...user.toJSON(),
                    createdAt: user.createdAt.toISOString(),
                    token
                };
            } catch (err) {
                console.log(err);
                if (err.name == 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(e => (
                        errors[e.path] = e.message
                    ))
                }
                throw new UserInputError('Errors', {err});
            }
        },
        login: async (parent, args) => {
            let {username, password} = args;
            let {valid, errors} = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            try {
                const user = await User.findOne({
                    where: {username}
                });

                if (!user){
                    throw new UserInputError('Errors', {error: 'not correct credentials'});
                }

                const correctPassword = await bcrypt.compare(password, user.password);

                if (!correctPassword){
                    throw new UserInputError('Errors', {error: 'not correct credentials'});
                }

                const token = generateToken({username});

               return {
                   ...user.toJSON(),
                   createdAt: user.createdAt.toISOString(),
                   token
               };
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
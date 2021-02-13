module.exports.validateRegisterInput = (username, email, password, confirmedPassword) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }

    if (email.trim() === '') {
        errors.email = 'Email must not be empty'
    } else {
        const regEx =  /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)){
            errors.email = 'Email not valid'
        }
    }

    if (password === ''){
        errors.password = 'Password must not be empty'
    } else if (password !== confirmedPassword){
        errors.confirmPassword = 'Passwords must match'
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) =>{
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }
    if (password.trim() === ''){
        errors.password = 'Password must not be empty'
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    }

}

module.exports.isBasicString = ( {name, value} ) => {
    const errors = {};

    if (value.trim() === '') {
        errors[name] = 'value can\'t be empty';
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}
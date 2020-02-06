function validateLogin(state){
    const email = state.data.email===null?'':state.data.email;
    const password = state.data.password===null?'':state.data.password;

    if(email.length>0 && password.length>0){
        return true;
    }

    return false;
}

export default validateLogin;
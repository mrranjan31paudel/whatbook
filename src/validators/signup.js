function validateSignup(state){
    const name = state.data.name===null?'':state.data.name;
    const email = state.data.email===null?'':state.data.email;
    const password = state.data.password===null?'':state.data.password;
    const confPassword = state.data.confPassword===null?'':state.data.confPassword;
    const day = state.data.dob.day===null?'0':state.data.dob.day;
    const month = state.data.dob.month===null?'0':state.data.dob.month;
    const year = state.data.dob.year===null?'0':state.data.dob.year;

    if(name.length>0 && email.length>0 && password.length>5 && password===confPassword && day!=='0' && month!=='0' && year!=='0'){
        return true;
    }

    return false;
}

export default validateSignup;
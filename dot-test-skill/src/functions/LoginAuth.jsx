function LoginAuth(props) {
    if (props.email == "admin" && props.password == "admin") {
        return true
    } else {
        return false
    }
}

export default LoginAuth;
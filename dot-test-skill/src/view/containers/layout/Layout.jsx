import NavbarComp from "../../components/NavbarComp"
import Container from "react-bootstrap/esm/Container";
import Login from "../login/Login";
import Quiz from "../quiz/Quiz";

function Layout(params) {
    return (
        <>
            <NavbarComp />
            <Container>
                {/* <Login /> */}
                <Quiz />
            </Container>
        </>
    )
}

export default Layout;
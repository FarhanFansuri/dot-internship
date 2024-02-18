import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormComp from '../../components/FormComp'

function Login(params) {
    return (
        <>
            <Container className='mt-5'>
                <Row>
                    <Col xs={4}></Col>
                    <Col xs={4}>
                        <FormComp />
                    </Col>
                    <Col xs={4}></Col>
                </Row>
            </Container>
        </>
    )
}

export default Login;
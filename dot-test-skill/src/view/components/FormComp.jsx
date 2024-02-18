import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import LoginAuth from '../../functions/LoginAuth';
import { useState } from 'react';
import Card from 'react-bootstrap/Card'

function FormComp() {
  let navigate = useNavigate();


  const handleLogin = (email, password) => {
    if (<LoginAuth email={email} password={password}/>) {
      navigate("/quiz");
    } else {
      console.log("Invalid credentials");
      navigate("/");
    }
  };

  return (
    <Card className='shadow'>
<Card.Body>
    <Form className='p-5 form-style'>
      <h1 className='text-center mb-5'>Login</h1>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="name@example.com" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" rows={3} placeholder='password' />
      </Form.Group>
      <Button onClick={() => handleLogin("admin", "admin")}>Login</Button>
    </Form>
</Card.Body>
    </Card>
  );
}

export default FormComp;

// React
import React from "react";

//Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//estilos
import './InputView.css'

const InputView = () => {

  return (
    <Form>
      <Form.Group className="mb-3" controlId="TextInput">
        <Form.Control as="textarea" rows={3} placeholder="Ingrese el texto que desee comprimir"/>
      </Form.Group>
      <Form.Group controlId="FileInput" className="mb-3">
        <Form.Label>aca va tu parte :p hace algo que me devuelva true o false si el campo esta completo
        </Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default InputView;
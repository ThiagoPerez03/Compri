// React
import React from "react";

//Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//estilos
import './InputView.css'
import FileInput from './FileInput'; 

const InputView = () => {

  return (
    <Form>
      <Form.Group className="mb-3" controlId="TextInput">
        <Form.Control as="textarea" rows={3} placeholder="Ingrese el texto que desee comprimir"/>
      </Form.Group>
      <Form.Group controlId="FileInput.jsx" className="mb-3">
        <Form.Label className="o"> ó </Form.Label>
        <FileInput />
      </Form.Group>
      <Button variant="primary" type="submit" className="SubmitBttn">
        Comprimir ahora
      </Button>
    </Form>
  );
}

export default InputView;
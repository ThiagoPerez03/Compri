// React component for the footer of the application
import React from 'react';
import './Footer.css';

// Bootstrap components
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/esm/Image';

import Accordion from 'react-bootstrap/Accordion';


// assets
import instagram from '../assets/instagram.png';
import facebook from '../assets/facebook.png';
import wpp from '../assets/wpp.png';
import discord from '../assets/discord.png';
  

const Footer = () => {

    return (
        <footer>
            <Stack direction='horizontal' gap={3} className="footer">
                <div className="p-2" id="footer-description">
                    <h2>Compri</h2>
                    <br/>
                    <p>
                        Compri es una aplicación interactiva que permite comprimir y
                        descomprimir mensajes o archivos de texto utilizando los algoritmos
                        de Huffman y Shannon-Fano, comparando sus resultados en términos de eficiencia
                        y tamaño comprimido.
                    </p>
                    <Stack direction='horizontal' gap={1} id="footer-links" >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <Image src={instagram} alt="Instagram" className="footer-icon" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <Image src={facebook} alt="Facebook" className="footer-icon" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <Image src={wpp} alt="WhatsApp" className="footer-icon" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <Image src={discord} alt="Discord" className="footer-icon" />
                        </a>
                    </Stack>
                        
                </div>
                <div className="p2 ms-auto footer-acerca">
                    <h2>Acerca</h2>
                    <Accordion className="footer-accordion" flush>
                        <Accordion.Item className='item' eventKey="0">
                            <Accordion.Header>
                                 Integrantes
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    <li>Maximiliano Orellana</li>
                                    <li>Martina Lopez</li>
                                    <li>Nahir Chosco Lopez</li>
                                    <li>Thiago Perez</li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className='item' eventKey="1">
                            <Accordion.Header>
                                 Soporte
                            </Accordion.Header>
                            <Accordion.Body>
                                Si tenes alguna duda o necesitás ayuda con la aplicación, podes
                                contactarnos a través de nuestras redes sociales o enviarnos un correo
                                electrónico a compri@gmail.com
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className='item' eventKey="2">
                            <Accordion.Header>
                                Términos y condiciones
                            </Accordion.Header>
                            <Accordion.Body>
                                De uso libre, no se hace responsable de la pérdida de datos o
                                cualquier inconveniente que pueda surgir al utilizar la aplicación.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className='item' eventKey="3">
                            <Accordion.Header>
                                Privacidad
                            </Accordion.Header>
                            <Accordion.Body>
                                La aplicación no almacena ni comparte datos personales de los usuarios.
                                Todos los datos se procesan localmente en el navegador del usuario.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Stack>
            <div>
                <p className="copyright">® Todos los derechos reservados</p>
            </div>
        </footer>
    );
};

export default Footer;

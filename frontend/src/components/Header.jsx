import React from 'react';
import './Header.css';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo.png';

function Header() {
  return (
    <header>
        <Image src={logo} className='logoImage'/>
        <h1 className='logoC'>C</h1>
        <h1 className='logoText'>ompri</h1>
    </header>
  );
}

export default Header;

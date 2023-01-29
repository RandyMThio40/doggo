import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './about.module.scss';

export const About = () => {
    useLayoutEffect(()=>{
        const defaultNav = document.querySelector<HTMLDivElement>("#defaultNav")!;
        for(let x of defaultNav.classList.entries() ){
            if(x[0]) defaultNav.classList.remove(x[1]);
        }
    },[])
    return(
       <div className={styles.about}>
            <h2 className={styles.header}>About</h2>
            <p className={styles.description}>A website dedicated to showing off dogs</p>
            <Link to="/">View Dogs</Link>
       </div>
    );
}

export default About;
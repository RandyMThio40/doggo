import react, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './faqs.module.scss';

export const Faqs = () => {
    useLayoutEffect(()=>{
        const defaultNav = document.querySelector<HTMLDivElement>("#defaultNav")!;
        for(let x of defaultNav.classList.entries() ){
            if(x[0]) defaultNav.classList.remove(x[1]);
        }
    },[])
    return(
        <div className={styles.faqs}>
            <h2 className={styles.header}>FAQs</h2>
            <div className={styles.question}>
                    <h4>Where did you get the pictures of dogs?</h4>
                    <p>I used an api that collected dog pictures at <a href="https://dog.ceo/dog-api">www.dog.ceo</a>. </p>
            </div>
            <div className={styles.question}>
                <h4>How can I submit my dog's picture?</h4>
                <p>You can submit your dog's picture at <a href="https://github.com/jigsawpieces/dog-api-images#dog-api-images">their github</a></p>
            </div>
        </div>
    )
}

export default Faqs;
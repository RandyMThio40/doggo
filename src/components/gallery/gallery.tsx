import React,{useLayoutEffect} from 'react';
import { useOutletContext,useParams,useNavigate } from 'react-router-dom';
import closeScreen from '../../assets/closeScreen.svg';
import { Breed } from '../home/home';
import styles from './gallery.module.scss';

export const Gallery = () => {
    const navigate = useNavigate();
    const {id,index} = useParams();
    const [...breed] = useOutletContext<Breed[]>();
    
    
    const handleNavigate = (dir:number) => {
        if(index === undefined) return;
        if(dir === 1){
            navigate(`../${(parseInt(index) + 1 ) > breed.length ? 1 : (parseInt(index) + 1 )}`,{replace:true});
        }
        if(dir === -1){
            let nextIndex = (parseInt(index) - 1 ) < 1 ? breed.length : (parseInt(index) - 1 )
            navigate(`../${nextIndex}`,{replace:true});
        }
        
    }

    const handleClose = () => {
        navigate('../');
    }

    const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        navigate(`../${e.currentTarget.value}`,{replace:true});
    }   
    
    useLayoutEffect(()=>{
        document.body.style.overflow = "hidden";
        return () => {document.body.style.overflow = "";}
    },[])
    
    if(breed.length === 0 || index === undefined ) return <section style={{display:"flex",alignItems:"center",justifyContent:"center"}} className={styles.gallery}><p style={{color:"white"}}>loading Media</p></section>
    else if( breed[parseInt(index)-1] === undefined) return <section style={{display:"flex",alignItems:"center",justifyContent:"center"}} className={styles.gallery}><p style={{color:"white"}}>Index out of Bounds</p></section>
    

    return(
        <section className={styles.gallery}>
            <img src={breed[parseInt(index)-1].imgUrl}/>
            <button className={styles.closeScreen} onClick={handleClose}><img src={closeScreen}/></button>
            <button className={styles.next} onClick={()=>{handleNavigate(1)}}>next</button>
            <button className={styles.prev} onClick={()=>{handleNavigate(-1)}}>prev</button>
            <div className={styles.index}>
                <select value={index} onChange={handleChange}>
                    {
                        breed.map((_,idx)=>{
                            return(<option key={idx} defaultValue={idx} value={idx+1}>{idx+1}</option>)
                        })
                    }
                </select>
                <span>
                    {`/${breed.length}`}
                </span>
            </div>

        </section>
    )
}

export default Gallery;
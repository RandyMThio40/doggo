import React,{useState, useEffect,useRef, useLayoutEffect} from 'react';
import { breedList } from '../../assets/breedsList';
import { useNavigate, useParams } from 'react-router-dom';
import { Breed } from '../home/home';
import { Outlet } from 'react-router-dom';
import styles from './breedPage.module.scss';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);


  
export function BreedPage(){
    const {id} = useParams();
    const imgUrl = useRef<string|undefined>(breedList.find(findId)?.imgUrl)!
    const [breeds,setBreeds] = useState<Breed[][]>([]);
    const [subBreeds,setSubBreeds] = useState<string[]>([]);
    const navigate = useNavigate()

  
    function findId(obj:Breed){
      return obj.breed === id
    }
    
    if(imgUrl.current === undefined) return <>page not found</>

    useLayoutEffect(()=>{
      gsap.to(window,{
        duration:0,
        scrollTo:{
          y:0,
        }
      })
      return()=>{
        window.history.pushState({from:`${id}`},'')
      }
    },[])
    
  
    useEffect(()=>{
      const initData = async() => {
        try{
          const subBreeds = await fetch(`https://dog.ceo/api/breed/${id}/list`).then((e)=>e.json())
          const arr:Breed[][] = Array.from(Array(subBreeds.message[`${id}`].length|1),()=>[])
          if(subBreeds.message[`${id}`].length){
            for(let i = 0; i < subBreeds.message[`${id}`].length; i++){
              const data = await fetch(`https://dog.ceo/api/breed/${id}/${subBreeds.message[`${id}`][i]}/images`).then((e)=>e.json())
              arr[i]?.push(...data.message.map((url:string)=>{return {breed:subBreeds.message[`${id}`][i],imgUrl:url}}))
            }
          }
          else{
            const data = await fetch(`https://dog.ceo/api/breed/${id}/images`).then((e)=>e.json())
            arr[0]?.push(...data.message.map((url:string)=>{return {breed:`${id}`,imgUrl:url}}))
          }
          setSubBreeds(subBreeds.message[`${id}`])
          setBreeds(arr);
        }catch(err){
          console.error(err);
        }
      }
      initData();
    },[])

    return(
      <section className={styles.breedPage}>
        <div className={styles.hero}>
          <img className={styles.backgroundImg} src={imgUrl.current}/>
          <img className={styles.mainImg} src={imgUrl.current}/>
          <h3>{id}</h3>
        </div>
        <main className={styles.mainContent}>
            {
              (breeds.length)
              ?
              breeds.map((array,idx)=>{
                return(
                  <React.Fragment key={idx}>
                    <h4>{subBreeds.length ? subBreeds[idx] : id}</h4>
                    <section className={styles.breedSection} key={idx}>
                      {
                        array.map((obj:Breed,idx)=>{
                        return(
                            <img key={idx} src={obj.imgUrl} onClick={()=>{navigate(`${idx+1}`)}}/>
                        )
                        })
                      }
                    </section>
                  </React.Fragment>
                )
              })
              :
              <React.Fragment>
                <h4 className={styles.skeletonH4}>breed</h4>
                <div className={styles.skeleton}>
                  {
                    Array.from(Array(20)).map((item,idx)=>{
                      return(<img key={idx}/>)
                    })
                  }
                </div>
              </React.Fragment>
            }
        </main>
          <Outlet context={breeds}/>
      </section>
    )
  }

  export default BreedPage;
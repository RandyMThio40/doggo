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
    const [breeds,setBreeds] = useState<Breed[]>([]);
    const navigate = useNavigate();
  
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

      const getSubBreed = (url:string,breed:string):string => {
        let subBreed:string = breed; 
        let pos = 30+breed.length;
        if(url.at((pos))==='-'){
          subBreed = url.substring((pos+1),url.indexOf("/",pos))
        }
        return subBreed 
      }
      const initData = async() => {
        if(!id) return;
        try{
          const data = await fetch(`https://dog.ceo/api/breed/${id}/images`).then((e)=>e.json())
          let list:Breed[] = data.message.map((url:string,idx:number)=>{
            return {
              breed:getSubBreed(url,id),
              imgUrl:url,
            } as Breed
          })
          setBreeds(list);
          
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
          <section className={styles.breedSection}>
            {
              breeds.length ?
                breeds.map((obj:Breed,idx:number)=>{

                  return(
                    <React.Fragment key={idx}>
                      {(idx === 0 || obj.breed !== breeds[idx-1].breed) ? <h4>{obj.breed}</h4> : null}
                      <img src={obj.imgUrl} onError={(e)=>{e.currentTarget.remove();
                                  // setBreeds((prev)=>{
                                  //   console.log(prev)
                                  //   return prev.filter((val,index)=>index !== index2)
                                  // })
                                }} onClick={()=>{navigate(`${idx+1}`)}}/>
                    </React.Fragment>
                  )
                })
              :
                <React.Fragment>  
                  <h4 className={styles.skeletonH4}>breed</h4>
                  <div className={styles.skeleton}>
                    {
                      Array.from(Array(20)).map((item,idx)=>{
                        return(<img key={idx} alt=""/>)
                      })
                    }
                  </div>
                </React.Fragment>
            }
          </section>
        </main>
        <Outlet context={breeds}/>
      </section>
    )
  }

  export default BreedPage;
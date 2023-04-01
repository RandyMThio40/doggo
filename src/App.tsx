import React, { useEffect, useRef, useLayoutEffect } from 'react'
import Home from './components/home/home';
import Nav from './components/nav/nav';
import {ImgProvider} from './components/context/imgContext';
import { BrowserRouter,Route,Routes, Outlet, useParams } from 'react-router-dom';
import {gsap} from 'gsap';
import {Flip} from 'gsap/Flip';
import styles from './App.module.scss';
import BreedPage from './components/breed/breedPage';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import CustomEase from 'gsap/CustomEase';
import Gallery from './components/gallery/gallery';
import About from './components/about/about';
import Faqs from './components/faqs/faqs';
import BreedListProvider from './components/breedsListContext/breedListContext';

import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(Flip,ScrollToPlugin,CustomEase,ScrollTrigger);



function Layout() {
  return(
    <>
      <Nav/>
      <ImgProvider>
        <Outlet/>
      </ImgProvider>
    </>
  )
}

function FlipComp() {
  const t1 = useRef<gsap.core.Timeline | undefined>();

  function doFlip(){
    const squares:HTMLElement[] = gsap.utils.toArray<HTMLElement>(`.${styles.square}`);
    const state = Flip.getState(squares);

    (squares[0].parentNode?.children[0] === squares[0]) 
    ? squares[0].parentNode.appendChild(squares[0])
    : squares[0].parentNode?.appendChild(squares[1])

    Flip.from(state,{
      duration:1,
      ease:"power1.inOut",
    })

    const small:HTMLElement = document.querySelector<HTMLElement>(`.${styles.small}`)! 
    const big:HTMLElement = document.querySelector<HTMLElement>(`.${styles.big}`)! 

    const state2:Flip.FlipState = Flip.getState([small, big]);

    small.classList.toggle(`${styles.active}`)
    big.classList.toggle(`${styles.active}`)

    Flip.from(state2,{
      duration:1,
      fade:true,
      ease:"power1.inOut",
      absolute:true,
      toggleClass:`${styles.flipping}`,
    })
    const square2:HTMLElement = document.querySelector<HTMLElement>(`.${styles.square2}`)!;
    const targetContainer:HTMLElement = document.querySelector<HTMLElement>(`.target`)!;
    const base:HTMLElement = document.querySelector<HTMLElement>(`.base`)!;
    
    const state3 = Flip.getState(square2);

    base.hasChildNodes()
    ? targetContainer.appendChild(square2)
    : base.appendChild(square2)

    Flip.from(state3,{
      duration:1,
      absolute:true,
      ease:"power1.inOut",
    })

    const box:HTMLElement = document.querySelector<HTMLElement>(`.${styles.box1}`)!;
    const box2:HTMLElement = document.querySelector<HTMLElement>(`.${styles.box2}`)!;
    const state4 = Flip.getState([box,box2]);
    box.classList.toggle(styles.active)
    box2.classList.toggle(styles.active)
    
    Flip.from(state4,{
      duration:1,
      absolute:true,
      fade:true,
      toggleClass:`${styles.flipped}`
    })

  }
  useEffect(()=>{
    const t2 =  gsap.timeline();
    t2.to("#timeline",{
        duration:1,
        xPercent:100,
    },0)
    t2.to("#timeline2",{
      duration:1,
      yPercent:-100,
    },1)
    
    t1.current = t2
    t1.current.play()
  
    console.log("play")

  },[])

  return(
    <>
    <div onClick={doFlip}>
      <div className={styles.flipCont} >
        <div className={styles.square}><span>1</span></div>
        <div className={styles.square}><span>2</span></div>
      </div>
      <div style={{display:"flex"}}>
        <div className={styles.growCont}>
          <div className={styles.small} data-flip-id="div" ><span>1</span></div>
        </div>
          <div style={{width:"50vw",height:"50vw",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div className={styles.big} data-flip-id="div" ><span>2</span></div>
          </div>
      </div>
      <div style={{display:"flex"}}>
        <div className="base" style={{width:"50vw",height:"50vw",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div id="square" className={styles.square2}>
              <span>1</span>
            </div>
        </div>
        <div className="target" style={{width:"50vw",height:"50vw",display:"flex",alignItems:"center",justifyContent:"center"}}>
        </div>
      </div>
      <div style={{display:"flex", height:"500px"}}>
        <div className={styles.box1}  data-flip-id="div"></div>
        <div className={styles.box2}  data-flip-id="div"></div>
      </div>

      <div id="timeline" style={{width:"100px",height:"100px",backgroundColor:"red"}}></div>
      <div id="timeline2" style={{width:"100px",height:"100px",backgroundColor:"red"}}></div>
      <button onClick={()=>{t1.current?.reverse()}}>reverse</button>
    </div>
    </>
  )
}

const handleScrollTop = () => {
  gsap.to(window,{
    duration:1,
    ease:"expo.out",
    scrollTo:{
      y:0,
      autoKill:true
    }
  })

}

function App() {
  
  useLayoutEffect(()=>{
    gsap.from(`.${styles.top}`,{
      scrollTrigger:{
        start:"5px 0",
        end:"5px 0 ",
        scrub:1.5,
      },
      scale:0,
      opacity:0,
      userSelect:"none",
      ease: "back.out(1.7)"
    })
    
  },[])

  return (
    <div id="App"className={styles.App}>
      <button id="top" className={styles.top} onClick={handleScrollTop}>up</button>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path="About" element={<About/>}/>
              <Route path="FAQ" element={<Faqs/>}/>
              <Route path=":id" element={<BreedPage/>}>
                <Route path=":index" element={<Gallery/>}/>
              </Route>
              <Route path="*" element={<>page not found</>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App

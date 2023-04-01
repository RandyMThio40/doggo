import React, { useEffect,useLayoutEffect,useState, useRef} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import { breedList } from '../../assets/breedsList';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './home.module.scss';
import gsap from 'gsap';


export interface Breed {
    breed:string,
    imgUrl:string,
}


export function Home(){
    const t1 = useRef<gsap.core.Timeline|undefined >(undefined);
    const nav = useNavigate();

    const handleClick = (e:React.MouseEvent<HTMLDivElement>) => {
        console.log(gsap.isTweening('#alternateNav'))
        if(gsap.isTweening('#alternateNav')){
            // gsap.killTweensOf(['#defaultNav'])
            console.log(true);
        }
        const container = document.createElement("div");
        const image = document.createElement("img");
        const backImage = document.createElement("img");
        const overlay = document.createElement("div");
        const h3 = document.createElement('h3');
        const aside = document.createElement('aside');
        const children = e.currentTarget.children;
        const imgSrc: string | null = children[0].getAttribute('src') || "";
        const target = e.currentTarget.getBoundingClientRect();
        
        backImage.classList.add(styles.backgroundImg)
        
        
        backImage.setAttribute("src",imgSrc);
        image.classList.add(styles.hero);
        image.style.minWidth = `${target.width}px`
        image.setAttribute("src",imgSrc);
        h3.innerText = e.currentTarget.id;
        aside.innerText = "view more"
        aside.classList.add(styles.viewMore);
        overlay.classList.add(styles.overlay);
        container.classList.add(styles.container)
        container.style.visibility = "hidden"
        
        container.appendChild(backImage);
        container.appendChild(image);
        overlay.appendChild(h3);
        overlay.appendChild(aside);
        container.appendChild(overlay);

        document.querySelector(`.${styles.home}`)?.appendChild(container);
        document.body.style.overflow = "hidden";
        if(t1.current) t1.current.kill();
        const handleStart = () => {

        }
        const handleReverse = () => {
            container.remove();
            t1.current?.kill();
            document.body.style.overflow = "";
            window.history.pushState({},'',`/`);
            
        }
        const handleComplete = (id:string) => {
            document.body.style.overflow = "";
            nav(`/${id}`,{replace:true})

        }
        t1.current = gsap.timeline({onStart:handleStart,onReverseComplete:handleReverse, onCompleteParams:[e.currentTarget.id,"asd","acr"], onComplete:handleComplete})
        t1.current.set(container,{
            width: target.width,
            height: target.height,
            top: target.top,
            left: target.left,
            backgroundImage: imgSrc,
            visibility: "hidden"
        })
        t1.current.to(container,{
            duration:0.5,
            width:"100vw",
            height:"100vh",
            top:0,
            left:0,
            borderRadius:0,
            ease:"sine.inOut",
            visibility: "visible"
        })
        
        t1.current.to(overlay,{
            duration:0.5,
            padding:"3rem 3.8rem",
            backgroundImage:"linear-gradient(0deg,rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 0.0) 80%, transparent 100%)",
            gap:0,
        },0)
        t1.current.to(`.${styles.mainContent}`,{
            opacity:0,
            duration:0.2,
        },0)
        t1.current.to(h3,{
            duration:0.4,
            fontSize:window.getComputedStyle(document.documentElement).getPropertyValue('--fs-h3'),
            textShadow:"1px 1px 10px rgba(0, 0, 0,1)"
        },0.1)
        t1.current.to(aside,{
            duration:0.2,
            height:0,
            opacity: 0,
        },0.1)
        t1.current.to(aside,{
            duration:0,
            visibility:"hidden" ,
        })
        t1.current.to("#defaultNav",{
            duration:0.5,
            translateY:"-100%",
            onComplete:()=>{
                gsap.set("#defaultNav",{display:"none"})
            },
        },0)
        console.log(window.getComputedStyle(document.documentElement).getPropertyValue('--fs-h3'))
        container.addEventListener("click",()=>{
            t1.current?.reverse();
        },{once:true})

        window.history.pushState({},'',`/${e.currentTarget.id}`);
    }

    useLayoutEffect(()=>{
        const defaultNav = document.querySelector<HTMLDivElement>("#defaultNav")!;
        for(let x of defaultNav.classList.entries() ){
            if(x[0]) defaultNav.classList.remove(x[1]);
        }

        if(history.state?.from === undefined) return;
        const prevId = history.state?.from.toLowerCase()
        
        const findObj = (item:Breed,idx:number) => {
            return item.breed === prevId;
        }
        
        const container = document.createElement("div");
        const image = document.createElement("img");
        const backImage = document.createElement("img");
        const overlay = document.createElement("div");
        const h3 = document.createElement('h3');
        const aside = document.createElement('aside');
        const breedObj = breedList.find(findObj);
        if(breedObj === undefined) return;
        const imgSrc: string = breedObj.imgUrl;
        const target:HTMLDivElement = document.querySelector(`#${prevId}`)!;
       

        console.log("cliengt height: ",window.innerHeight,target,(window.innerHeight - target.getBoundingClientRect().height )/2)
        
        if(target === null) return;
        document.body.style.overflow = "hidden";


        
        backImage.classList.add(styles.backgroundImg)
        
        
        backImage.setAttribute("src",imgSrc);
        image.classList.add(styles.hero);
        image.style.minWidth = `${target.getBoundingClientRect().width}px`
        image.setAttribute("src",imgSrc);
        h3.innerText = prevId;
        aside.innerText = "view more"
        aside.classList.add(styles.viewMore);
        overlay.classList.add(styles.overlay);
        container.classList.add(styles.container)
        container.style.visibility = "hidden"
        
        container.appendChild(backImage);
        container.appendChild(image);
        overlay.appendChild(h3);
        overlay.appendChild(aside);
        container.appendChild(overlay);

        document.querySelector(`.${styles.home}`)?.appendChild(container);
        
        const handleStart =() => {

            gsap.to(window,{
                duration:0,
                onComplete:()=>console.log("started"),
                scrollTo:{
                    y:target,
                    offsetY:( window.innerHeight - target.getBoundingClientRect().height ) / 2
                    
                }
            })
            console.log("start: ",target.getBoundingClientRect())


        }
            
        const handleComplete = () => {
            document.body.style.overflow = "";
            container.remove();
        }

        const t2 = gsap.timeline({onStart:handleStart,onComplete:handleComplete,});
        t2.set(container,{
            width:"100vw",
            height:"100vh",
            top:0,
            left:0,
            visibility:"visible",
        })
        t2.to(container,{
            duration:1,
            width:target.getBoundingClientRect().width,
            height:target.getBoundingClientRect().height,
            top:()=>target.getBoundingClientRect().top,
            left:target.getBoundingClientRect().left
            
        })

        t2.from(overlay,{
            duration:0.5,
            padding:"3rem 3.8rem",
            backgroundImage:"linear-gradient(0deg,rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 0.0) 80%, transparent 100%)",
            gap:0,
        },0.1)
        t2.from(`.${styles.mainContent}`,{
            opacity:0,
            duration:1,
        },0.1)
        t2.from(h3,{
            duration:0.5,
            fontSize:window.getComputedStyle(document.documentElement).getPropertyValue('--fs-h3'),
            textShadow:"1px 1px 10px rgba(0, 0, 0,1)"
        },0.1)
        t2.from(aside,{
            visibility:"hidden" ,
            duration:0.2,
            height:0,
            opacity: 0,
        },0.1)


        window.history.pushState({},'')
    },[])

    useEffect(()=>{

    },[])

    return(
        <section className={styles.home}>
            <main className={styles.mainContent}>
                {
                    breedList.map((obj:Breed,idx:number)=>{
                        return(
                            <div className={styles.cards} id={`${obj.breed}`} key={idx} onClick={handleClick}>
                                <img className={styles.hero} src={obj.imgUrl}/>
                                <div className={styles.overlay}>
                                    <h3>{obj.breed}</h3>
                                    <aside className={styles.viewMore}>
                                        view more
                                    </aside>
                                </div>
                            </div>
                        )
                    })
                }
            </main>
        </section>
    )
}

export default Home;
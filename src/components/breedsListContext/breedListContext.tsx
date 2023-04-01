import React, {useContext,createContext,useState,useEffect} from 'react';

interface BreedOBJ {
    imgUrl:string,
    breed:string,
}

interface Props{
    children:JSX.Element | JSX.Element[],
}

const breedListContext = createContext<BreedOBJ[]>([]);

export const getBreedList = () => {
    return useContext(breedListContext);
}

function BreedListProvider({children}:Props) {
    const [breedList,setBreedList] = useState<BreedOBJ[]>([]);

    useEffect(()=>{
        const isImageGood = () => {
            const img = new Image();

        }
        const getImageUrls = async (breeds:string[]):Promise<BreedOBJ[]> => {
            try{
                const arr:BreedOBJ[] = []
                
                for(const breed of breeds) {
                    const data = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then((e)=>e.json());
                    const obj:BreedOBJ = {
                        imgUrl:data.message,
                        breed:breed,
                    }
                    arr.push(obj);
                }
                
                return arr
            } catch(err){
                return []
            }
        }
        const init = async () => {
            console.log("init")
            try{
                const breeds = await fetch(`https://dog.ceo/api/breeds/list/all`).then((e)=>{return e.json()})
                // console.log(Object.keys(breeds.message));
                let count = 0;
                let start = Date.now()
                for (const breed of await getImageUrls(Object.keys(breeds.message))){
                    count++;
                    console.log(breed)
                }

                let end = Date.now();
                console.log("milliseconds: ", (end-start)/1000)
                console.log(count);


                
            } catch(err) {

            }
        }

        init();

    },[])

    return(
        <breedListContext.Provider value={breedList}>
            {children}
        </breedListContext.Provider>
        
    )
}

export default BreedListProvider
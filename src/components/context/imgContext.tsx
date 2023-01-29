import React, {useContext,createContext,useState} from 'react';

interface ImgObj {
    imgUrl:string,
    breed:string,
}

interface Props{
    children:JSX.Element | JSX.Element[],
}

const ImgContext = createContext<ImgObj|undefined>(undefined);
const SetImgContext = createContext<Function|undefined>(undefined);

export function useImgState(){
    const value = useContext(ImgContext);
    const updater = useContext(SetImgContext);
    return [value,updater];
}

export function ImgProvider({ children }:Props){
    const [imgUrl,setImgUrl] = useState<ImgObj>({imgUrl:"",breed:""});

    return(
        <SetImgContext.Provider value={setImgUrl}>
            <ImgContext.Provider value={imgUrl}>
                {children}
            </ImgContext.Provider>
        </SetImgContext.Provider>
    )
}

export default ImgProvider;
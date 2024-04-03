interface AlertInput{
    type:string;
    label:string;
    value:unknown;
    onChangeFunc:(event:React.ChangeEvent<HTMLInputElement>)=>void;
}

interface AlertStructure {
    headerText: string;
    contentText: string;
    input?:AlertInput[]
    btn1: {
        btnText: string;
        btnFunc: (param1?:unknown,param2?:unknown,param3?:unknown) => void; // Use () => void for dynamic function,
    };
    btn2?: {
        btnText: string;
        btnFunc: (param1?:unknown,param2?:unknown,param3?:unknown) => void;
    }
}
interface AlertStructure {
    headerText: string;
    contentText: string;
    btn1: {
        btnText: string;
        btnFunc: (param1?:unknown,param2?:unknown,param3?:unknown) => void; // Use () => void for dynamic function,
    };
    btn2?: {
        btnText: string;
        btnFunc: (param1?:unknown,param2?:unknown,param3?:unknown) => void;
    }
}
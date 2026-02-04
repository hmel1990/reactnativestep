import { Text, useWindowDimensions, View } from "react-native";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";
import { useState } from "react";
import CalcOperations from "./model/CalcOperations";

const divZeroMessage = "Cannot divide by zero";
const dotSymbol = ',';
const minusSymbol = '-';
const addSymbol = '+';
const divSymbol = '÷';
const mulSymbol = '×';
const subSymbol = '-';
const maxDigits = 16;

interface ICalcState {
    result: string,                           // вміст основного поля калькулятора - "екрану"
    expression: string,                       // вираз, що формується вище "результату"
    needClearResult: boolean,                 // потреба стерти результат при початку введення (після операцій)                    
    needClearExpression: boolean,             // потреба стерти вираз при початку введення (після операцій)                 
    isError: boolean,                         // чи знаходиться калькулятор в аварійному стані (показ помилки)    
    operation?: CalcOperations | undefined,   // операція, що була натиснена (+/-/*...)
    prevArgument?: number | undefined,        // аргумент, що був перед натисненням операції
};

const initialState:ICalcState = {
    result: "0",
    expression: "",
    needClearResult: false,        
    needClearExpression: false,
    isError: false,    
};

export default function Calc() {
    const {width, height} = useWindowDimensions();

    // const [result, setResult] = useState<string>("0");
    // const [expression, setExpression] = useState<string>("");
    // const [needClear, setNeedClear] = useState<boolean>(false);    // потреба стерти результат при початку введення (після операцій)
    // const [needClrExp, setNeedClrExp] = useState<boolean>(false);  // потреба стерти вираз при початку введення (після операцій)
    // const [isError, setError] = useState<boolean>(false);          // чи знаходиться калькулятор в аварійному стані (показ помилки)
    
    const [calcState, setCalcState] = useState<ICalcState>(initialState);

const squareClick = (_: ICalcButtonData) => {
        const arg = resToNumber();
        const res = arg * arg;
        setCalcState({
            ...calcState,
            expression: `sqr(${calcState.result})`,
            needClearExpression: true,
            needClearResult: true,
            isError: isNaN(res),
            result: numToResult(res)
        });
    };

    const sqrtClick = (_: ICalcButtonData) => {
        const arg = resToNumber();
        const isInvalid = arg < 0;
        const res = isInvalid ? Number.NaN : Math.sqrt(arg);
        
        setCalcState({
            ...calcState,
            expression: `√(${calcState.result})`,
            needClearExpression: true,
            needClearResult: true,
            isError: isInvalid || isNaN(res),
            result: isInvalid ? "Invalid input" : numToResult(res)
        });
    };


    const operationClick = (btn:ICalcButtonData) => {
        const newState:ICalcState = {...calcState,
            needClearResult: true,
            needClearExpression: false,
            operation: 
                btn.text == divSymbol ? CalcOperations.div
                : btn.text == mulSymbol ? CalcOperations.mul
                : btn.text == addSymbol ? CalcOperations.add
                : btn.text == subSymbol ? CalcOperations.sub
                : undefined,
        };
        if(calcState.operation) {   // повторне натискання -- є попередня невиконана операція, слід обчислити
            const prevResult = doOperationWithState();
            const res = numToResult(prevResult);
            newState.expression = res + ' ' + btn.text;
            newState.result = res;
            newState.prevArgument = prevResult;
        }
        else {
            newState.expression = calcState.result + ' ' + btn.text;
            newState.prevArgument = resToNumber();
        }
        setCalcState(newState);
    };



    const equalClick = (_:ICalcButtonData) => {
        if(calcState.operation) {
            setCalcState({...calcState,
                expression: calcState.expression + ' ' + calcState.result + ' =',
                needClearResult: true,
                needClearExpression: true,
                prevArgument: undefined,
                operation: undefined,
                result: numToResult( doOperationWithState() ),
            });
        }
    };

    const doOperationWithState = ():number => {
        const arg = resToNumber();
        return calcState.operation == CalcOperations.div ? calcState.prevArgument! / arg 
            :  calcState.operation == CalcOperations.mul ? calcState.prevArgument! * arg 
            :  calcState.operation == CalcOperations.add ? calcState.prevArgument! + arg 
            :  calcState.operation == CalcOperations.sub ? calcState.prevArgument! - arg 
            :  Number.NaN
    };

    const formatResult = (rawStr: string): string => {
        // Убираем все существующие пробелы
        let currentRes = rawStr.replace(' ', '');
        
        const parts = currentRes.split(dotSymbol);
        let intPart = parts[0];
        const fractPart = parts.length > 1 ? dotSymbol + parts[1] : "";

        let formattedInt = "";
        let distanceToLeft = 0; 

        // Идем сзади наперед по целой части
        for (let i = intPart.length - 1; i >= 0; i--) {
            if (distanceToLeft > 0 && distanceToLeft % 3 === 0 && intPart[i] !== minusSymbol) {
                formattedInt = " " + formattedInt;
            }
            formattedInt = intPart[i] + formattedInt;
            distanceToLeft++;
        }
        return formattedInt + fractPart;
    };

        const digitClick = (btn:ICalcButtonData) => {
        
        var res = calcState.result;
        console.log(res);
        
        if(res === "0" || calcState.needClearResult || calcState.isError) { 
            calcState.result = btn.text;
            calcState.isError = false;
            calcState.needClearResult =false;
            calcState.needClearExpression = false;
            return;
        }
        else {
            let currentRes = res.replace(' ', '');
            if (currentRes === "0") {
                currentRes = "";
            }
            
            currentRes += btn.text;
            
            const parts = currentRes.split(dotSymbol);
            let intPart = parts[0];
            const fractPart = parts.length > 1 ? dotSymbol + parts[1] : "";
            
            let formattedInt = "";
            
            // Идем по строке СЗАДУ НАПЕРЕД
            // Используем счетчик, чтобы вставлять пробел каждые 3 цифры
            let distanceToLeft = 0; 
            
            for (let i = intPart.length - 1; i >= 0; i--) {
                // Если мы уже добавили 3 цифры и это не минус — ставим пробел
                if (distanceToLeft > 0 && distanceToLeft % 3 === 0 && intPart[i] !== minusSymbol) {
                    formattedInt = " " + formattedInt;
                }
                
                formattedInt = intPart[i] + formattedInt;
                distanceToLeft++;
            }
            res = formattedInt + fractPart;
        }
        
        if (calcState.needClearExpression) {
            calcState.expression = "";
            calcState.needClearExpression = false;
        }
        if(calcState.result.replace(' ','').replace(dotSymbol, '').replace(minusSymbol, '').length >= 16) return;

        setCalcState({...calcState, result: res});

    };


        const backspaceClick = (_: ICalcButtonData) => {
        // Убираем все пробелы, чтобы корректно отрезать последний символ
        
        setCalcState(prevState => {
            if(prevState.needClearExpression) {
                prevState.needClearExpression = false;
                prevState.expression = "";
            }
            if(prevState.needClearResult) {
                prevState.needClearResult = false;
                prevState.result = "0";
            }

            else {
                let cleanRes = calcState.result.replace(' ', '');
                if (cleanRes.length > 1) {
                    let newStr = cleanRes.substring(0, cleanRes.length - 1);
                    
                    // Если после удаления остался только минус, возвращаем "0"
                    if (newStr === minusSymbol) 
                    {
                        prevState.result = "0";
                    } 
                    else 
                    {
                      prevState.result = formatResult(newStr);
                    }
                } 
                else 
                {
                    prevState.result = "0";
                }
                // prevState.result = calcState.result.length > 1
                //  ? calcState.result.substring(0, calcState.result.length - 1)
                //  : "0"
            }
            return {...prevState};
        });
        
        

    };

    const dotClick = (btn:ICalcButtonData) => {
        // десятична кома (точка):
        // якщо на рез. "0", то він не стирається, буде "0,"
        // якщо у рез. вже є кома, то натиснення ігнорується
        // Символ коми відповідає тексту на кнопці
        const newState = {...calcState};

        if(calcState.needClearExpression) {
            newState.expression = "";
            newState.needClearExpression = false;
        }

        if(calcState.needClearResult) {
            newState.result = "0" + dotSymbol;
            newState.needClearResult = false;
        }
        else if(! calcState.result.includes(btn.text)) {
            newState.result = calcState.result + btn.text;
        }
        setCalcState(newState);
    };


    const inverseClick = (_:ICalcButtonData) => {
        var arg = resToNumber();
        setCalcState({...calcState, 
            expression: `1/(${calcState.result})`,
            needClearExpression: true,
            needClearResult: true,
            isError: arg == 0,
            result: arg == 0
                ? divZeroMessage
                : numToResult(1.0 / arg)
        });
    };
    
    const clearClick = (_:ICalcButtonData) => {
        setCalcState({...calcState, 
            expression: "",
            isError: false,
            result: "0",
            // operation: undefined,
            prevArgument: undefined
        });
    }

    const resToNumber = (): number => {
        var res = calcState.result.replace(dotSymbol, '.').replace(minusSymbol, '-');
        return Number(res);
    };

    const numToResult = (num: number): string => {
        var res = num.toString();
        if(num >= 1e-6) {   // <= 9.9e-7 автоматично спрацьовує ехр-форма
            res = res.substring(0, maxDigits + 1);   // +1 - на символ коми
        }
        res = res.replace('.', dotSymbol);   // замінюємо стандарту десятичну точку на dotSymbol
        return res;
    }

    const portraitView = () => <View style={CalcStyle.calc}>
        <Text style={CalcStyle.expression}>{calcState.expression}</Text>
        <Text style={[CalcStyle.result, CalcStyle.containerResExpMem, {fontSize: (calcState.result.length <= 12 ? 50 : (width - 20) / calcState.result.length * 1.8 )}]}>{calcState.result}</Text>
        
        <View style={CalcStyle.memoryRow}>
        </View>
        <View style={CalcStyle.memoryRow}>
            <Text style={[CalcStyle.memoryButton, CalcStyle.memoryButtonDisabled]}>MC</Text>
            <Text style={[CalcStyle.memoryButton, CalcStyle.memoryButtonDisabled]}>MR</Text>
            <Text style={CalcStyle.memoryButton}>M+</Text>
            <Text style={CalcStyle.memoryButton}>M−</Text>
            <Text style={CalcStyle.memoryButton}>MS</Text>
            <Text style={[CalcStyle.memoryButton, CalcStyle.memoryButtonDisabled]}>M▾</Text>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"%",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick}}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation, action: backspaceClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"¹/ₓ", buttonType:calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:"x²", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation,  action: squareClick}}/>
            <CalcButton data={{text:"√x", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation,  action: sqrtClick}}/>
            <CalcButton data={{text:"÷",  buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation,  action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"×", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"−", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"+", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"±", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:",", buttonType: CalcButtonType.digit,    action: dotClick}}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal,    action: equalClick}}/>
        </View>
    </View>;
    const landscapeView = () => <View style={CalcStyle.calc}>
        <View style={CalcStyle.containerResExpMem}>
            <View style={CalcStyle.containerExpMem}>
                <Text style={CalcStyle.expression}>{calcState.expression} =</Text>

        
            </View>            
            <Text style={[CalcStyle.result, {fontSize: (calcState.result.length <= 12 ? 50 : (width - 20) / calcState.result.length * 1.8 )}, calcState.isError&& {fontSize: 32}, ]}>{calcState.result}</Text>
        </View>

            <View style={CalcStyle.memoryRow}>
                <Text style={[CalcStyle.memoryButton, CalcStyle.memoryButtonDisabled]}>MC</Text>
                <Text style={[CalcStyle.memoryButton, CalcStyle.memoryButtonDisabled]}>MR</Text>
                <Text style={CalcStyle.memoryButton}>M+</Text>
                <Text style={CalcStyle.memoryButton}>M−</Text>
                <Text style={CalcStyle.memoryButton}>MS</Text>
                <Text style={[CalcStyle.memoryButton, CalcStyle.memoryButtonDisabled]}>M▾</Text>
            </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"％",  buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"÷", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1/x", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:"×", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"x2", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: squareClick}}/>
            <CalcButton data={{text:"-", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"Vx", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: sqrtClick}}/>
            <CalcButton data={{text:"+", buttonType: calcState.isError? CalcButtonType.disabled: CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"+/-", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:",", buttonType: CalcButtonType.digit, action: dotClick    }}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal, action: equalClick    }}/>
        </View>
    </View>;

    return width < height ? portraitView() : landscapeView();
    // return portraitView()
}

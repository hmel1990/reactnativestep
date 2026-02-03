import { Text, useWindowDimensions, View } from "react-native";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";
import { useState } from "react";

export default function Calc() {
    const {width, height} = useWindowDimensions();
    const [result, setResult] = useState<string>("0");
    const [expression, setExpression] = useState<string>("");
    const [needClear, setNeedClear] = useState<boolean>(false);    // потреба стерти результат при початку введення (після операцій)
    const [needClrExp, setNeedClrExp] = useState<boolean>(false);  // потреба стерти вираз при початку введення (після операцій)
    const [isError, setError] = useState<boolean>(false);          // чи знаходиться калькулятор в аварійному стані (показ помилки)
    const dotSymbol = ',';
    const minusSymbol = '-';
    const maxDigits = 16;
    const divZeroMessage = "Cannot divide by zero";

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
        
        var res = result;
        console.log(res);
        
        if(res === "0" || needClear || isError) { 
            setResult(btn.text);
            setError(false);
            setNeedClear(false);
            setNeedClrExp(false);
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
        
        if (needClrExp) {
            setExpression("");
            setNeedClrExp(false);
        }
        if(result.replace(' ','').replace(dotSymbol, '').replace(minusSymbol, '').length >= 16) return;

        setResult(res);

    };


        const backspaceClick = (_: ICalcButtonData) => {
        // Убираем все пробелы, чтобы корректно отрезать последний символ
        let cleanRes = result.replace(/ /g, '');

        if (cleanRes.length > 1) {
            let newStr = cleanRes.substring(0, cleanRes.length - 1);
            
            // Если после удаления остался только минус, возвращаем "0"
            if (newStr === minusSymbol) {
                setResult("0");
            } else {
                setResult(formatResult(newStr));
            }
        } else {
            setResult("0");
        }
    };

    const dotClick = (btn:ICalcButtonData) => {
        // десятична кома (точка):
        // якщо на рез. "0", то він не стирається, буде "0,"
        // якщо у рез. вже є кома, то натиснення ігнорується
        // Символ коми відповідає тексту на кнопці
        if(!result.includes(btn.text)) {
            setResult(result + btn.text);
        }
    };

    const inverseClick = (_:ICalcButtonData) => {
        setExpression(`1/(${result})`);
        var arg = resToNumber();
        if(arg == 0) {
            setResult(divZeroMessage);
            setError(true);
        }
        else {
            setResult( numToResult(1.0 / arg) );
        }        
        setNeedClear(true);
        setNeedClrExp(true);

    };
    
        const clearClick = (_:ICalcButtonData) => {
        setResult("0");
        setExpression("");
        setError(false);
    }

        const resToNumber = (): number => {
        var res = result.replace(dotSymbol, '.').replace(minusSymbol, '-');
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
        <Text style={CalcStyle.expression}>{expression}</Text>
        <Text style={[CalcStyle.result, CalcStyle.containerResExpMem, {fontSize: (result.length <= 12 ? 50 : (width - 20) / result.length * 1.8 )}]}>{result}</Text>
        
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
            <CalcButton data={{text:"¹/ₓ", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:"x²", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,  action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"√x", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,  action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"÷",  buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,  action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"×", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"−", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:"+", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"±", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit,    action: digitClick}}/>
            <CalcButton data={{text:",", buttonType: CalcButtonType.digit,    action: dotClick}}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
    </View>;
    const landscapeView = () => <View style={CalcStyle.calc}>
        <View style={CalcStyle.containerResExpMem}>
            <View style={CalcStyle.containerExpMem}>
                <Text style={CalcStyle.expression}>{expression} =</Text>

        
            </View>            
            <Text style={[CalcStyle.result, {fontSize: (result.length <= 12 ? 50 : (width - 20) / result.length * 1.8 )}, isError&& {fontSize: 32}, ]}>{result}</Text>
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
            <CalcButton data={{text:"％",  buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"÷", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,}}/>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1/x", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:"×", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,}}/>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"x2", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,}}/>
            <CalcButton data={{text:"-", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,}}/>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"Vx", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,}}/>
            <CalcButton data={{text:"+", buttonType: isError? CalcButtonType.disabled: CalcButtonType.operation,}}/>
            <CalcButton data={{text:"+/-", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick    }}/>
            <CalcButton data={{text:",", buttonType: CalcButtonType.digit, action: dotClick    }}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal    }}/>
        </View>
    </View>;

    return width < height ? portraitView() : landscapeView();
    // return portraitView()
}

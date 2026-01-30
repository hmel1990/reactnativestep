import { Text, useWindowDimensions, View } from "react-native";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";

export default function Calc() {
    const {width, height} = useWindowDimensions();

    const portraitView = () => <View style={CalcStyle.calc}>
        <Text style={CalcStyle.expression}>3 - 9 =</Text>
        <Text style={CalcStyle.result}>-6</Text>
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
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"¹/ₓ", buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"x²",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"√x",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"÷",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"×", buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"−", buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"+", buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"±", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:",", buttonType: CalcButtonType.digit,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal,    action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
        </View>
    </View>;
    const landscapeView = () => <View>
        <Text>Calculator landscapeView</Text>
    </View>;

    return width < height ? portraitView() : landscapeView();
}

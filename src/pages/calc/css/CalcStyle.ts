import { StyleSheet } from "react-native";
import { textColor } from "../../../features/values/colors";

const CalcStyle = StyleSheet.create({
   calc: {
    flex: 1,
    width: "100%",
    backgroundColor: "#202020", // Чуть мягче черного
    paddingBottom: 4, // Отступ снизу экрана
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
   },
   expression: {
    flex: 1,
    color: "#bbb",
    textAlign: "right",
    marginTop: 10,
   },
   result: {
    flex: 2,
    color: textColor,
    fontSize: 50,
    textAlign: "right",
   },
   memoryRow: {
    height: 40, // Фиксированная высота для ряда памяти
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 5,
   },
   buttonRow: {
    flex: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
   },
   memoryButton: {
    color: textColor,
    fontSize: 13,
    fontWeight: "500",
    padding: 8,
   },
   memoryButtonDisabled: {
    color: "#666", // Цвет для неактивной кнопки
   },
});

export default CalcStyle;
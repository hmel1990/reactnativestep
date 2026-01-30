import { StyleSheet } from "react-native";
import { textColor } from "../../features/values/colors";

const AppStyle = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: '#444',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appBar: {
    //header
    paddingVertical:10,


  },
  appBarTitle: {
    color: textColor,
    fontWeight: 700,
    paddingVertical:10,
  },
  main:{
    backgroundColor: "salmon",
    flex: 1,
    width: "100%",
  },
  navBar: {
    //footer
    width: "100%",
    backgroundColor: '#444',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: {
    color: textColor,
    fontWeight: '700',
    fontSize: 12,
    
    // Рамочка та відступи
    marginVertical:10,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: textColor, 
    borderRadius: 25,       
   

    // Тінь 
    elevation: 8,
    
    backgroundColor: '#555',
  },
});

export default AppStyle;

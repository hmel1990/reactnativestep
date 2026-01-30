import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Home from "../../pages/home/Home";
import Calc from "../../pages/calc/Calc";
import AppStyle from "./AppStyle";
import { BackHandler, Image, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useEffect, useState } from "react";

// /product?id=100500
interface IRouteInformation {
    slug: string,          // product
    parameters?: object     // { "id": 100500 }
};

export default function App() {
    const [history, setHistory] = useState<Array<IRouteInformation>>([]);
    const [page, setPage] = useState<IRouteInformation>({slug: "home"});
        const {width, height} = useWindowDimensions();
    

    const navigate = (route:IRouteInformation) => {
        console.log(history);
        if(route.slug != page.slug || route.parameters != page.parameters) {
            history.push(page);
            setPage(route);
            setHistory(history);
        }
    };

    const popRoute = () => {   // back
        console.log(history);
        if(history.length > 0) {
            const prevRoute = history.pop()!;
            setPage(prevRoute);
            setHistory(history);
        }
        else {
            BackHandler.exitApp();
        }
    };

    useEffect(() => {
        const listener = BackHandler.addEventListener("hardwareBackPress", () => {
            popRoute();
            return true;   // stop propagation
        });

        return () => { listener.remove(); };
    }, []);

    return <SafeAreaProvider>
        <SafeAreaView edges={['top', 'bottom']} style={AppStyle.container}>

            {width < height &&
                <View style={AppStyle.appBar}>
                    <Text style={AppStyle.appBarTitle}>React Native PV-421</Text>
                </View>
            }


            <View style={AppStyle.main}>
                {/* <Home /> */}
                { page.slug == 'home' ? <Home />
                : page.slug == 'calc' ? <Calc />
                : <Text>404</Text>
                }                
            </View>
            

            {width < height &&
            <View style={AppStyle.navBar}>
                
                <TouchableOpacity 
                    onPress={() => navigate({slug: "home"})} 
                    style={{width: 48, height: 48, }}>
                    <Image 
                        source={require("../assets/img/home.png")} 
                        style={{width: 28, height: 28, tintColor: "#ddd", marginTop: 16}}/>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigate({slug: "calc"})} 
                    style={{width: 48, height: 48, }}>
                    <Image 
                        source={require("../assets/img/calc.png")} 
                        style={{width: 28, height: 28, tintColor: "#ddd", display:"flex", marginTop: 16}}/>
                </TouchableOpacity>
            </View>
        }

        </SafeAreaView>
    </SafeAreaProvider>;
}

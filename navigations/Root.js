import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home"
import Menu from "../screens/Menu";
import Recipes from "../screens/Recipes";
import Favorites from "../screens/Favorites";
import ShoppingList from "../screens/ShoppingList";
import More from "../screens/More";

import { NavigationContainer } from "@react-navigation/native";

import Ionicons from '@expo/vector-icons/Ionicons'
import MoreNavigation from "./MoreNavigation";


const Tab = createBottomTabNavigator();



export default function Root() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon:({ focused, color, size}) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === "Menu") {
                            iconName = focused ? 'restaurant' : 'restaurant-outline'
                        } else if (rn === "Recipes") {
                            iconName = focused ? 'book' : 'book-outline'
                        } else if (rn === "Favorites") {
                            iconName = focused ? 'heart' : 'heart-outline'
                        } else if (rn === "Shopping List") {
                            iconName = focused ? 'cart' : 'cart-outline'
                        } else if (rn === "More Navigation") {
                            iconName = focused ? 'information' : 'information-outline'
                        }

                        return <Ionicons name={iconName} size={24} color="black" />
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                {/* <Tab.Screen name="Home" component={Home} /> */}
                <Tab.Screen name="Menu" title component={Menu} options={{title: "Jídelníček"}} />
                <Tab.Screen name="Recipes" component={Recipes} options={{title: "Recepty"}} />
                <Tab.Screen name="Favorites" component={Favorites} options={{title: "Oblíbené"}} />
                <Tab.Screen name="Shopping List" component={ShoppingList} options={{title: "Nákupní seznam"}} />
                <Tab.Screen name="More Navigation" component={MoreNavigation} options={{headerShown: false, title: "Více"}} />
            </Tab.Navigator>
        </NavigationContainer>

    )
}

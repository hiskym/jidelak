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
import RecipeNavigation from "./RecipeNavigation";
import FavoriteNavigation from "./FavoriteNavigation";


const Tab = createBottomTabNavigator();



export default function Root({cart, setCart, favorites, setFavorites}) {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon:({ focused, color, size}) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === "Menu") {
                            iconName = focused ? 'restaurant' : 'restaurant-outline'
                        } else if (rn === "Recipe Navigation") {
                            iconName = focused ? 'book' : 'book-outline'
                        } else if (rn === "FavoriteNavigation") {
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
                <Tab.Screen name="Recipe Navigation" options={{headerShown: false, title: "Recepty"}}>
                    {() => <RecipeNavigation cart={cart} setCart={setCart} favorites={favorites} setFavorites={setFavorites} />}
                </Tab.Screen>
                <Tab.Screen name="FavoriteNavigation" options={{headerShown: false, title: "Oblíbené"}}>
                    {() => <FavoriteNavigation favorites={favorites} setFavorites={setFavorites} cart={cart} setCart={setCart} />}
                </Tab.Screen>
                <Tab.Screen name="Shopping List" options={{title: "Nákupní seznam"}}>
                    {() => <ShoppingList cart={cart} setCart={setCart} />}
                </Tab.Screen>
                <Tab.Screen name="More Navigation" component={MoreNavigation} options={{headerShown: false, title: "Více"}} />
            </Tab.Navigator>
        </NavigationContainer>

    )
}

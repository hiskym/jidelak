import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ShoppingList from "../screens/ShoppingList";
import Ionicons from '@expo/vector-icons/Ionicons'
import MoreNavigation from "./MoreNavigation";
import RecipeNavigation from "./RecipeNavigation";
import FavoriteNavigation from "./FavoriteNavigation";
import MenuNavigation from "./MenuNavigation";
import CartNavigation from "./CartNavigation";


const Tab = createBottomTabNavigator();



export default function Root() {
    return (
        <Tab.Navigator
            initialRouteName="Recipe Navigation"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === "MenuNavigation") {
                        iconName = focused ? 'restaurant' : 'restaurant-outline'
                    } else if (rn === "Recipe Navigation") {
                        iconName = focused ? 'book' : 'book-outline'
                    } else if (rn === "FavoriteNavigation") {
                        iconName = focused ? 'heart' : 'heart-outline'
                    } else if (rn === "CartNavigation") {
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

            <Tab.Screen name="MenuNavigation" options={{ headerShown: false, title: "Jídelníček" }}>
                {() => <MenuNavigation />}
            </Tab.Screen>

            <Tab.Screen name="Recipe Navigation" options={{ headerShown: false, title: "Recepty" }}>
                {() => <RecipeNavigation />
                }
            </Tab.Screen>
            <Tab.Screen name="FavoriteNavigation" options={{ headerShown: false, title: "Oblíbené" }}>
                {() => <FavoriteNavigation />}
            </Tab.Screen>

            <Tab.Screen name="CartNavigation" options={{ headerShown: false, title: "Nákupní seznam" }}>
                {() => <CartNavigation />}
            </Tab.Screen>
            <Tab.Screen name="More Navigation" options={{ headerShown: false, title: "Více" }}>
                {() => <MoreNavigation />}
            </Tab.Screen>
        </Tab.Navigator>

    )
}

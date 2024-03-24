// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons'
import MoreNavigation from "./MoreNavigation";
import RecipeNavigation from "./RecipeNavigation";
import FavoriteNavigation from "./FavoriteNavigation";
import MenuNavigation from "./MenuNavigation";
import CartNavigation from "./CartNavigation";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


// const Tab = createBottomTabNavigator();

const Tab = createMaterialTopTabNavigator();

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

                    return <Ionicons name={iconName} size={24} color={'#0F172A'} />
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: '#0F172A',
                tabBarLabelStyle: { textTransform: 'none', fontSize: 10 },
                tabBarIndicatorStyle: {height: 0}
            })}
            tabBarPosition='bottom'
        >
            {/* <Tab.Screen name="Home" component={Home} /> */}

            <Tab.Screen name="MenuNavigation" options={{ headerShown: false, title: "Jídlo" }}>
                {() => <MenuNavigation />}
            </Tab.Screen>

            <Tab.Screen name="Recipe Navigation" options={{ headerShown: false, title: "Recepty" }}>
                {() => <RecipeNavigation />
                }
            </Tab.Screen>
            <Tab.Screen name="FavoriteNavigation" options={{ headerShown: false, title: "Oblíbené" }}>
                {() => <FavoriteNavigation />}
            </Tab.Screen>

            <Tab.Screen name="CartNavigation" options={{ headerShown: false, title: "Košík" }}>
                {() => <CartNavigation />}
            </Tab.Screen>
            <Tab.Screen name="More Navigation" options={{ headerShown: false, title: "Více" }}>
                {() => <MoreNavigation />}
            </Tab.Screen>
        </Tab.Navigator>

    )
}

import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Chart from '../components/Chart'
import { fetchMacros } from '../utils/userUtils'
import { useUserStore } from '../store/UserStore'
import { Timestamp } from 'firebase/firestore'
import { endOfDay, startOfDay } from '../utils/DateUtils'
import SelectChartOption from '../components/SelectChartOption'
import { fetchDailyMacros } from '../utils/menuUtils'

export default function Analytics() {

    const { user } = useUserStore();
    const [userMacros, setUserMacros] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dailyMacros, setDailyMacros] = useState([]);

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalProteins, setTotalProteins] = useState(0);
    const [totalFats, setTotalFats] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFiber, setTotalFiber] = useState(0);

    const [interval, setInterval] = useState('');

    const currentDate = new Date();

    const dateMinusSeven = new Date(currentDate);
    dateMinusSeven.setDate(currentDate.getDate() - 6);

    const dateMinusThirty = new Date(currentDate);
    dateMinusThirty.setDate(currentDate.getDate() - 29);

    const currentYear = currentDate.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const currentDayEnd = Timestamp.fromDate(endOfDay(currentDate));
    const weekStart = Timestamp.fromDate(startOfDay(dateMinusSeven))
    const monthStart = Timestamp.fromDate(startOfDay(dateMinusThirty))

    useEffect(() => {
        setLoading(true)
        fetchMacros(user.uid, setUserMacros);
        fetchDailyMacros(user.uid, currentDayEnd, weekStart, monthStart, endOfYear, startOfYear, setDailyMacros, interval, setLoading)
    }, [user.uid, interval]);

    useEffect(() => {
        if (userMacros && dailyMacros.length > 0) {
            const data = dailyMacros.map((dailyMacro) => {
                const { date, totalCalories } = dailyMacro;

                const convertedDate = (new Date(date)).toLocaleDateString('cs-CZ');

                return {
                    day: convertedDate,
                    kcal: userMacros.calories,
                    kcalMin: userMacros.calories - 300,
                    kcalMax: userMacros.calories + 300,
                    dailyIntake: totalCalories,
                };
            });

            const sumCal = dailyMacros.reduce((acc, obj) => acc + obj.totalCalories, 0);
            const sumProtein = dailyMacros.reduce((acc, obj) => acc + obj.totalProteins, 0);
            const sumFat = dailyMacros.reduce((acc, obj) => acc + obj.totalFats, 0);
            const sumCarb = dailyMacros.reduce((acc, obj) => acc + obj.totalCarbs, 0);
            const sumFiber = dailyMacros.reduce((acc, obj) => acc + obj.totalFiber, 0);

            setChartData(data);

            setTotalCalories(sumCal)
            setTotalProteins(sumProtein)
            setTotalFats(sumFat)
            setTotalFiber(sumFiber)
            setTotalCarbs(sumCarb)

            setLoading(false);
        }
    }, [userMacros, dailyMacros]);

    return (
        <ScrollView className="p-5">
            <View className="">
                <SelectChartOption setInterval={setInterval} interval={interval} />
                {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />}
                {chartData.length > 0 && chartData[0].kcal != undefined && <Chart data={chartData} />}
                {totalCalories !== 0 &&
                    <>
                        <View className="flex items-center mt-5">
                            <Text className="text-xl font-bold text-slate-900">Celkem snězeno za období:</Text>
                            <Text className="text-lg text-slate-900">Kalorie: {totalCalories} kcal</Text>
                            <Text className="text-lg text-slate-900">Bílkoviny: {totalProteins} g</Text>
                            <Text className="text-lg text-slate-900">Sacharidy: {totalCarbs} g</Text>
                            <Text className="text-lg text-slate-900">Tuky: {totalFats} g</Text>
                            <Text className="text-lg text-slate-900">Vláknina: {totalFiber} g</Text>
                        </View>
                        <View className="items-center mt-5">
                            <Text className="text-base text-slate-900">Pro nejlepší výsledky a zdraví doporučujeme, aby se <Text className="text-orange-500">oranžová linka</Text> dlouhodobě pohybovala mezi <Text className="text-red-500">červenou</Text> a <Text className="text-blue-500">modrou</Text> a ideálně se co nejvíce držela <Text className="text-teal-600">zelené</Text>. Příjem kalorií můžete změnit v nastavení profilu.</Text>
                        </View>
                        <View className="items-center mt-5 mb-10">
                            <Text className="text-lg text-slate-900"><Text className="text-teal-600">•</Text>Doporučený denní příjem kalorií: {userMacros.calories} kcal</Text>
                            <Text className="text-lg text-slate-900"><Text className="text-red-500">•</Text>Minimální denní příjem kalorií: {userMacros.calories - 300} kcal</Text>
                            <Text className="text-lg text-slate-900"><Text className="text-blue-500">•</Text>Maximální denní příjem kalorií: {userMacros.calories + 300} kcal</Text>
                            <Text className="text-lg text-slate-900"><Text className="text-orange-500">•</Text>Váš příjem pro daný den</Text>
                        </View>
                    </>
                }
            </View>
        </ScrollView>
    )
}
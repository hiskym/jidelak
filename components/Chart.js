import { View } from 'react-native'
import { useFont } from '@shopify/react-native-skia'
import { CartesianChart, Line } from 'victory-native'
import nunito from '../assets/fonts/Nunito-Regular.ttf'

export default function Chart({ data }) {

    const font = useFont(nunito, 12);

    return (
        <>
            <View style={{ height: 300, padding: 20 }}>
                <CartesianChart
                    data={data}
                    xKey="day"
                    yKeys={["kcal", "kcalMin", "kcalMax", "dailyIntake"]}
                    axisOptions={{ font, tickCount: 4, labelOffset: 10 }}
                >
                    {({ points }) => (
                        <>
                            <Line points={points.kcal} color="#0D9488" strokeWidth={3} />
                            <Line points={points.kcalMin} color="#EF4444" strokeWidth={3} />
                            <Line points={points.kcalMax} color="#3B82F6" strokeWidth={3} />
                            <Line points={points.dailyIntake} color="#F97316" strokeWidth={3} curveType='natural' />
                        </>
                    )}
                </CartesianChart>
            </View>
        </>
    );
}
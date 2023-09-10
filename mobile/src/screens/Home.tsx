import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Open up 'src/screens/Home.tsx' to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

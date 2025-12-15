import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#16213e',
                    borderTopColor: '#1bb5fc',
                    display: 'none',
                },
                tabBarActiveTintColor: '#1bb5fc',
                tabBarInactiveTintColor: '#858889',
            }}
        >
            <Tabs.Screen
                name="menu/index"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="game/index"
                options={{
                    title: 'Jeu',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="game-controller" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="options/index"
                options={{
                    title: 'Options',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="help/index"
                options={{
                    title: 'Aide',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="help-circle" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="grid" size={80} color="#1bb5fc" style={styles.logo} />
                <Text style={styles.title}>DÉMINEUR</Text>
                <Text style={styles.subtitle}>Le jeu classique de stratégie</Text>
            </View>

            <View style={styles.menuButtons}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => router.push('/game')}
                >
                    <Ionicons name="play-circle" size={24} color="white" />
                    <Text style={styles.menuButtonText}>Nouveau jeu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => router.push('/game')}
                >
                    <Ionicons name="play" size={24} color="white" />
                    <Text style={styles.menuButtonText}>Continuer le jeu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => router.push('/options')}
                >
                    <Ionicons name="settings" size={24} color="white" />
                    <Text style={styles.menuButtonText}>Options</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => router.push('/help')}
                >
                    <Ionicons name="help-circle" size={24} color="white" />
                    <Text style={styles.menuButtonText}>Aide</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>© {new Date().getFullYear()} Mineswipper - RaJharit77</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    logo: {
        marginBottom: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1bb5fc',
        marginBottom: 10,
        textShadowColor: 'rgba(27, 181, 252, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#858889',
        textAlign: 'center',
    },
    menuButtons: {
        width: '100%',
        maxWidth: 400,
    },
    menuButton: {
        backgroundColor: '#16213e',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#1bb5fc',
    },
    menuButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 15,
        flex: 1,
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        color: '#858889',
        fontSize: 14,
        marginBottom: 5,
    },
});
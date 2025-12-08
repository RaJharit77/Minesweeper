import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#1bb5fc" />
                <Text style={styles.backText}>Retour</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>📖 Aide - Règles du Démineur</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎯 Objectif du jeu</Text>
                    <Text style={styles.text}>
                        Le but du jeu est de découvrir toutes les cases qui ne contiennent pas de mines,
                        sans faire exploser aucune bombe.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧩 Comment jouer</Text>
                    <View style={styles.ruleItem}>
                        <Ionicons name="square-outline" size={20} color="#1bb5fc" />
                        <Text style={styles.ruleText}>
                            Cliquez sur une case pour la révéler.
                        </Text>
                    </View>
                    <View style={styles.ruleItem}>
                        <Text style={styles.number}>1️⃣</Text>
                        <Text style={styles.ruleText}>
                            Les nombres indiquent combien de bombes se trouvent dans les cases adjacentes.
                        </Text>
                    </View>
                    <View style={styles.ruleItem}>
                        <Ionicons name="alert-circle" size={20} color="#FF3B3B" />
                        <Text style={styles.ruleText}>
                            Si vous cliquez sur une bombe, la partie est perdue.
                        </Text>
                    </View>
                    <View style={styles.ruleItem}>
                        <Ionicons name="flag" size={20} color="#00B300" />
                        <Text style={styles.ruleText}>
                            Pour marquer une case suspectée d'être une bombe, maintenez appuyé.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎮 Niveaux de difficulté</Text>
                    <View style={styles.levelItem}>
                        <Text style={styles.levelTitle}>Facile</Text>
                        <Text style={styles.levelDesc}>10×10 cases, 20 bombes</Text>
                    </View>
                    <View style={styles.levelItem}>
                        <Text style={styles.levelTitle}>Medium</Text>
                        <Text style={styles.levelDesc}>20×20 cases, 40 bombes</Text>
                    </View>
                    <View style={styles.levelItem}>
                        <Text style={styles.levelTitle}>Difficile</Text>
                        <Text style={styles.levelDesc}>30×30 cases, 60 bombes</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💡 Conseils</Text>
                    <Text style={styles.text}>
                        1. Commencez par cliquer au hasard, mais évitez les coins au début.{'\n'}
                        2. Si une case affiche "1" et qu'une seule case adjacente n'est pas découverte,
                        c'est probablement une bombe.{'\n'}
                        3. Les cases vides (sans nombre) révèlent automatiquement les cases adjacentes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎵 Options disponibles</Text>
                    <Text style={styles.text}>
                        • Contrôle du volume de la musique{'\n'}
                        • Activation/désactivation des vibrations{'\n'}
                        • Sélection du niveau de difficulté{'\n'}
                        • Sauvegarde des paramètres
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        paddingTop: 50,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingLeft: 20,
    },
    backText: {
        color: '#1bb5fc',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1bb5fc',
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#16213e',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1bb5fc',
        marginBottom: 15,
    },
    text: {
        color: '#e6e6e6',
        fontSize: 16,
        lineHeight: 24,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ruleText: {
        color: '#e6e6e6',
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
    },
    number: {
        fontSize: 20,
        marginRight: 10,
    },
    levelItem: {
        backgroundColor: '#0f3460',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    levelTitle: {
        color: '#1bb5fc',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    levelDesc: {
        color: '#858889',
        fontSize: 14,
    },
});
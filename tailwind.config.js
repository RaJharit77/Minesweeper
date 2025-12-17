/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./screens/**/*.{js,jsx,ts,tsx}",
        "./hooks/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#1bb5fc',
                secondary: '#16213e',
                dark: '#1a1a2e',
                gray: {
                    400: '#858889',
                    800: '#16213e',
                    900: '#1a1a2e',
                },
                blue: {
                    400: '#1bb5fc',
                    500: '#0ea5e9',
                },
                red: {
                    400: '#FF3B3B',
                    500: '#ef4444',
                },
                green: {
                    400: '#00B300',
                    500: '#10b981',
                },
                purple: {
                    900: '#581c87',
                }
            },
        },
    },
    plugins: [],
}
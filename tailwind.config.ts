import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
			},
			fontSize: {
				'body': ['16px', '1.6'],
			},
			fontWeight: {
				'title': '600',
			},
			letterSpacing: {
				'title': '-0.025em',
			},
			maxWidth: {
				'container': '900px',
				'container-sm': '740px',
			},
			screens: {
				'xs': '475px',
				'3xl': '1600px'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem'
			},
			colors: {
				border: '#E6E6E6',
				input: '#F5F5F5',
				ring: '#E6E6E6',
				background: '#FFFFFF',
				foreground: '#1A1A1A',
				primary: {
					DEFAULT: '#2563EB',
					foreground: '#FFFFFF',
					hover: '#1D4ED8'
				},
				secondary: {
					DEFAULT: '#F8FAFC',
					foreground: '#475569'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#FFFFFF'
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F1F5F9',
					foreground: '#64748B'
				},
				accent: {
					DEFAULT: '#F8FAFC',
					foreground: '#475569'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1A1A1A'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1A1A1A'
				},
				sidebar: {
					DEFAULT: '#F8FAFC',
					foreground: '#475569',
					primary: '#2563EB',
					'primary-foreground': '#FFFFFF',
					accent: '#F1F5F9',
					'accent-foreground': '#64748B',
					border: '#E6E6E6',
					ring: '#E6E6E6'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			},
			keyframes: {
				...{
					'accordion-down': {
						from: {
							height: '0'
						},
						to: {
							height: 'var(--radix-accordion-content-height)'
						}
					},
					'accordion-up': {
						from: {
							height: 'var(--radix-accordion-content-height)'
						},
						to: {
							height: '0'
						}
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100%)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

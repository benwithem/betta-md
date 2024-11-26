import '@mantine/core/styles.css';
import './globals.css';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  defaultRadius: 'sm',
  colors: {
    blue: [
      '#E3F2FD', // 0: Lightest - good for backgrounds
      '#BBDEFB', // 1
      '#90CAF9', // 2
      '#64B5F6', // 3
      '#42A5F5', // 4
      '#2196F3', // 5: Primary
      '#1E88E5', // 6
      '#1976D2', // 7
      '#1565C0', // 8
      '#0D47A1'  // 9: Darkest - good for text
    ]
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
      }
    },
    Text: {
      defaultProps: {
        size: 'sm',
      }
    }
  }
});

export const metadata = {
  title: 'Betta-MD',
  description: 'Aquarium Management System',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className="antialiased">
        <MantineProvider 
          theme={theme}
          defaultColorScheme="light"
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

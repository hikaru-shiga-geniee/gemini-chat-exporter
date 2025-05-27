import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, Typography, Paper, Divider } from '@mui/material'
import { SmartToy } from '@mui/icons-material'
import { theme } from './theme'
import { ExportButton } from './components/ExportButton'

function App() {
  const handleExportClick = () => {
    // TODO: フェーズ4で実装 - Content Scriptとの通信
    console.log('Export button clicked')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper elevation={0} sx={{ width: 320, minHeight: 200 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SmartToy sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontSize: '1.3rem', fontWeight: 600 }}
            >
              Gemini Chat Exporter
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Export your current Gemini chat conversation to a text file
          </Typography>

          <ExportButton onClick={handleExportClick} />
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export default App

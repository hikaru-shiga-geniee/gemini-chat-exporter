/// <reference types="chrome" />

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, Typography, Paper, Divider } from '@mui/material'
import { SmartToy } from '@mui/icons-material'
import { theme } from './theme'
import { ExportButton } from './components/ExportButton'
import { useState } from 'react'
import type { GetChatDataMessage, ChatDataResponse } from '../types/messages'
import { formatAsText, generateFileName } from '../utils/textFormatter'
import { downloadTextFile } from '../utils/fileSaver'

function App() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportClick = async () => {
    console.log('🖱️ Export button clicked')
    setIsExporting(true)

    try {
      // Get the current active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      const activeTab = tabs[0]

      console.log('🔍 Active tab info:', activeTab)
      console.log('🔍 All tabs found:', tabs)

      if (!activeTab || !activeTab.id) {
        console.error('❌ No active tab found')
        alert('No active tab found. Please make sure you have a Gemini page open.')
        return
      }

      console.log('🔍 Active tab URL:', activeTab.url)
      console.log('🔍 Active tab hostname check:', activeTab.url?.includes('gemini.google.com'))

      // Try to check if we're on a Gemini page via URL first
      const isGeminiPageByUrl = activeTab.url?.includes('gemini.google.com')
      
      if (!isGeminiPageByUrl) {
        // If URL check fails, try to communicate with content script anyway
        // This is a fallback for cases where URL might not be accessible
        console.log('⚠️ URL check failed, but trying to communicate with content script anyway...')
      }

      console.log('📤 Sending getChatData message to content script')
      
      // Send message to content script
      const message: GetChatDataMessage = { type: 'getChatData' }
      
      try {
        const response = await chrome.tabs.sendMessage(activeTab.id, message) as ChatDataResponse
        
        console.log('📥 Received response from content script:', response)

        if (response.success) {
          console.log('✅ Successfully received chat data:', response.data)
          console.log(`📊 Message count: ${response.messageCount}`)
          
          // Phase 5: Process the data and download as text file
          try {
            console.log('📝 Formatting chat data as text...')
            const formattedText = formatAsText(response.data)
            
            console.log('💾 Generating file name...')
            const fileName = generateFileName('gemini-chat')
            
            console.log(`💾 Downloading file: ${fileName}`)
            downloadTextFile(formattedText, fileName)
            
            console.log(`✅ Successfully exported ${response.messageCount} messages to ${fileName}`)
          } catch (exportError) {
            console.error('❌ Error during export process:', exportError)
            alert(`Error during export: ${exportError instanceof Error ? exportError.message : 'Unknown error'}`)
          }
        } else {
          console.error('❌ Content script returned error:', response.error)
          alert(`Error: ${response.error}`)
        }
      } catch (contentScriptError) {
        console.error('❌ Content script communication failed:', contentScriptError)
        
        // If content script communication fails and URL check also failed, show URL error
        if (!isGeminiPageByUrl) {
          alert(`Please navigate to a Gemini chat page (gemini.google.com) before exporting.\nCurrent URL: ${activeTab.url || 'undefined'}`)
        } else {
          alert('Error communicating with the page. Please refresh the Gemini page and try again.')
        }
      }

    } catch (error) {
      console.error('❌ Error in handleExportClick:', error)
      alert('Unexpected error occurred. Please check the console for details.')
    } finally {
      setIsExporting(false)
    }
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

          <ExportButton onClick={handleExportClick} disabled={isExporting} />
        </Box>
      </Paper>
    </ThemeProvider>
  )
}

export default App

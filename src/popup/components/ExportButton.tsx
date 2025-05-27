import { Button, Box } from '@mui/material'
import { Download } from '@mui/icons-material'

interface ExportButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function ExportButton({ onClick, disabled = false }: ExportButtonProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        fullWidth
        startIcon={<Download />}
        onClick={onClick}
        disabled={disabled}
        sx={{
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        Export Chat
      </Button>
    </Box>
  )
}

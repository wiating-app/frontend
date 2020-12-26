import React from 'react'
import useErrorBoundary from 'use-error-boundary'
import { Typography } from '@material-ui/core'

const ErrorHandler = ({ children }) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
  return didCatch
    ? <Typography color='error'>{error.message}</Typography>
    : <ErrorBoundary>{children}</ErrorBoundary>
}

export default ErrorHandler

import React from 'react'
import useErrorBoundary from 'use-error-boundary'
import Typography from '../components/Typography'

interface ErrorHandlerProps {
  children: React.ReactNode
}

const ErrorHandler = ({ children }: ErrorHandlerProps) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
  return didCatch
    ? <Typography color='error'>{error?.message}</Typography>
    : <ErrorBoundary>{children}</ErrorBoundary>
}

export default ErrorHandler

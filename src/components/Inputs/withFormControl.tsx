import React from 'react'
import FormControl from './FormControl'
import { useControlLogic } from 'react-form-component'

interface ControlLogicProps {
  name: string
  [key: string]: any
}

interface InputProps {
  name: string
  [key: string]: any
}

function withFormControl<T>(InputComponent: React.ComponentType<T | InputProps>) {
  // eslint-disable-next-line react/display-name
  return (props: ControlLogicProps) => {
    const { formControlProps, inputProps } = useControlLogic(InputComponent, props)

    return (
      <FormControl {...formControlProps}>
        <InputComponent {...inputProps} />
      </FormControl>
    )
  }
}

export default withFormControl

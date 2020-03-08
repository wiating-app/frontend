import React from 'react'
import PropTypes from 'prop-types'
import {
  Select as MUISelect,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core'
import { withFormControl } from 'react-standalone-form-mui'


// TODO: Move this updated component to react-standalone-form-mui library.
const Select = ({
  name,
  value,
  required,
  options = [],
  setValue,
}) =>
  <MUISelect
    value={value || ''}
    onChange={e => setValue(name, e.target.value, required)}
    inputProps={{
      name,
      id: name,
    }}
  >
    {!required &&
      <MenuItem value=''><em>None</em></MenuItem>
    }
    {options.map((item, index) =>
      typeof item === 'string'
        ? <MenuItem key={index} value={item}>{item}</MenuItem>
        : <MenuItem key={index} value={item.value}>
          {item.icon
            ? <>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Typography variant='inherit'>{item.label}</Typography>
            </>
            : item.label
          }
        </MenuItem>
    )}
  </MUISelect>

Select.propTypes = {
  name: PropTypes.any.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ label: PropTypes.node, value: PropTypes.any }),
  ])),
}

export default withFormControl(Select)

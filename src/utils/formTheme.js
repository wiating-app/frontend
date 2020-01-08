import parse from 'coord-parser'

export default {
  customValidationFunction: (value, type) => {
    // Custom validation rules should return false or string with error message.
    switch (type) {
      case 'coordinates':
        // Rule for coordinates input:
        try {
          parse(value)
          return false
        } catch (err) {
          return 'Niepoprawny format współrzędnych.'
        }

      default:
        return false
    }
  },
}

export default () => {
  const code = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage
  return code.includes('pl') ? 'pl' : 'en'
}

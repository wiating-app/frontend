export default (): string => {
  const code = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    (navigator as any).userLanguage
  return code.includes('pl') ? 'pl' : 'en'
}

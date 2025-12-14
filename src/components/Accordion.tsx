import React from 'react'
import classNames from 'classnames'
import { ChevronDown } from 'lucide-react'

const AccordionContext = React.createContext<[string | false | undefined, (value: string | false) => void]>([
  undefined,
  () => {},
])

interface AccordionProps {
  children: React.ReactNode
}

const Accordion = ({ children }: AccordionProps) => {
  const [expanded, setExpanded] = React.useState<string | false>()

  return (
    <AccordionContext.Provider value={[expanded, setExpanded]}>
      <div>{children}</div>
    </AccordionContext.Provider>
  )
}

export default Accordion

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  initiallyExpanded?: boolean
}

export const AccordionItem = ({ title, children, initiallyExpanded }: AccordionItemProps) => {
  const [expanded, setExpanded] = React.useContext(AccordionContext)
  const index = title.replace(/\s+/g, '-') // Use title as a unique identifier

  React.useEffect(() => {
    if (initiallyExpanded) {
      setExpanded(index)
    }
  }, [initiallyExpanded, index, setExpanded])

  const isExpanded = expanded === index

  const handleClick = () => {
    setExpanded(isExpanded ? false : index)
  }

  return (
    <div className={classNames('-mb-px rounded-sm border border-gray-200', isExpanded && 'last:mb-8')}>
      <button
        type="button"
        onClick={handleClick}
        className="flex min-h-[56px] w-full cursor-pointer items-center justify-between rounded-sm border-b border-l-0 border-r-0 border-t-0 border-gray-300 bg-gray-100 px-4 py-3 text-left outline-none transition-colors hover:bg-gray-200 focus:outline-none"
        aria-controls={`${index}-content`}
        id={`${index}-header`}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown
          size={24}
          className={classNames('text-gray-600 transition-transform duration-200', isExpanded && 'rotate-180')}
        />
      </button>
      <div
        id={`${index}-content`}
        role="region"
        aria-labelledby={`${index}-header`}
        className={classNames(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="block p-4">{children}</div>
      </div>
    </div>
  )
}

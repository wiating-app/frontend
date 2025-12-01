import React from 'react'
import { ExpandMore } from '@material-ui/icons'
import classNames from 'classnames'

const AccordionContext = React.createContext<[string | false | undefined, (value: string | false) => void]>([undefined, () => {}])


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
    <div
      className={classNames(
        'border border-gray-200 -mb-px rounded-sm',
        isExpanded && 'last:mb-8'
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 min-h-[56px] px-4 py-3 cursor-pointer transition-colors text-left outline-none focus:outline-none border-b border-t-0 border-l-0 border-r-0 border-gray-300 rounded-sm"
        aria-controls={`${index}-content`}
        id={`${index}-header`}
        aria-expanded={isExpanded}
      >
        <span className="font-medium text-sm">{title}</span>
        <ExpandMore
          className={classNames(
            'transition-transform duration-200 text-gray-600',
            isExpanded && 'rotate-180'
          )}
        />
      </button>
      <div
        id={`${index}-content`}
        role="region"
        aria-labelledby={`${index}-header`}
        className={classNames(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 block">
          {children}
        </div>
      </div>
    </div>
  )
}

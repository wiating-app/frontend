import React from 'react'
import classNames from 'classnames'

interface TableLabel {
  name: React.ReactNode
  field: string
  wide?: boolean
}

interface TableProps {
  labels: TableLabel[]
  data: Array<{ [key: string]: React.ReactNode }>
}

const Table = ({ labels, data }: TableProps) => {
  return (
    <table className="w-full border-collapse">
      <thead className="hidden sm:table-header-group">
        <tr className="border-b border-solid border-gray-300 border-t-0 border-l-0 border-r-0">
          {labels.map((label, index) => (
            <th key={index} className="px-4 py-2 text-left leading-tight">
              {label.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block sm:table-row-group">
        {data.map((row, index) =>
          <tr
            key={index}
            className="flex flex-wrap border-b border-solid border-gray-300 border-t-0 border-l-0 border-r-0 py-3 sm:table-row sm:py-0"
          >
            {labels.map((label, index) => (
              <td
                key={index}
                className={classNames(
                  'block px-0 py-1 leading-tight sm:table-cell sm:px-4 sm:py-2',
                  label.wide && 'min-w-full sm:min-w-0'
                )}
              >
                {row[label.field]}
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default Table

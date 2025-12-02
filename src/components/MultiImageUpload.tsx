import React from 'react'
import Typography from './Typography'
import IconButton from './IconButton'
import { CloudUpload, Trash2 } from 'lucide-react'
import withFormControl from './Inputs/withFormControl'


interface ImageFile {
  fileName: string
  type: string
  data: string
  dataFile: File
}

interface MultiImageUploadProps {
  name: string
  value?: ImageFile[]
  mandatory?: boolean
  setValue: (name: string, value: ImageFile[], mandatory?: boolean) => void
  spacing?: number
  columns?: number
  uploadLabel?: string
}

const MultiImageUpload = ({
  name,
  value,
  mandatory,
  setValue,
  spacing = 2,
  columns = 2,
  uploadLabel = 'Upload',
}: MultiImageUploadProps) => {
  return (
    <div className={`grid grid-cols-${columns} gap-${spacing}`}>
      {value &&
        value.map((item, index) =>
          <div
            className="flex items-center justify-center bg-gray-100 h-40 p-4 relative rounded"
            key={index}
          >
            <img
              src={item.data || item as any}
              className="max-w-full max-h-full rounded-sm"
              alt={`Uploaded file ${index}`}
            />
            <IconButton
              size="small"
              className="absolute top-1 right-1"
              onClick={() => setValue(
                name,
                value.filter((subItem, subIndex) => subIndex !== index),
                mandatory
              )}
            >
              <Trash2 size={20} />
            </IconButton>
          </div>
        )
      }
      <div>
        <input
          accept='image/*'
          className="hidden"
          id={name}
          multiple
          type='file'
          onChange={e => {
            let oldValue = value || []
            Object.values(e.target.files || {}).forEach(async (file: File) => {
              const fileReader = new FileReader()
              const { name: fileName, type: fileType } = file
              const dataFile = file
              await fileReader.readAsDataURL(file)
              fileReader.onload = () => {
                const data = fileReader.result as string
                const newItem: ImageFile = {
                  fileName,
                  type: fileType.split('/')[0],
                  data,
                  dataFile,
                }
                setValue(
                  name,
                  [...oldValue, newItem],
                  mandatory
                )
                oldValue = [...oldValue, newItem]
              }
            })
          }}
        />
        <label
          htmlFor={name}
          className="flex flex-col cursor-pointer items-center justify-center bg-gray-100 h-40 p-4 text-gray-500 hover:bg-gray-200"
        >
          <CloudUpload size={24} />
          <Typography variant='caption' color='inherit'>{uploadLabel}</Typography>
        </label>
      </div>
    </div>
  )
}

export default withFormControl(MultiImageUpload)

import React from 'react'
import { CloudUpload, Trash2 } from 'lucide-react'
import IconButton from './IconButton'
import withFormControl from './Inputs/withFormControl'
import Typography from './Typography'

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
        value.map((item, index) => (
          <div className="relative flex h-40 items-center justify-center rounded bg-gray-100 p-4" key={index}>
            <img
              src={item.data || (item as any)}
              className="max-h-full max-w-full rounded-sm"
              alt={`Uploaded file ${index}`}
            />
            <IconButton
              size="small"
              className="absolute right-1 top-1"
              onClick={() =>
                setValue(
                  name,
                  value.filter((subItem, subIndex) => subIndex !== index),
                  mandatory,
                )
              }
            >
              <Trash2 size={20} />
            </IconButton>
          </div>
        ))}
      <div>
        <input
          accept="image/*"
          className="hidden"
          id={name}
          multiple
          type="file"
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
                setValue(name, [...oldValue, newItem], mandatory)
                oldValue = [...oldValue, newItem]
              }
            })
          }}
        />
        <label
          htmlFor={name}
          className="flex h-40 cursor-pointer flex-col items-center justify-center bg-gray-100 p-4 text-gray-500 hover:bg-gray-200"
        >
          <CloudUpload size={24} />
          <Typography variant="caption" color="inherit">
            {uploadLabel}
          </Typography>
        </label>
      </div>
    </div>
  )
}

export default withFormControl(MultiImageUpload)

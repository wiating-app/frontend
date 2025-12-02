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
  smHeight?: string
  mdHeight?: string
}

const MultiImageUpload = ({
  name,
  value,
  mandatory,
  setValue,
  spacing = 2,
  columns = 2,
  uploadLabel = 'Upload',
  smHeight = '20vw',
  mdHeight = '12vw',
}: MultiImageUploadProps) => {
  const gapClass = spacing === 1 ? 'gap-2' : spacing === 2 ? 'gap-4' : 'gap-6'
  const colWidth = columns === 2 ? 'sm:w-6/12' : 'sm:w-full'

  return (
    <div className={`flex flex-wrap ${gapClass}`}>
      {value &&
        value.map((item, index) =>
          <div className={`${colWidth}`} key={index}>
            <div
              className="flex items-center justify-center bg-gray-100 p-4 relative"
              style={{
                height: '33vw',
                maxHeight: mdHeight,
              }}
            >
              <img
                src={item.data || item as any}
                className="max-w-full max-h-full"
                alt={`Uploaded file ${index}`}
              />
              <IconButton
                size="small"
                className="absolute top-0 right-0"
                onClick={() => setValue(
                  name,
                  value.filter((subItem, subIndex) => subIndex !== index),
                  mandatory
                )}
              >
                <Trash2 size={20} />
              </IconButton>
            </div>
          </div>
        )
      }
      <div className={colWidth}>
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
          className="flex flex-col cursor-pointer items-center justify-center bg-gray-100 p-4 text-gray-500 hover:bg-gray-200"
          style={{
            height: '33vw',
            maxHeight: mdHeight,
          }}
        >
          <CloudUpload size={24} />
          <Typography variant='caption' color='inherit'>{uploadLabel}</Typography>
        </label>
      </div>
    </div>
  )
}

export default withFormControl(MultiImageUpload)

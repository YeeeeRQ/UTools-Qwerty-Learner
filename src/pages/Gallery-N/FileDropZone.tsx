import type { DragEvent, FC } from 'react'
import { useState } from 'react'

interface Props {
  onFilesSelected: (files: File[]) => void
}

const FileDropZone: FC<Props> = ({ onFilesSelected, children }) => {
  const [isDragging, setIsDragging] = useState(false)

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)

    const files = Array.from(event.dataTransfer?.files || [])
    onFilesSelected(files)
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed border-gray-400 p-4 ${isDragging ? 'bg-gray-100' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}

export default FileDropZone

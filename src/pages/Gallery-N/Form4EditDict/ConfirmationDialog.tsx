import { Dialog, Transition } from '@headlessui/react'
import type { FC, ReactNode } from 'react'
import { Fragment, useState } from 'react'

interface Props {
  isOpen: boolean
  onDelete: () => void
  onCancel: () => void
  children: ReactNode
}

const DeleteConfirmationDialog: FC<Props> = ({ isOpen, onDelete, onCancel, children }) => {
  function handleDialogClick(event: React.MouseEvent<HTMLDivElement>) {
    // 阻止事件冒泡
    event.stopPropagation()
  }
  function handleDelete() {
    onDelete()
  }

  return (
    <Transition show={isOpen}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onCancel} onClick={handleDialogClick}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg leading-6 text-gray-900">
                确认删除
              </Dialog.Title>
              <div className="mt-2">{children}</div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white  hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:text-gray-200"
                  onClick={handleDelete}
                >
                  删除
                </button>
                <button
                  type="button"
                  className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={onCancel}
                >
                  取消
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DeleteConfirmationDialog

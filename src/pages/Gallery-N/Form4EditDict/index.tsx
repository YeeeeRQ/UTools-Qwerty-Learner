import { languageType } from '../constants'
import { InnerContext } from '../index'
import ConfirmDialog from './ConfirmationDialog'
import { Dialog, Transition } from '@headlessui/react'
import mixpanel from 'mixpanel-browser'
import { Fragment, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import IconDelete from '~icons/mdi/delete'
import IconX from '~icons/tabler/x'
import EditIcon from '~icons/uil/edit-alt'

type Form4EditDictProps = {
  dictId: string
}

// eslint-disable-next-line react/prop-types
const Form4EditDict: React.FC<Form4EditDictProps> = ({ dictId }) => {
  const [formData, setFormData] = useState({ name: '', language: '' })

  const [dictsList, setDictsList] = useState([])
  const [dictIndex, setDictIndex] = useState(0)

  const handleRefresh = useContext(InnerContext)

  const [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    event.stopPropagation()
    setIsOpen(false)
    setFormData({ name: '', language: '', description: '' })
  }
  async function openModal(event) {
    event.stopPropagation()
    const config = await window.readLocalDictConfig()
    setDictsList([...config])
    for (let i = 0; i < config.length; i++) {
      if (config[i].id === dictId) {
        setDictIndex(i)
        setFormData({ ...config[i] })
        break
      }
    }
    setIsOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (formData.name.trim().length <= 0) {
      toast.info('词典名称不能为空')
      return false
    }
    if (formData.name.trim().length >= 10) {
      toast.info('词典名称过长(应少于10个字)')
      return false
    }
    if (formData.description.trim().length >= 10) {
      toast.info('词典描述过长(应少于10个字)')
      return false
    }

    const newDictInfo = Object.assign({}, dictsList[dictIndex], {
      ...formData,
    })
    dictsList[dictIndex] = newDictInfo
    await window.writeLocalDictConfig(dictsList)
    window.initLocalDictionries()
    handleRefresh()

    setIsOpen(false)
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const [confirmIsOpen, setConfirmIsOpen] = useState(false)
  async function handleDelClick() {
    event.preventDefault()

    const result = await window.delLocalDict(dictId)
    if (result) {
      toast.success('删除成功')
      mixpanel.track('Delete Dict', { status: 'Success' })
    } else {
      toast.error('删除失败')
      mixpanel.track('Delete Dict', { status: 'Failed' })
    }
    window.initLocalDictionries()
    handleRefresh()
    setIsOpen(false)
  }

  return (
    <>
      <button className={`my-3 mr-3 text-gray-300 hover:text-gray-500 hover:dark:text-blue-400`} onClick={openModal} title="修改词典信息">
        <EditIcon />
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-200  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                  <button type="button" onClick={() => setIsOpen(false)} title="关闭对话框">
                    <IconX className="absolute right-7 top-5 cursor-pointer text-gray-400" />
                  </button>
                  <Dialog.Title as="h2" className="mb-8 text-center text-xl font-medium leading-6 text-gray-800 dark:text-gray-200">
                    修改词典
                  </Dialog.Title>
                  {/* <p>{dictId}</p> */}
                  <form onSubmit={handleSubmit} className="p-2">
                    <div className="mb-8 grid grid-cols-[1fr_5fr]">
                      <label htmlFor="name" className="mb-4 block font-bold text-gray-600 dark:text-gray-200">
                        词典名称:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-400 p-2"
                      />
                    </div>
                    <div className="mb-8 grid grid-cols-[1fr_5fr]">
                      <label htmlFor="description" className="mb-4 block font-bold text-gray-600 dark:text-gray-200">
                        词典描述:
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-400 p-2"
                      />
                    </div>
                    <div className="mb-8 grid grid-cols-[1fr_5fr]">
                      <label className="mb-4 block font-bold text-gray-600 dark:text-gray-200">类型:</label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-400 p-2"
                      >
                        {languageType.map((item) => (
                          <option value={item.type} key={item.type}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-16 flex justify-end">
                      <button
                        className="text-bold mx-4 h-15 w-[10%] rounded-lg bg-red-400 font-bold text-white hover:bg-red-600 dark:text-gray-200"
                        onClick={() => {
                          setConfirmIsOpen(true)
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <IconDelete className="h-6 w-6" />
                          删除
                        </div>
                      </button>
                      <button
                        className="text-bold h-15 w-1/4 rounded-lg bg-indigo-400 font-bold text-white dark:text-gray-200"
                        type="submit"
                      >
                        确定
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ConfirmDialog
        isOpen={confirmIsOpen}
        onCancel={() => {
          setConfirmIsOpen(false)
        }}
        onDelete={() => {
          handleDelClick()
        }}
      />
    </>
  )
}

export default Form4EditDict

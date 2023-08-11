import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

function UpdateDialog() {
  const [open, setOpen] = useState(() => {
    const seen = localStorage.getItem('seenUpdate')
    return !seen
  })

  function closeDialog() {
    setOpen(false)
  }

  function hideForver() {
    closeDialog()
    localStorage.setItem('seenUpdate', true)
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeDialog}>
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
              <Dialog.Panel className="w-full max-w-[38rem] transform overflow-hidden rounded-2xl bg-white p-2 text-left align-middle shadow-xl transition-all">
                <div className=" mx-4 rounded-md bg-white p-6 ">
                  <h2 className="mb-8 text-xl font-bold">致用户的一封信</h2>

                  <p className="my-4 indent-8 leading-6">
                    尊敬的用户们， 感谢大家一直以来对我们插件的支持和厚爱。为了让插件能够持续性地更新和维护，我们不得不做出一些改变。
                  </p>
                  <p className="my-4 indent-8 leading-6">
                    我们深知很多用户对于插件的免费使用非常依赖，但是为了保证插件的更新和稳定，我们不得不尝试部分功能收费
                    <strong className="text-indigo-400">（摸鱼功能，错题本，自定义词库..）</strong>
                    这些收费功能将会是我们插件的独特优势，可以为用户带来更好的使用体验和更高的效率。同时，我们也会保证免费的功能仍然可以满足大多数用户的需求。
                  </p>
                  <p className="my-4 indent-8 leading-6">
                    我们知道这对于一些用户来说是一个不便和挑战，但是希望大家能够理解我们的决定。我们会根据用户的反馈和需求，不断优化和改进插件，让它变得更加完美。
                  </p>
                  <p className="my-4 indent-8 leading-6">
                    最后，我们再次感谢大家的支持和信任。如果您有任何疑问或建议，请随时联系我们。 谢谢！
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="">
                      ✨
                      <Link
                        to={{ pathname: '/gallery', search: '?redirect=subscribe' }}
                        className="border-b-2 border-dashed border-red-300 font-semibold text-indigo-400"
                      >
                        点击开通会员
                      </Link>
                      ✨
                    </div>
                    <button
                      type="button"
                      className="mr-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={hideForver}
                    >
                      我已知晓,不再展示
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default UpdateDialog

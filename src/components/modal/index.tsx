import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ImCross } from "react-icons/im";
import { useAuth } from "../../firebase/firebase.auth";
import { addReceipt, Receipt, SentReceiptType, updateReceipts } from "../../firebase/firebase.firestore";
import { replaceImage, uploadImage } from "../../firebase/firebase.storage";

type ReceiptType = {
  date: Date,
  locationName: string,
  locationAddress: string,
  items: string,
  amount: string
}

const ExpenseModal = ({ isOpen, closeModal, modalType, receiptData }: { isOpen: boolean, closeModal: () => void, modalType: string, receiptData?: SentReceiptType }) => {
  const { register, handleSubmit, formState: { isValid, isSubmitting } } = useForm<ReceiptType>({ mode: "onChange" });
  const [fileName, setFilename] = useState("");
  const [file, setFile] = useState(null);
  const { authUser } = useAuth();
  const [edit, setEdit] = useState(false);

  const onSubmit: SubmitHandler<ReceiptType> = async (data) => {
    try {
      if (file && modalType === "ADD") {
        const bucket = await uploadImage(file, authUser?.uid as string);
        addReceipt({
          uid: authUser?.uid as string,
          date: data.date.toString(),
          locationName: data.locationName,
          address: data.locationAddress,
          items: data.items,
          amount: data.amount,
          imageBucket: bucket
        });
      } else if (file && modalType === "EDIT") {
        await replaceImage(file, receiptData?.bucket);
        const receipt = {
          uid: authUser?.uid as string,
          date: data.date.toString(),
          locationName: data.locationName,
          address: data.locationAddress,
          items: data.items,
          amount: data.amount,
          imageBucket: receiptData?.bucket,
        }
        updateReceipts(receipt, receiptData?.id as string);
      } else {
        console.log("x", receiptData, data);
        const receipt = {
          uid: authUser?.uid as string,
          date: data.date.toString() || receiptData?.date,
          locationName: data.locationName,
          address: data.locationAddress,
          items: data.items,
          amount: data.amount,
          imageBucket: receiptData?.bucket,
        }
        updateReceipts(receipt, receiptData?.id as string);
      }
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
    }
  };

  const uploadFile = (target: any) => {
    const file = target.files[0];
    setFilename(file.name);
    setFile(file);
    if (edit) {
      setEdit(false);
    }
  };

  const clearFile = () => {
    setFilename("");
    setFile(null);
  };

  useEffect(() => {
    if (modalType === "EDIT" && receiptData) {
      setEdit(true);
    }
    return
  }, [])

  const closemodal = () => {
    clearFile();
    closeModal();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closemodal}>
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
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {modalType === "ADD" ? (
                  <Dialog.Title as="h3" className="text-lg font-Courier font-bold leading-6 text-gray-900">
                    ADD EXPENSE
                  </Dialog.Title>
                ) : (
                  <Dialog.Title as="h3" className="text-lg font-Courier font-bold leading-6 text-gray-900">
                    EDIT EXPENSE
                  </Dialog.Title>
                )}


                <div className="mt-3 flex justify-evenly">
                  {!edit ? (
                    <>
                      <div className="flex translate-x-[-19%]">
                        <label htmlFor="fileInput" className="cursor-pointer">
                          <div className="select-none cursor-pointer text-blue-600 outline-none ring-2 font-bold p-1">
                            UPLOAD RECIEPT
                            <input type="file" id="fileInput" onInput={(e: any) => uploadFile(e.target)}
                              className="hidden" />
                          </div>
                        </label>
                      </div>
                      <div>
                        <div className="h-[32px] w-[180px] p-1 items-center flex">
                          {fileName.length > 0 ? (
                            <div className="flex gap-x-5 w-[180px]">
                              {/* <div className="overflow-ellipsis"> */}
                              <p className="text-sm h-[32px] text-ellipsis overflow-hidden">{fileName.replaceAll("\n", " ")}</p>
                              {/* </div> */}
                              <ImCross className="text-xl cursor-pointer text-blue-700" onClick={() => clearFile()} />
                            </div>
                          ) : (
                            <span className="text-black translate-x-[-35%]">No file selected</span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="gap-x-10 flex ">
                      <div className="w-[100px] flex items-center">
                        <img src={receiptData?.imageUrl} alt="" />
                      </div>
                      <div className="flex flex-grow items-center">
                        <label htmlFor="fileInput" className="cursor-pointer">
                          <div className="select-none cursor-pointer text-blue-600 outline-none ring-2 font-bold p-1">
                            UPLOAD RECIEPT
                            <input type="file" id="fileInput" onInput={(e: any) => uploadFile(e.target)}
                              className="hidden" />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <input {...register("date")} defaultValue={receiptData?.date}
                    className="mt-4 flex flex-grow outline-none ring-1 ring-gray-500 p-2 min-w-full" type="date" />
                  <input {...register("locationName")} defaultValue={receiptData?.locationName}
                    className="mt-4 outline-none min-w-full border-b-2 border-gray-400 p-2" type="text"
                    placeholder="Location Name" />
                  <input {...register("locationAddress")} defaultValue={receiptData?.address}
                    className="mt-4 min-w-full outline-none border-b-2 border-gray-400 p-2" type="text"
                    placeholder="Location Address" />
                  <input {...register("items", { required: !edit })} defaultValue={receiptData?.items}
                    className="mt-4 min-w-full border-b-2 outline-none border-gray-400 p-2" type="text"
                    placeholder="Items" />
                  <input {...register("amount", { required: !edit })} defaultValue={receiptData?.amount}
                    className="mt-4 min-w-full border-b-2 outline-none border-gray-400 p-2" type="text"
                    placeholder="Amount" />
                  <div className="flex justify-end mt-4">
                    {isSubmitting ? (
                      <button className="p-1 outline-none rounded cursor-pointer px-2 font-semibold bg-gray-500 disabled">
                        Submitting...
                      </button>
                    ) : (
                      <input type="submit"
                        className={`p-1 outline-none rounded cursor-pointer px-2 font-semibold bg-blue-700 text-white disabled:bg-gray-500 disabled:text-gray-200`}
                        disabled={!isValid} />
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ExpenseModal;
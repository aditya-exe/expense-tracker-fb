import { DocumentData } from "firebase/firestore";
import { deleteReceipt, SentReceiptType } from "../../firebase/firebase.firestore";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useState } from "react";
import ExpenseModal from "../modal";

const Receipt = ({ data }: { data: SentReceiptType }) => {
  const [editOpen, setEditOpen] = useState(false);

  const closeModal = () => {
    setEditOpen(false);
  };

  const handleDelete = () => {
    deleteReceipt(data.id);
  }

  return (
    <div>
      <hr />
      <div className={"w-[1000px] gap-x-3 h-[100px] p-2 flex items-center"}>
        <img src={data.imageUrl} className={"w-[150px] max-h-[100px] p-2"} alt="" />
        <div className="flex flex-col w-[82px]">
          <span>{data.date.toString()}</span>
          <span className="font-bold">{data.amount}</span>
        </div>
        <div className="flex flex-grow flex-col text-lg">
          <span>{data.address}</span>
          <span>{data.items}</span>
        </div>
        <div className="flex">
          <FiEdit2 onClick={() => setEditOpen(true)} className="p-2 rounded-full hover:bg-blue-100 transition ease-in-out text-blue-600 text-[35px] cursor-pointer" />
          <MdOutlineDeleteOutline onClick={() => handleDelete()} className="p-2 text-blue-600 text-[40px] cursor-pointer rounded-full hover:bg-blue-100 transition ease-in-out" />
        </div>
        <div className="p-2">
          <ExpenseModal isOpen={editOpen} closeModal={closeModal} modalType={"EDIT"} receiptData={data} />
        </div>
      </div>
    </div>
  );
};

export default Receipt;
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TopNavigation from "../components/top-navigation";
import { useAuth } from "../firebase/firebase.auth";
import { BiPlus } from "react-icons/bi";
import { deleteImage } from "../firebase/firebase.storage";
import { deleteReceipt, getReceipts, SentReceiptType } from "../firebase/firebase.firestore";
import Receipt from "../components/receipt";
import ExpenseModal from "../components/modal";

const Dashboard = () => {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
  const [deleteReceiptId, setDeleteReceiptId] = useState("");
  const [deleteReceiptImageBucket, setDeleteReceiptImageBucket] = useState("");
  const [receipts, setReceipts] = useState<SentReceiptType[]>([]);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  useEffect(() => {
    (async () => {
      if (authUser) {
        const unsubscribe = await getReceipts(authUser.uid, setReceipts, setIsLoadingReceipts);
        return () => unsubscribe();
      }
    })();
  }, [authUser]);

  const onDelete = async () => {
    let isSuccess = true;
    try {
      await deleteReceipt(deleteReceiptId);
      await deleteImage(deleteReceiptImageBucket);
    } catch (error) {
      isSuccess = false;
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Head>
        <title>Dashboard | Expense Tracker</title>
      </Head>

      <main>
        <TopNavigation />
        <div className="items-center flex gap-x-4 mt-3 ml-[260px]">
          <span className="font-Courier text-3xl font-bold">EXPENSES</span>
          <BiPlus onClick={() => setIsOpen(true)}
                  className="text-[40px] rounded-full cursor-pointer hover:bg-slate-200 transition ease-in-out p-1 text-blue-700 translate-y-[-6%]" />
        </div>
        <div className={"min-w-full flex items-center flex-col"}>
          {receipts.map((receipt) => (<Receipt data={receipt} />))}
        </div>
        <div className="p-2">
          <ExpenseModal isOpen={isOpen} closeModal={closeModal} modalType={"ADD"} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;

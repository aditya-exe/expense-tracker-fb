import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { type NextPage } from "next";
import Head from "next/head";
import { MouseEvent, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { auth } from "../firebase/firebase.config";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../firebase/firebase.auth";
import { GoogleAuthProvider } from "firebase/auth";

const Home: NextPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { isLoading, authUser } = useAuth();
  const router = useRouter();

  const handleOnClose = () => {
    setOpenDialog(false);
  }

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("./dashboard");
    }
  }, [isLoading, authUser])


  return (
    <>
      <Head>
        <title>Expense Tracker</title>
      </Head>

      <main className="flex">
        <div className="mt-8 mx-auto">
          <h1 className="text-[84px]">Welcome to Expense Tracker</h1>
          <h2 className="text-[40px]">Add, view, edit and delete your expenses</h2>
          <div>
            <button onClick={() => setOpenDialog(true)} className="bg-[#1a73e8] leading-tight uppercase shadow-md hover:bg-[#135cbc] hover:shadow-lg transition duration-150 ease-in-out text-white p-2 rounded-md mt-2">
              Login / Register
            </button>
          </div>
          <LoginModal onClose={handleOnClose} visible={openDialog} />
        </div>
      </main>
    </>
  );
};

export default Home;

type EmailSignInType = {
  email: string,
  password: string,
};

const LoginModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  if (!visible) return null

  const handleOnClose = (e: any) => {
    if (e.target.id === "container") {
      onClose();
    }
  };

  const router = useRouter();
  const [email, setEmail] = useState(false);
  const { register, handleSubmit } = useForm<EmailSignInType>();

  const onSubmit: SubmitHandler<EmailSignInType> = ({ email, password }) => {
    createUserWithEmailAndPassword(auth, email, password).then(() => {
      router.push("./dashboard");
    }).catch((err: FirebaseError) => {
      // console.log(err.code);
      if (err.code === "auth/email-already-in-use") {
        signInWithEmailAndPassword(auth, email, password).then(() => {
          router.push("./dashboard");
        }).catch((err: FirebaseError) => {
          console.log(err);
        });
      }
    });
  };

  const signInGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(() => {
      router.push("./dashboard");
    });
  }

  return (
    <div id="container" onClick={(e) => handleOnClose(e)} className="fixed inset-0 backdrop-blur-sm bg-opacity-30 bg-black flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-y-2">
          <button onClick={() => setEmail(true)} className={`p-2 bg-slate-300 hover:bg-slate-500 hover:text-white transition ease-in-out ring-0 flex items-center gap-x-2 shadow-md rounded ${email ? "hidden" : ""}`}>
            <span>
              <HiOutlineMail className="text-2xl" />
            </span>
            Sign In With Email
          </button>
          <button onClick={() => signInGoogle()} className={`p-2 flex gap-x-2 hover:bg-blue-300 hover:text-white transition ease-in-out rounded shadow-md ${email ? "hidden" : ""}`}>
            <span>
              <FcGoogle className="text-2xl" />
            </span>
            Sign In With Google
          </button>
          {email && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <h1 className="font-bold text-lg">Enter your email and password</h1>
              <input {...register("email", { required: true })} className="mt-3 p-2 placeholder:translate-x-2 outline-none" type="text" placeholder="email" />
              <input {...register("password", { required: true })} className="mt-3 p-2 placeholder:translate-x-2 outline-none" type="password" placeholder="password" />
              <div className="justify-end flex gap-x-5 mt-3">
                <button onClick={() => onClose()} className="text-blue-800 pl-3 pr-3 pt-1 pb-1 text-lg">
                  Cancel
                </button>
                <button type="submit" className="text-white bg-blue-800 pl-3 shadow-sm pr-3 pt-1 pb-1 text-lg">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


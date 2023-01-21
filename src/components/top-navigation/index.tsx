import { useAuth } from "../../firebase/firebase.auth";

const TopNavigation = () => {
  const { authUser, isLoading, signOut } = useAuth();

  return (
    <div className="flex justify-between shadow-lg items-center">
      <div className="flex font-Courier font-bold text-xl flex-grow p-4 items-center justify-center">
        EXPENSE TRACKER
      </div>
      <div className="flex flex-grow p-4 gap-x-5 items-center justify-center">
        <span>{authUser?.email}</span>
        <button onClick={() => signOut()} className="outline-none font-bold">Log Out</button>
      </div>
    </div>
  )
}

export default TopNavigation;
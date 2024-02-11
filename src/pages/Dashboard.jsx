import { useQuery } from "react-query"
import useAxiosSecure from "../hooks/useAxiosSecure"
import Spinner from "../shared/Spinner"
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { FaPeopleRoof } from "react-icons/fa6";


export default function Dashboard() {
  const [axiosSecure] = useAxiosSecure();

  const { data: wallets, isLoading } = useQuery({
    queryKey: 'wallet',
    queryFn: async () => {
      const wallets = await axiosSecure.get('/api/v1/deposit')
      return wallets?.data
    }
  })

  // const { data: users = [], isLoading: usersLoading } = useQuery({
  //   queryKey: 'users',
  //   queryFn: async () => {
  //     const allUsers = await axiosSecure.get('/api/v1/users');
  //     return allUsers.data;
  //   }
  // });

  const { data: costs, isLoading: costsLoading } = useQuery({
    queryKey: 'expenses',
    queryFn: async () => {
      const getCosts = await axiosSecure.get('/api/v1/cost');
      return getCosts?.data;
    }
  })

  if (isLoading || costsLoading) {
    return <Spinner />
  }

  const totalWalletAmount = wallets?.data?.reduce((total, wallet) => total + wallet.amount, 0);

  const totalExpenseAmount = costs?.data?.reduce((total, cost) => total + cost.expenseAmount, 0);

  const currentBalance = totalWalletAmount - totalExpenseAmount;

  // const currentPersonWalletAmount = (totalWalletAmount - totalExpenseAmount) / users?.length;

  return (
    <div className="grid grid-cols-3 w-11/12 mx-auto mt-6 text-center gap-8">
      {/* <div className="bg-indigo-500 py-10 px-2 rounded-md text-white shadow-2xl">
        <h3 className="text-3xl font-semibold">Current Members</h3>
        <p className="text-4xl font-bold mt-3 flex items-center justify-center space-x-2">
          <FaPeopleRoof />
          <span>{users?.length}</span>
        </p>
      </div> */}
      <div className="bg-indigo-500 py-10 px-2 rounded-md text-white shadow-2xl">
        <h3 className="text-3xl font-semibold">Total Amount</h3>
        <p className="text-4xl font-bold mt-3 flex items-center justify-center space-x-2">
          <HiCurrencyBangladeshi />
          <span>{totalWalletAmount}</span>
        </p>
      </div>
      <div className="bg-red-500 py-10 px-2 rounded-md text-white shadow-2xl">
        <h3 className="text-3xl font-semibold">Total Expense</h3>
        <p className="text-4xl font-bold mt-3 flex items-center justify-center space-x-2">
          <HiCurrencyBangladeshi />
          <span>{totalExpenseAmount}</span>
        </p>
      </div>
      <div className="bg-green-500 py-10 px-2 rounded-md text-white shadow-2xl">
        <h3 className="text-3xl font-semibold">Current Balance</h3>
        <p className="text-4xl font-bold mt-3 flex items-center justify-center space-x-2">
          <HiCurrencyBangladeshi />
          <span>{currentBalance}</span>
        </p>
      </div>
      {/* <div className="bg-indigo-500 py-10 px-2 rounded-md text-white shadow-2xl">
        <h3 className="text-3xl font-semibold">Person Wallet Balance</h3>
        <p className="text-4xl font-bold mt-3 flex items-center justify-center space-x-2">
          <HiCurrencyBangladeshi />
          <span>{currentPersonWalletAmount}</span>
        </p>
      </div> */}
    </div>
  )
}

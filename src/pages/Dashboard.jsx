import { useQuery } from "react-query"
import useAxiosSecure from "../hooks/useAxiosSecure"
import Spinner from "../shared/Spinner"
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { FaPeopleRoof } from "react-icons/fa6";
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts';
import { format } from "date-fns"



export default function Dashboard() {
  const [axiosSecure] = useAxiosSecure();

  const { data: wallets, isLoading } = useQuery({
    queryKey: 'wallet',
    queryFn: async () => {
      const wallets = await axiosSecure.get('/api/v1/deposit')
      return wallets?.data
    }
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: 'allUsers',
    queryFn: async () => {
      const allUsers = await axiosSecure.get('/api/v1/users');
      return allUsers.data;
    }
  });

  const { data: costs = {}, isLoading: costsLoading } = useQuery({
    queryKey: 'expenses',
    queryFn: async () => {
      const getCosts = await axiosSecure.get('/api/v1/cost');
      return getCosts?.data;
    }
  })

  const totalWalletAmount = wallets?.data?.reduce((total, wallet) => total + wallet.amount, 0);

  const totalExpenseAmount = costs?.data?.reduce((total, cost) => total + cost.expenseAmount, 0);

  const currentBalance = totalWalletAmount - totalExpenseAmount;

  if (isLoading || usersLoading || costsLoading) {
    return <Spinner />
  }

  // console.log(costs?.data)

  const costData = costs?.data?.map((cost) => {
    const date = format(cost?.date, 'PP');
    const newCostData = { ...cost, date }
    return newCostData;
  })

  return (
    <>
      <div className="grid grid-cols-4 w-11/12 mx-auto mt-6 text-center gap-4">
        <div className="bg-slate-500 py-4 px-2 rounded-md text-white shadow-2xl">
          <h3 className="text-xl font-semibold">Current Members</h3>
          <p className="text-2xl font-bold mt-3 flex items-center justify-center space-x-2">
            <FaPeopleRoof />
            <span>{users?.length}</span>
          </p>
        </div>
        <div className="bg-indigo-500 py-4 px-2 rounded-md text-white shadow-2xl">
          <h3 className="text-xl font-semibold">Total Amount</h3>
          <p className="text-2xl font-bold mt-3 flex items-center justify-center space-x-2">
            <HiCurrencyBangladeshi />
            <span>{totalWalletAmount}</span>
          </p>
        </div>
        <div className="bg-red-500 py-4 px-2 rounded-md text-white shadow-2xl">
          <h3 className="text-xl font-semibold">Total Expense</h3>
          <p className="text-2xl font-bold mt-3 flex items-center justify-center space-x-2">
            <HiCurrencyBangladeshi />
            <span>{totalExpenseAmount}</span>
          </p>
        </div>
        <div className="bg-green-500 py-4 px-2 rounded-md text-white shadow-2xl">
          <h3 className="text-xl font-semibold">Current Balance</h3>
          <p className="text-2xl font-bold mt-3 flex items-center justify-center space-x-2">
            <HiCurrencyBangladeshi />
            <span>{currentBalance}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10 mt-10 w-11/12 mx-auto">
        <AreaChart width={600} height={400} data={costData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="expenseAmount" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="monotone" dataKey="bazarDetails" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>
      </div>
    </>
  )
}

import { useQuery } from "react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Spinner from "../shared/Spinner";
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { Link } from "react-router-dom";


export default function Wallets() {
    const [axiosSecure] = useAxiosSecure()
    const { data: walletInfo = {}, isLoading } = useQuery({
        queryKey: 'depositInfo',
        queryFn: async () => {
            const getWalletInfo = await axiosSecure.get('/api/v1/deposit')
            return getWalletInfo.data;
        }
    })

    if (isLoading) {
        return <Spinner />
    }


    return (
        <div>
            <h3 className="text-3xl font-bold my-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">Total Wallets: {walletInfo?.data?.length}</h3>
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    {/* head */}
                    <thead className="text-transparent text-lg bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
                        <tr>
                            <th>#</th>
                            <th>Wallet ID</th>
                            <th>Email</th>
                            <th>Total Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black common__heading">
                        {
                            walletInfo?.data?.map((wallet, index) => <tr key={wallet._id}>
                                <th>{index + 1}</th>
                                <td>{wallet?.walletID}</td>
                                <td>{wallet?.email}</td>
                                <td className="flex items-center justify-center text-xl text-indigo-900 font-bold common__heading"><HiCurrencyBangladeshi size={20} /> {wallet?.amount}</td>
                                <td>
                                    <Link to={`/wallets/${wallet?._id}`}>
                                        <button className="px-6 py-2 rounded-md bg-indigo-700 text-white mr-5">Edit Amount</button>
                                    </Link>
                                    <button className="px-6 py-2 rounded-md bg-red-600 text-white">Trash</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

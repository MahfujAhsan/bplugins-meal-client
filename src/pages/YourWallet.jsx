import { useQuery } from "react-query";
import useAxiosSecure from "../hooks/useAxiosSecure"
import Spinner from "../shared/Spinner";
import useAuth from "../hooks/useAuth";


export default function YourWallet() {
    const [axiosSecure] = useAxiosSecure();
    const { user } = useAuth();

    const { data: walletInfo, isLoading } = useQuery({
        queryKey: 'walletInfo',
        queryFn: async () => {
            const wallet = await axiosSecure.get(`api/v1/deposit/wallet-info?email=${user?.email}`);
            return wallet?.data;
        }
    })

    if (isLoading) {
        return <Spinner />
    }

    const { walletID, amount } = walletInfo || {};
    return (
        <div className="h-screen flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl uppercase mb-6 font-semibold text-indigo-900 common__heading">Your Wallet</h3>
            <div className="w-6/12 mx-auto bg-indigo-950 text-white py-12 rounded-xl -rotate-6">

                <div>
                    <h2 className="text-2xl uppercase font-bold">WalletID: {walletID}</h2>
                    <p className="text-2xl uppercase font-bold mt-7">Main Balance: {amount}</p>
                </div>
            </div>
        </div>
    )
}

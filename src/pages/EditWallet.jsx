import { useNavigate, useParams } from "react-router-dom"
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "react-query";
import Spinner from "../shared/Spinner";
import { useForm } from "react-hook-form";
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { toast } from "react-toastify";


export default function EditWallet() {
    const { id } = useParams();
    const [axiosSecure] = useAxiosSecure();

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: walletInfos = {}, isLoading, refetch } = useQuery({
        queryKey: ['walletInfos', id],
        queryFn: async () => {
            const getWallet = await axiosSecure.get(`api/v1/deposit/${id}`);
            return getWallet?.data;
        }
    })

    if (isLoading) {
        refetch()
        return <Spinner />
    }
    const { walletID, email, amount } = walletInfos?.data || {};

    const onSubmit = async (data) => {
        const updatedData = {
            amount: data?.amount,
        }
        const updateWallet = await axiosSecure.patch(`api/v1/deposit/${id}`, updatedData);
        if (updateWallet?.data?.success) {
            toast.success(`Wallet updated successfully!`)
        }
        navigate('/wallets')
    }

    return (
        <div className="w-10/12 mx-auto">
            <h3 className="text-3xl text-center font-semibold uppercase mt-8">Edit This Wallet</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex space-x-6">
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Wallet ID:</span>
                        </div>
                        <input {...register("walletID", { required: true })} type="text" className="input input-bordered w-full cursor-not-allowed" defaultValue={walletID} readOnly />
                    </div>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Email:</span>
                        </div>
                        <input {...register("email", { required: true })} type="email" className="input input-bordered w-full cursor-not-allowed" defaultValue={email} readOnly />
                    </div>
                </div>
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Deposit Amount:</span>
                    </div>
                    <input {...register("amount", { required: true })} type="number" placeholder="৳ Enter Amount of Deposit" className="input input-bordered w-full" defaultValue={amount} />
                    {errors.amount && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Amount is required</span>}
                </div>
                <button type="submit" className="flex justify-center items-center w-full bg-indigo-500 rounded-md text-white text-xl py-2 mt-6 font-semibold cursor-pointer">
                    <HiCurrencyBangladeshi className="mr-3" size={26} /> Edit Wallet
                </button>
            </form>
        </div>
    )
}

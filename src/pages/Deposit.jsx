import axios from "axios";
import { useForm } from "react-hook-form";
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Deposit() {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [axiosSecure] = useAxiosSecure();

    const navigate = useNavigate();

    const { data: users = [] } = useQuery({
        queryKey: 'users',
        queryFn: async () => {
            const getUsersInfo = await axiosSecure.get('/api/v1/users')
            return getUsersInfo.data;
        }
    })

    const usersEmail = users?.map((user) => user?.email)

    const walletIDs = users?.map((user) => user?.bPluginsID)

    // console.log(walletIDs)
    const onSubmit = async (data) => {

        const depositData = {
            walletID: data.walletID,
            email: data.email,
            amount: data.amount
        }
        try {
            setLoading(true)
            axios.post('http://localhost:200/api/v1/deposit', depositData)
                .then((response) => {
                    if (response?.data?.success) {
                        toast.success(`Amount Deposited Successfully to ${data?.walletID}'s Wallet!`)
                        reset();
                        navigate('/wallets')
                    }
                    setLoading(false)
                })
                .catch((error) => {
                    toast.error(`${error?.response?.data?.message}`)
                })

        } catch (error) {
            toast.error(`${error}`)
        }
    }

    // console.log(depositInfo)
    return (
        <div className="w-1/2 mx-auto h-screen flex items-center">
            <div className="col-span-1 w-10/12 mx-auto">
                {/* form side */}
                <h3 className="text-center text-3xl uppercase font-bold mb-4 common__heading">Deposit Amount To Wallet</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="common__heading">
                    <div className="flex space-x-6">
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text common__heading">Wallet ID:</span>
                            </div>
                            <select {...register("walletID", { required: true })} className="select select-info w-full max-w-xs" defaultValue="">
                                <option disabled value="">Select Wallet ID</option>
                                {
                                    walletIDs?.map((walletID, index) => <option value={walletID} key={index}>{walletID}</option>)
                                }
                            </select>
                            {errors.walletID && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Wallet ID is required</span>}
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text common__heading">Email:</span>
                            </div>
                            <select {...register("email", { required: true })} className="select select-info w-full max-w-xs" defaultValue="">
                                <option disabled value="">Select Email</option>
                                {
                                    usersEmail?.map((email, index) => <option key={index} value={email}>{email}</option>)
                                }
                            </select>
                            {errors.email && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Email ID is required</span>}
                        </div>
                    </div>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text common__heading">Deposit Amount:</span>
                        </div>
                        <input {...register("amount", { required: true })} type="number" placeholder="৳ Enter Amount of Deposit" className="input input-bordered w-full" />
                        {errors.amount && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Amount is required</span>}
                    </div>
                    <button disabled={loading} type="submit" className="flex justify-center items-center w-full bg-indigo-500 rounded-md text-white text-xl py-2 mt-6 font-semibold cursor-pointer disabled:bg-slate-400">
                        <HiCurrencyBangladeshi className="mr-3" size={26} /> Create Deposit
                    </button>
                </form>
            </div>
        </div>
    )
}

import { useQuery } from "react-query";
import useAxiosSecure from "../hooks/useAxiosSecure"
import Spinner from "../shared/Spinner";
import { format } from "date-fns";
import { HiCurrencyBangladeshi } from "react-icons/hi";
import Swal from "sweetalert2";
import { RiDeleteBin2Fill } from "react-icons/ri";


export default function Expenses() {
    const [axiosSecure] = useAxiosSecure();

    const { data: costs, isLoading, refetch } = useQuery({
        queryKey: 'expenses',
        queryFn: async () => {
            const getCosts = await axiosSecure.get('/api/v1/cost');
            return getCosts?.data;
        }
    })

    if (isLoading) {
        return <Spinner />;
    }

    const totalExpenseAmount = costs?.data?.reduce((total, cost) => total + cost.expenseAmount, 0);

    const handleAllDelete = () => {
        // const deleteAllCosts = await axiosSecure.delete('/api/v1/cost');
        // console.log(deleteAllCosts)
        // refetch()

        Swal.fire({
            title: 'Are you sure? (This action can not be undone!)',
            text: `All Cost Entries Will Be Deleted`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete All Costs!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/api/v1/cost`)
                    .then(response => {
                        if (response?.status === 200) {
                            refetch();
                            Swal.fire(
                                'Success!',
                                `All Cost Entries Deleted.`,
                                'success'
                            )
                        }
                    })
            }
        })
    }
    return (
        <div>
            <div className="w-11/12 mx-auto my-6 flex justify-between items-center">
                <h3 className="text-2xl uppercase font-semibold flex items-center gap-4 common__heading">Total Expense: <span className="font-bold text-indigo-900 flex items-center common__heading">
                    <HiCurrencyBangladeshi size={24} />
                    {totalExpenseAmount}</span></h3>
                <button onClick={handleAllDelete} className="px-6 py-2 rounded-md bg-red-900 text-white text-sm uppercase font-semibold flex items-center gap-4">Clear All <RiDeleteBin2Fill size={20} /></button>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    {/* head */}
                    <thead className="text-transparent text-lg bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Bazar Details</th>
                            <th>Expense Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black common__heading">
                        {
                            costs?.data?.map((cost, index) => <tr key={cost._id}>
                                <th>{index + 1}</th>
                                <td>{format(cost?.date, 'PP')}</td>
                                <td>{cost?.bazarDetails}</td>
                                <td>{cost?.expenseAmount}</td>
                                <td>
                                    <button className="px-6 py-2 rounded-md bg-indigo-700 text-white mr-5">Edit</button>
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

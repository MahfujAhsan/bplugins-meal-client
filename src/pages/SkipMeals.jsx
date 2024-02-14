import { useQuery } from "react-query"
import useAxiosSecure from "../hooks/useAxiosSecure"
import Spinner from "../shared/Spinner";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { RiDeleteBin2Fill } from "react-icons/ri";


export default function SkipMeals() {
    const [axiosSecure] = useAxiosSecure();
    const { data: skipMeals = [], isLoading, refetch } = useQuery({
        queryKey: "skipmeals",
        queryFn: async () => {
            const allSkipMeals = await axiosSecure.get('/api/v1/meal')
            return allSkipMeals.data;
        }
    });

    if (isLoading) {
        return <Spinner />;
    }

    const handleAllDelete = () => {
        Swal.fire({
            title: 'Are you sure? (This action can not be undone!)',
            text: `All Meal Entries Will Be Deleted`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete All Meal!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/api/v1/meal`)
                    .then(response => {
                        if (response?.status === 200) {
                            refetch();
                            Swal.fire(
                                'Success!',
                                `All Meal Entries Deleted.`,
                                'success'
                            )
                        }
                    })
            }
        })
    }

    return (
        <div>
            <div className="flex justify-between w-11/12 mx-auto my-4">
                <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 uppercase">Total Skipped Meals: {skipMeals?.data?.length}</h3>
                <button onClick={handleAllDelete} className="px-6 py-2 rounded-md bg-red-900 text-white text-xs uppercase font-semibold flex items-center gap-4">Clear All <RiDeleteBin2Fill size={20} /></button>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    {/* head */}
                    <thead className="text-transparent text-lg bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Email</th>
                            <th>Skipped Meal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black common__heading">
                        {
                            skipMeals.data.map((meal, index) => <tr key={meal._id}>
                                <th>{index + 1}</th>
                                <td>{format(meal?.selectedDate, 'PP')}</td>
                                <td>{meal?.userEmail}</td>
                                <td className="flex flex-col">
                                    {meal?.breakfast && <span>Breakfast</span>}

                                    {meal?.launch && <span>Launch</span>}

                                    {meal?.dinner && <span>Dinner</span>}
                                </td>
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

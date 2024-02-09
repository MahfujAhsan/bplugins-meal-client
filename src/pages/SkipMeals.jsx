import { useQuery } from "react-query"
import useAxiosSecure from "../hooks/useAxiosSecure"
import Spinner from "../shared/Spinner";
import { format } from "date-fns";


export default function SkipMeals() {
    const [axiosSecure] = useAxiosSecure();
    const { data: skipMeals = [], isLoading } = useQuery({
        queryKey: "skipmeals",
        queryFn: async () => {
            const allSkipMeals = await axiosSecure.get('/api/v1/meal')
            return allSkipMeals.data;
        }
    });

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <h3 className="text-3xl font-bold my-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">Total Skipped Meals: {skipMeals?.data?.length}</h3>
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

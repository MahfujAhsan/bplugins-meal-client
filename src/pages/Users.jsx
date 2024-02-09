import { useQuery } from "react-query";
import Spinner from "../shared/Spinner";
import { FaTrashAlt, FaUserShield } from "react-icons/fa"
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";


export default function Users() {

    const [axiosSecure] = useAxiosSecure();

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: 'users',
        queryFn: async () => {
            const allUsers = await axiosSecure.get('/api/v1/users');
            return allUsers.data;
        }
    });

    const handleMakeManager = (user) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Manager access goes to ${user?.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Make Manager!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/api/v1/users/manager/${user._id}`)
                    .then(response => {
                        if (response.status === 200) {
                            refetch();
                            Swal.fire(
                                'Success!',
                                `${user?.name} is Manager now.`,
                                'success'
                            )
                        }
                    })
            }
        })
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <h3 className="text-3xl font-bold my-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">Total Users: {users.length}</h3>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead className="text-transparent text-lg bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>bPluginsID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black common__heading">
                        {
                            users.map((user, index) => <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role === 'manager' ? <span className="uppercase text-xs bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 px-4 py-2 rounded-md font-semibold shadow-inner shadow-white text-center text-white">Manager</span> :
                                    <button onClick={() => handleMakeManager(user)} className="px-[36px] rounded-md py-[6px] bg-indigo-700 text-white"><FaUserShield size={20} /></button>
                                }</td>
                                <td>
                                    <p>{user?.bPluginsID}</p>
                                </td>
                                <td>
                                    <button className="px-[36px] rounded-md py-[6px] bg-pink-700 text-white flex items-center gap-3">Trash <FaTrashAlt size={18} /></button>
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

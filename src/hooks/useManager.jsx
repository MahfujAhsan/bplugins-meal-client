import { useQuery } from "react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useManager = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const { data: isManager, isLoading: isManagerLoading } = useQuery({
        queryKey: ['isManager', user?.email],
        enabled: !user?.email,
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/api/v1/users/manager/${user?.email}`);
                return res?.data?.manager;
            } catch (error) {
                // Handle the error, e.g., log it or display an error message.
                console.error("Error fetching isManager data:", error);
                throw error; // Rethrow the error to propagate it to the caller.
            }
        }
    })
    return [isManager, isManagerLoading];
}

export default useManager;
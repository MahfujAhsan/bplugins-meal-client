import { useQuery } from "react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useCurrentUser = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const { data: currentUser, isLoading: isCurrentUserLoading, refetch } = useQuery({
        enabled: !loading,
        queryKey: ["currentUser", user?.email],
        queryFn: async () => {
            try {
                const currentUserInfo = await axiosSecure.get(`/api/v1/users/currentUser?email=${user?.email}`)
                return currentUserInfo?.data;
            } catch (error) {
                console.error("Error fetching currentUserData data:", error);
                throw error;
            }
        }
    })
    return [currentUser, isCurrentUserLoading, refetch];
}

export default useCurrentUser;
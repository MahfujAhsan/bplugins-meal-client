import useAxiosSecure from "../hooks/useAxiosSecure"
import useAuth from "../hooks/useAuth";
import Spinner from "../shared/Spinner";
import { useForm } from "react-hook-form";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import imageLoader from "../assets/image-loader.gif"
import useCurrentUser from "../hooks/useCurrentUser";
import { toast } from "react-toastify";

const img_hosting_token = import.meta.env.VITE_Image_Upload_Token;


export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [axiosSecure] = useAxiosSecure();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [currentUser, isCurrentUserLoading, refetch] = useCurrentUser();

  const handleImageClick = () => {
    // Trigger click event on file input
    document.getElementById("file-input").click();
  };

  const img_hosting_url = `https://api.imgbb.com/1/upload?expiration=600&key=${img_hosting_token}`;



  const onSubmit = async (data) => {
    try {
      if (data?.image) {
        let updatedData;
        const formData = new FormData();
        formData.append('image', data.image[0]);

        setLoading(true);

        const imageResponse = await axios.post(img_hosting_url, formData);

        if (imageResponse.status === 200) {
          updatedData = {
            name: data?.name,
            email: data?.email,
            image: imageResponse?.data?.data?.url
          };
        }

        const updateProfile = await axiosSecure.patch(`/api/v1/users/currentUser?email=${user.email}`, updatedData);

        if (updateProfile?.status === 200) {
          toast.success(`Profile Updated Successfully!`);
          refetch();
        }
      }
      setLoading(false);
      // console.log(image)
    } catch (error) {

      // If no image is uploaded, only update other fields
      const updatedData = {
        name: data?.name,
        email: data?.email
      };
      setLoading(true);
      // Send the patch request to update the profile
      const updateProfile = await axiosSecure.patch(`/api/v1/users/currentUser?email=${user.email}`, updatedData);

      // Check if the profile update was successful
      if (updateProfile?.status === 200) {
        toast.success(`Profile Updated Successfully!`);
        refetch();
      }
    }
    setLoading(false);
  }

  const { bPluginsID, email, name, role, image, createdAt } = currentUser || {};

  if (isCurrentUserLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-3xl uppercase font-bold text-indigo-900 common__heading">Your Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 common__heading">
        <input {...register("image")} type="file" className="file-input file-input-bordered w-full max-w-xs" hidden accept="image/*" id="file-input" />
        {
          !loading ? <img onClick={handleImageClick} className="w-28 h-28 mx-auto cursor-pointer rounded-full" src={image} alt="" /> : <img className="w-28 h-28 mx-auto cursor-pointer rounded-full" src={imageLoader} alt="" />
        }
        <p className="text-center mt-2 font-semibold">You Joined: <span className="text-indigo-800 font-bold common__heading">{format(createdAt, 'PP')}</span></p>
        <div className="flex space-x-6 justify-center mt-6">
          <h3 className="font-semibold">bPluginsID: <span className="text-indigo-800 font-bold common__heading">{bPluginsID}</span></h3>
          <h3 className="capitalize font-semibold">Role: <span className="text-indigo-800 font-bold common__heading">{role}</span></h3>
        </div>
        <div className="form-control">
          <div className="label">
            <span className="label-text">Name:</span>
          </div>
          <input {...register("name", { required: true })} type="text" defaultValue={name} className="input input-bordered w-[500px] mx-auto" />
          {errors.name && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Name is required</span>}
        </div>
        <div className="form-control">
          <div className="label">
            <span className="label-text">Email Address:</span>
          </div>
          <input {...register("email", { required: true })} type="email" defaultValue={email} className="input input-bordered w-[500px] mx-auto" />
          {errors.email && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Email is required</span>}
        </div>
        <div className="form-control mt-8">
          <input type="submit" className={`py-3 bg-indigo-700 w-[500px] mx-auto rounded-md text-white cursor-pointer disabled:bg-slate-200`} value="Update Profile" disabled={loading} />
        </div>
      </form>
    </div>
  )
}

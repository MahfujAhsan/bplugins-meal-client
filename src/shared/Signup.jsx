import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaSpinner } from "react-icons/fa6";


export default function Signup() {
  // To Handle Firebase Auth Error
  const [signUpError, setSignUpError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const [axiosSecure] = useAxiosSecure();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { createUser, updateUserProfile } = useAuth();

  const navigate = useNavigate();

  const defaultAvatar = "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg";

  const onSubmit = async (data) => {
    if (!disabled) {
      setDisabled(true);

      try {
        const { name, email, password } = data;
        await createUser(email, password)
          .then(() => {
            updateUserProfile(data.name, defaultAvatar)
              .then(() => {
                const userData = { name: name, email: email, image: defaultAvatar };
                axiosSecure.post('/api/v1/users', userData)
                  .then((response) => {
                    navigate('/');
                    reset();
                    if (response?.data?.success) {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Registration successful!',
                        showConfirmButton: false,
                        timer: 2000
                      });
                      setDisabled(false);
                    }
                  })
                  .catch((error) => {
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: `${error?.response?.data?.message}`,
                      showConfirmButton: false,
                      timer: 2000
                    });
                    setDisabled(false);
                  })
              });
          });
      } catch (error) {
        if (error?.message) {
          setSignUpError('Auth/Credentials Wrong!')
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `Auth/Credentials Wrong!`,
            showConfirmButton: false,
            timer: 2000
          });
          setDisabled(false);
        }
      }
    }
  }

  return (
    <section className="flex justify-center w-screen h-screen items-center">
      <div>
        <h3 className="text-center text-3xl">Sign_Up</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="form-control">
            <div className="label">
              <span className="label-text">Name:</span>
            </div>
            <input {...register("name", { required: true })} type="text" placeholder="Name" className="input input-bordered w-[500px] mx-auto" />
            {errors.name && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Name is required</span>}
          </div>
          <div className="form-control">
            <div className="label">
              <span className="label-text">Email Address:</span>
            </div>
            <input {...register("email", { required: true })} type="email" placeholder="Email" className="input input-bordered w-[500px] mx-auto" />
            {errors.email && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Email is required</span>}
          </div>
          <div className="form-control">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            {/* pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/  */}
            <input {...register("password", { required: true, minLength: 6, maxLength: 20})} type="password" placeholder="Password" className="input input-bordered w-[500px] mx-auto" />
            {errors.password?.type === 'required' && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Password is required</span>}
            {errors.password?.type === 'minLength' && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Password must be 6 characters</span>}
            {errors.password?.type === 'maxLength' && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Less then 20 characters</span>}
            {errors.password?.type === 'pattern' && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Password must have one Uppercase, one Lowercase, one Number & one Special character</span>}
          </div>
          {
            signUpError && <p className="text-error mt-2 font-semibold text-sm">{signUpError}</p>
          }
          <div className="form-control mt-8">
            <button disabled={disabled} type="submit" className={`py-3 bg-indigo-700 w-[500px] cursor-pointer mx-auto rounded-md text-white text-center ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
              {disabled ? <div className="flex justify-center items-center gap-3">
                <span>Please Wait</span>
                <FaSpinner size={20} />
              </div> : "SignUp"}
            </button>
          </div>

        </form>
        <div className="mt-4">
          <h4>Already have an account? <Link className="font-semibold" to="/sign-in">Please Login.</Link></h4>
        </div>
      </div>
    </section>
  )
}

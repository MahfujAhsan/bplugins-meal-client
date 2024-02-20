import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";


export default function Signin() {
  const [disabled, setDisabled] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const { signIn } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    if (!disabled) { // Check if the button is not disabled
      setDisabled(true); // Disable the button

      const { email, password } = data;
      try {
        await signIn(email, password)
          .then((result) => {
            reset();
            const user = result?.user;
            if (user?.uid) {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${user?.displayName} Login Successfully`,
                showConfirmButton: false,
                timer: 2000
              })
            }
            navigate(from, { replace: true })
          })
          .catch((error) => {
            if (error?.message) {
              setSignUpError('Auth/Credentials Wrong!')
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Auth/Credentials Wrong!`,
                showConfirmButton: false,
                timer: 2000
              })
            }
          })
          .finally(() => {
            setDisabled(false); // Re-enable the button
          });
      } catch (error) {
        console.log(error.message);
        setDisabled(false); // Re-enable the button in case of an error
      }
    }
  }
  return (
    <section className="flex justify-center items-center w-screen h-screen">
      <div>
        <h3 className="text-center text-3xl">Sign_In</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="form-control">
            <div className="label">
              <span className="label-text">Email Address:</span>
            </div>
            <input type="email" {...register("email", { required: true })} placeholder="Email" className="input input-bordered w-[500px] mx-auto" />
            {errors.email && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Email is required</span>}
          </div>
          <div className="form-control">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            {/* pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/  */}
            <input {...register("password", { required: true, minLength: 6, maxLength: 20 })} type="password" placeholder="Password" className="input input-bordered w-[500px] mx-auto" />
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
              </div> : "SignIn"}
            </button>
          </div>
        </form>
        <div className="mt-4">
          <h4>New to bPlugins Meal? <Link className="font-semibold" to="/sign-up">Please Register.</Link></h4>
        </div>
      </div>
    </section>
  )
}

import { useForm } from "react-hook-form";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEffect, useState } from "react";
import { format, isBefore, isAfter, isSameMonth, endOfMonth, addDays } from 'date-fns';
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import '../index.css'
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";


export default function Meal() {
  const tomorrow = addDays(new Date(), 1);
  const [selected, setSelected] = useState(tomorrow);
  const [selectionError, setSelectionError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();

  useEffect(() => {
    if (!selected) {
      setSelected(tomorrow);
    }
  }, [selected, tomorrow]);

  const disabledDays = (day) => {
    const today = new Date();
    return isBefore(day, today) || isAfter(day, endOfMonth(selected)) || !isSameMonth(day, selected);
  };

  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p className="mt-5 text-indigo-900 common__heading">You picked <span className="font-semibold">{format(selected, 'PP')}</span>.</p>;
  }

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const selectedDateUTC = selected.toISOString();

    const formatDate = format(selectedDateUTC, 'PP')
    const formData = { ...data, selectedDate: formatDate, userEmail: user?.email };

    if (!formData?.breakfast && !formData?.launch && !formData?.dinner) {
      setSelectionError(<p>Please select at least one!</p>);
      return;
    } else {
      setSelectionError("")
    }
    try {
      setLoading(true);
      const saveMeal = await axiosSecure.post('/api/v1/meal', formData)
      if (saveMeal?.data) {
        reset();
        toast.success(`Your meal updated successfully!`)
        navigate('/skip-meals')
      }
      setLoading(false);
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `${error?.response?.data?.message}`,
        showConfirmButton: false,
        timer: 2000
      })
      setLoading(false);
    }
  }

  const handleCheckboxChange = () => {
    setSelectionError("");
  }

  const currentDate = new Date();
  const startOfMonthNavigation = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Calculate the end date of the current month
  const endOfMonthNavigation = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h4 className="text-3xl text-indigo-800 uppercase mb-12 font-bold common__heading">Update Your Meal Status</h4>
      <div className="flex items-center space-x-28 w-10/12 mx-auto">
        <div className="w-full shadow-2xl rounded-2xl py-8">
          <DayPicker
            className="dailyDayPicker common__heading"
            mode="single"
            selected={selected}
            onSelect={setSelected}
            footer={footer}
            disabled={disabledDays}
            fromMonth={startOfMonthNavigation}
            toMonth={endOfMonthNavigation}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full common__heading">
          <p className="text-[15px] font-bold uppercase text-indigo-900 common__heading">Which meal you want to skip?</p>
          <div className="flex justify-between my-4 space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("breakfast")}
                className="checkbox checkbox-primary"
                id="breakfast"
                onChange={handleCheckboxChange}
              />
              <label className="text-xl font-semibold ml-2 uppercase" htmlFor="breakfast">Breakfast</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("launch")}
                className="checkbox checkbox-primary"
                id="launch"
                onChange={handleCheckboxChange}
              />
              <label className="text-xl font-semibold ml-2 uppercase" htmlFor="launch">Launch</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("dinner")}
                className="checkbox checkbox-primary"
                id="dinner"
                onChange={handleCheckboxChange}
              />
              <label className="text-xl font-semibold ml-2 uppercase" htmlFor="dinner">Dinner</label>
            </div>
          </div>
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text text-[15px] font-bold uppercase text-indigo-900 common__heading">Add Note:</span>
            </div>
            <textarea {...register("description")} rows={6} className="textarea textarea-bordered w-full border-indigo-800 textarea-info text-xl" placeholder="note (optional)"></textarea>
          </div>

          {selectionError}
          <input className="bg-indigo-400 rounded-md px-8 py-2 text-white mt-4 w-full cursor-pointer disabled:bg-slate-300 font-bold" type="submit" value="SET MEAL" disabled={loading} />
        </form>
      </div>
    </div>
  )
}

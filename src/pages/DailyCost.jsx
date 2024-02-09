import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";
import '../index.css'
import 'react-day-picker/dist/style.css';
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



export default function DailyCost() {
  const [selected, setSelected] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [axiosSecure] = useAxiosSecure();

  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p className="mt-5 text-indigo-900 common__heading">You picked <span className="font-semibold">{format(selected, 'PP')}</span>.</p>;
  }

  useEffect(() => {
    if (!selected) {
      setSelected(new Date());
    }
  }, [selected]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // formatting Date
  // const datePlusOne = addDays(selected, 1);
  const dateUTC = selected.toISOString();


  // Calculate the start date of the current month
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Calculate the end date of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const onSubmit = async (data) => {

    const costData = {
      ...data,
      date: dateUTC,
      bazarDetails: data?.bazarDetails,
      expenseAmount: Number(data?.expenseAmount)
    }
    try {
      setLoading(true);
      const saveCost = await axiosSecure.post('/api/v1/cost', costData)
      if (saveCost?.data?.success) {
        toast.success(`Cost saved successfully!`)
        reset();
        navigate('/expenses')
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };


  return (
    <div className="h-full flex flex-col justify-center">
      <h3 className="text-3xl uppercase text-indigo-950 text-center font-bold common__heading">Daily Bazar Cost</h3>
      <div className="flex space-x-28 items-center w-10/12 mx-auto mt-6">
        <div className="w-full shadow-2xl rounded-2xl py-8">

          <DayPicker
            className="dailyDayPicker common__heading"
            mode="single"
            selected={selected}
            onSelect={setSelected}
            footer={footer}
            fromMonth={startOfMonth}
            toMonth={endOfMonth}
          />
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)} >
          <div className="form-control w-full common__heading">
            <div className="label">
              <span className="label-text text-[15px] font-bold uppercase text-indigo-900 common__heading">Bazar Details:</span>
            </div>
            <textarea rows={8} {...register("bazarDetails", { required: true })} type="text" placeholder="Name of Items" className="textarea textarea-bordered w-full border-indigo-800 textarea-info text-xl" />
            {errors.walletID && <span className='mt-2 ml-1 text-[#CA4142] font-semibold text-xs'>Wallet ID is required</span>}
          </div>
          <div className="form-control w-full common__heading">
            <div className="label">
              <span className="label-text text-[15px] font-bold uppercase text-indigo-900 common__heading">Cost Amount:</span>
            </div>
            <input placeholder="Total Cost" {...register("expenseAmount", { required: true })} type="number" className="input input-bordered w-full" />
          </div>
          <input className="bg-indigo-400 rounded-md px-8 py-2 text-white mt-4 w-full cursor-pointer disabled:bg-slate-300" type="submit" value="Save" disabled={loading} />
        </form>
      </div>
    </div>
  )
}

import { useEffect } from "react";
import { BiGridAlt } from 'react-icons/bi';
import { CgProfile } from "react-icons/cg";
import { FaUsers } from "react-icons/fa6";
import { GiExpense, GiHotMeal } from "react-icons/gi";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";
import { IoLogOut, IoWalletOutline, IoWalletSharp } from "react-icons/io5";
import { MdNoMeals } from "react-icons/md";
import { PiShoppingCartFill } from "react-icons/pi";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import useManager from "../hooks/useManager";
import Spinner from "../shared/Spinner";


export default function Main() {
    const { user, logOut } = useAuth();

    const [isManager, isManagerLoading] = useManager();

    // console.log(isManager)

    const navigate = useNavigate();

    const location = useLocation();

    const signInPage = location.pathname === "/sign-in";
    const signUpPage = location.pathname === "/sign-up";

    const handleLogout = () => {
        logOut()
            .then(() => { navigate('/sign-in') })
            .catch((err) => console.log(err))

    }

    useEffect(() => {
        localStorage.getItem('theme')
    }, [])

    if (isManagerLoading) {
        return <Spinner />
    }

    return (
        <section>
            {!signInPage && !signUpPage && <Navbar />}
            <div className="drawer lg:drawer-open drawer-mobile fixed">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content drawer__container overflow-y-auto">
                    <Outlet></Outlet>
                </div>
                {user && <div className="drawer-side top-[55px] md:top-0">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-full sidebar__container md:w-64 border-r-2 bg-[#F17D9A] md:bg-transparent text-white md:text-black overflow-y-auto">

                        <div className="flex flex-col h-full justify-between">
                            {isManager ? <div>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items text-' to='/'>
                                    <BiGridAlt size={20} />
                                    <li className='text-[16px]'>Dashboard</li>
                                </NavLink>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/daily-cost'>
                                    <PiShoppingCartFill size={20} />
                                    <li className='text-[16px]'>Daily Cost</li>
                                </NavLink>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/expenses'>
                                    <GiExpense size={20} />
                                    <li className='text-[16px]'>Expenses</li>
                                </NavLink>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/meal'>
                                    <GiHotMeal size={20} />
                                    <li className='text-[16px]'>Meal Settings</li>
                                </NavLink>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/deposit'>
                                    <HiOutlineCurrencyBangladeshi size={20} />
                                    <li className='text-[16px]'>Deposit</li>
                                    <span className="text-[14px] font-semibold text-indigo-900 common__heading">(manager)</span>
                                </NavLink>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/wallets'>
                                    <IoWalletSharp size={20} />
                                    <li className='text-[16px]'>All Wallets</li>
                                    <span className="text-[14px] font-semibold text-indigo-900 common__heading">(manager)</span>
                                </NavLink>

                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/wallet'>
                                    <IoWalletOutline size={20} />
                                    <li className='text-[16px]'>Your Wallet</li>
                                </NavLink>


                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/skip-meals'>
                                    <MdNoMeals size={20} />
                                    <li className='text-[16px]'>All Skip Meals</li>
                                    <span className="text-[14px] font-semibold text-indigo-900 common__heading">(manager)</span>
                                </NavLink>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/users'>
                                    <FaUsers size={20} />
                                    <li className='text-[16px]'>Manage Users</li>
                                    <span className="text-[14px] font-semibold text-indigo-900 common__heading">(manager)</span>
                                </NavLink>
                            </div> : <div>

                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/user-dashboard'>
                                    <BiGridAlt size={20} />
                                    <li className='text-[16px]'>Dashboard</li>
                                </NavLink>



                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/meal'>
                                    <GiHotMeal size={20} />
                                    <li className='text-[16px]'>Meal Settings</li>
                                </NavLink>



                                <NavLink exact="true" activeclassname="active" className='common__flex common__items' to='/wallet'>
                                    <IoWalletOutline size={20} />
                                    <li className='text-[16px]'>Your Wallet</li>
                                </NavLink>

                            </div>}
                            <hr />
                            <div>
                                <NavLink exact="true" activeclassname="active" className='common__flex common__items text-center' to='/profile'>
                                    <CgProfile size={20} />
                                    <li className='text-[16px] text-center'>Profile Settings</li>
                                </NavLink>


                                <button className=" font-semibold bg-indigo-400 text-white w-full rounded-lg flex justify-center items-center space-x-4 px-[18px] py-[4px] text-xl mt-6" onClick={handleLogout}>
                                    <span className="text-[16px]">Logout</span>
                                    <IoLogOut size={20} className="mt-1" />
                                </button>
                            </div>
                        </div>

                    </ul>

                </div>

                }
            </div>
        </section>
    )
}

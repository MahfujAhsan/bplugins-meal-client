import mealLoader from "../assets/meal.gif";

const Spinner = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <img className="rounded-full w-36" src={mealLoader} alt="mealLoader" />
        </div>
    );
};

export default Spinner;
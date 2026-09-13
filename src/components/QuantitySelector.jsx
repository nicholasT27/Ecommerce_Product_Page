import minusIcon from "../assets/icon-minus.svg";
import plusIcon from "../assets/icon-plus.svg";


function QuantitySelector ({value, onChange}) {
    const decrement = () => onChange(Math.max(0, value - 1));
    const increment = () => onChange(value + 1);

    return (
    <div className="flex items-center justify-between bg-lgblue rounded-xl px-4 py-4 w-full">
        <button
            onClick={decrement}
            aria-label="Decrease quantity"
            className="hover:opacity-50 transition"
        >
            <img src={minusIcon} alt="" />
        </button>

        <span className="font-bold">{value}</span>
        <button
            onClick={increment}
            aria-label="Increase quantity"
            className="hover:opacity-50 transition"
        >
            <img src={plusIcon} alt="" />
        </button>

        
    </div> 
    )
}

export default QuantitySelector;
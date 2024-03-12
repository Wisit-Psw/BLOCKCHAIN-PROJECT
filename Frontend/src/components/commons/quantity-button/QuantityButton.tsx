import './QuantityButton.css'

interface QuantityButtonProps {
    id?: number;
    quantity: number,
    max?: number,
    minus: (id?: number) => void;
    add: (id?: number) => void;
    change: (event: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
}

function QuantityButton({ id, quantity, max, minus, add, change }: QuantityButtonProps) {

    const handleMinusClick = () => {
        if (id !== undefined) {
            minus(id);
        } else {
            minus();
        }
    };

    const handleAddClick = () => {
        if (id !== undefined) {
            add(id);
        } else {
            add();
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (id !== undefined) {
            change(event, id);
        } else {
            change(event);
        }
    };


    return (
        <div className='quantityButtonBox'>
            <div className="minus-btn" onClick={handleMinusClick}> - </div>
            <input type="number" className="quan-btn-value" step={1} min={1} max={max} value={quantity} onChange={handleInputChange} />
            <div className="add-btn" onClick={handleAddClick}> + </div>
        </div>
    )
}

export default QuantityButton;

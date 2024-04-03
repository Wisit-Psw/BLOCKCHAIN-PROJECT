import './Alert.css';

function Alert(props: AlertStructure) {
    const { headerText, contentText, input, btn1, btn2 } = props;

    return (
        <>
            <div className="backdrop">
                <div className="card alert-modal">
                    <div className="card-header">{headerText}</div>
                    <div className="card-body alert-modal-body">
                        {contentText}
                    </div>
                    <div className="card-body alert-modal-body">
                        {/* Render input elements */}
                        {input && input.map((inputEle: AlertInput, index: number) => (
                            <div className="alert-input-wrap" key={index}>
                                <div className="alert-input-label">{inputEle.label} : </div>
                                <div className="alert-input">
                                    <input
                                        type={inputEle.type}
                                        name=""
                                        id=""
                                        defaultValue={Number(inputEle.value)}
                                        onChange={inputEle.onChangeFunc}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer btn-wrap">
                        {btn2 && <div className='btn alert-cancel-btn' onClick={btn2.btnFunc}>{btn2.btnText}</div>}
                        {btn1 && <div className='btn alert-submit-btn' onClick={btn1.btnFunc}>{btn1.btnText}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Alert;

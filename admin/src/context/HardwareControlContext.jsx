/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const HardwareControlContext = createContext();

const HardwareControlContextProvider = (props) => {
    const [unghiManualOrizontal, setUnghiManualOrizontal] = useState(90);
    const [unghiManualVertical, setUnghiManualVertical] = useState(90);

    const trimiteComandaMiscare = async (axa, directie) => {
        try {
            if (axa === 'orizontal') {
                setUnghiManualOrizontal(prev => directie === 'plus' ? Math.min(prev + 5, 165) : Math.max(prev - 5, 15));
            } else if (axa === 'vertical') {
                setUnghiManualVertical(prev => directie === 'plus' ? Math.min(prev + 5, 165) : Math.max(prev - 5, 15));
            }
            toast.success("Comandă orientare trimisă!");
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        unghiManualOrizontal,
        unghiManualVertical,
        trimiteComandaMiscare
    };

    return (
        <HardwareControlContext.Provider value={value}>
            {props.children}
        </HardwareControlContext.Provider>
    );
};

export default HardwareControlContextProvider;
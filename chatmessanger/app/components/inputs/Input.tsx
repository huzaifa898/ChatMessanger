'use client';
import clsx from 'clsx';
import {
    FieldErrors,
    FieldValues,
    UseFormRegister
} from 'react-hook-form';

interface InputProps {
    label : string;
    id: string;
    type?: string;
    required?: boolean;
    error: FieldErrors;
    register: UseFormRegister<FieldValues>;
    disabled?: boolean;
}
const Input : React.FC<InputProps> = ({
    label,
    id,
    type ,
    required,
    error,
    register,
    disabled
}) =>{
    return (
        <div>
           <label 
           className='block text-sm font-medium leading-6 text-gray-700'
           htmlFor={id}>
            {label}
           </label>
           <div className='mt-1'>
                <input 
                id={id}
                type={type}
                autoComplete='{id}'
                disabled={disabled}
                {...register(id ,{required})}
                className={clsx(`
                    form-input
                    block
                    w-full
                    rounded-md
                    border-0
                    py-1.5
                    text-gray-900
                    shadow-sm
                    ring-1
                    ring-inset
                    ring-gray-300
                    placeholder:text-gray-500
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-indigo-500
                    sm:text-sm
                    sm:leading-6` , 
                    error[id] ? 'ring-red-500' : 'ring-gray-300',
                    disabled ? 'bg-gray-100' : 'bg-white'
                )} 
                />
           </div>
        </div>
    )
}
export default Input;
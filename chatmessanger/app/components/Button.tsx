'use client';
import clsx from "clsx";

interface ButtonProps { 
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;  // ✅ Fixed typo from "fullWith" to "fullWidth"
    children: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    type = "button",
    fullWidth, 
    onClick,
    secondary,
    danger,
    disabled,
    children
}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={clsx(
                "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
                fullWidth && "w-full",
                disabled && "opacity-50 cursor-not-allowed",
                secondary 
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-400" 
                    : danger 
                        ? "bg-rose-500 text-white hover:bg-rose-600 focus-visible:outline-rose-500"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-500"
            )}
        >
            {children}
        </button>
    );
}

export default Button;

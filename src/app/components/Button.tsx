import React from 'react';

interface ButtonProps {
	text: string;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({ text, className }) => {
	return (
		<button
			className={`py-3 px-6 rounded-lg text-white font-semibold shadow-md hover:bg-opacity-90 transition ${className}`}>
			{text}
		</button>
	);
};

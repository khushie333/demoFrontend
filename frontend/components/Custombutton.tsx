import { CustombuttonProps } from '@/types'
import Image from 'next/image'
import React from 'react'

const Custombutton = ({
	title,
	btnType,
	handleClick,
	containerStyles,
	textStyles,
	rightIcon,
}: CustombuttonProps) => {
	return (
		<>
			<button
				type={btnType || 'button'}
				onClick={handleClick}
				className={`custom-btn ${containerStyles} `}
				disabled={false}
			>
				<span className={`flex-1 ${textStyles}`}>{title}</span>
				{rightIcon && (
					<div className='relative w-6 h-6'>
						<Image
							src={rightIcon}
							alt='arrow_left'
							fill
							className='object-contain'
						/>
					</div>
				)}
			</button>
		</>
	)
}

export default Custombutton

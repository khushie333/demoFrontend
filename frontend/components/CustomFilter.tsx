'use client'
import { useState, Fragment } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Listbox, Transition } from '@headlessui/react'
import { CustomFilterProps } from '@/types'
import { updateSearchParams } from '@/utils'

const CustomFilter = ({ title, options }: CustomFilterProps) => {
	const router = useRouter()
	const [selected, setSelected] = useState(options[0]?.baseAmount)
	const handleUpdateParams = (e: any) => {
		if (e !== undefined) {
			const newPathname = updateSearchParams(title, e.toString())
			router.push(newPathname, { scroll: false })
		}
		console.log(e)
	}

	return (
		<div className='w-fit'>
			<Listbox
				value={selected}
				onChange={(e) => {
					setSelected(e)
					handleUpdateParams(e)
				}}
			>
				<div className='relative w-fit z-10'>
					<Listbox.Button className='custom-filter__btn'>
						<span className='block truncate'> {selected}</span>
						<Image
							src='/chevron-up-down.svg'
							width={20}
							height={20}
							alt='filter'
						></Image>
					</Listbox.Button>
					<Transition
						as={Fragment} // group multiple elements without introducing an additional DOM node i.e., <></>
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Listbox.Options className='custom-filter__options'>
							{/* Map over the options and display them as listbox options */}
							{options.map((option: any) => (
								<Listbox.Option
									key={option._id}
									className={({ active }) =>
										`relative cursor-default select-none py-2 px-4 ${
											active ? 'bg-primary-blue text-white' : 'text-gray-900'
										}`
									}
									value={option}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate ${
													selected ? 'font-medium' : 'font-normal'
												}`}
											>
												{option}
											</span>
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	)
}

export default CustomFilter

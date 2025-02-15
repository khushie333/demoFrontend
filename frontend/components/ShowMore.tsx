import { useRouter } from 'next/navigation'

// import { ShowMoreProps } from '@/types'
import { updateSearchParams } from '@/utils'
import Custombutton from './Custombutton'
export interface ShowMoreProps {
	pageNumber: number
	isNext: boolean
}
const ShowMore = ({ pageNumber, isNext }: ShowMoreProps) => {
	const router = useRouter()

	const handleNavigation = () => {
		// Calculate the new limit based on the page number and navigation type
		const newLimit = (pageNumber + 1) * 6

		// Update the "limit" search parameter in the URL with the new value
		const newPathname = updateSearchParams('limit', `${newLimit}`)

		router.push(newPathname, { scroll: false })
	}
	console.log(isNext)
	return (
		<div className='w-full flex-center gap-5 mt-10'>
			{!isNext && (
				<Custombutton
					btnType='button'
					title='Show More'
					containerStyles='bg-primary-blue rounded-full text-white'
					handleClick={handleNavigation}
				/>
			)}
		</div>
	)
}

export default ShowMore

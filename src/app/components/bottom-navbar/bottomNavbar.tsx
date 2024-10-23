import { useState } from 'react'
import './bottomBar.scss'
import { CheckSquareOffset, ClipboardText, Trash } from '@phosphor-icons/react'

/**
 * View - The three possible views for the BottomNavbar component.
 */
export type View = 'pending' | 'completed' | 'deleted'

/**
 * BottomNavbar Component - A navigation bar that allows switching between
 * three views: Pending, Completed, and Deleted Tasks.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {() => void} props.showHome - Function to display the pending tasks view.
 * @param {() => void} props.showCompleted - Function to display the completed tasks view.
 * @param {() => void} props.showDeleted - Function to display the deleted tasks view.
 *
 * @returns {JSX.Element} The rendered BottomNavbar component.
 */
export default function BottomNavbar({
	showHome,
	showCompleted,
	showDeleted
}: {
	showHome: () => void
	showCompleted: () => void
	showDeleted: () => void
}) {
	const [activeView, setActiveView] = useState<View>('pending') // State to store the active view

	/**
	 * Handles the click for any of the three navigation bar buttons and allows to disable the one corresponding to the active active view later.
	 *
	 * @param {string} view - The name of the view to set as active.
	 * @param {() => void} action - The function to call when setting a view as active.
	 */
	const handleClick = (view: View, action: () => void) => {
		if (view !== activeView) {
			setActiveView(view)
			action()
		}
	}

	return (
		<nav className="bottomNavBar">
			<button
				className="icon-button"
				onClick={() => handleClick('pending', showHome)}
				disabled={activeView === 'pending'}
				style={{
					border: '2px solid #ffffff',
					borderRadius: '8px',
					padding: '10px',
					backgroundColor: 'transparent',
					transition: 'transform 0.2s ease-in-out'
				}}
				onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
				onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
			>
				<ClipboardText color="#ffffff" size={48} weight="bold" />
			</button>

			<button
				className="icon-button"
				onClick={() => handleClick('completed', showCompleted)}
				disabled={activeView === 'completed'}
				style={{
					border: '2px solid #ffffff',
					borderRadius: '8px',
					padding: '10px',
					backgroundColor: 'transparent',
					transition: 'transform 0.2s ease-in-out'
				}}
				onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
				onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
			>
				<CheckSquareOffset color="#ffffff" size={48} weight="bold" />
			</button>

			<button
				className="icon-button"
				onClick={() => handleClick('deleted', showDeleted)}
				disabled={activeView === 'deleted'}
				style={{
					border: '2px solid #ffffff',
					borderRadius: '8px',
					padding: '10px',
					backgroundColor: 'transparent',
					transition: 'transform 0.2s ease-in-out'
				}}
				onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
				onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
			>
				<Trash color="#ffffff" size={48} weight="bold" />
			</button>
		</nav>
	)
}

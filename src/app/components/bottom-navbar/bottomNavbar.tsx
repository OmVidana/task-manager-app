import { useState } from 'react'
import './bottomBar.scss'
import { CheckSquareOffset, ClipboardText, Trash } from '@phosphor-icons/react'

export default function BottomNavbar({
	showHome,
	showCompleted,
	showDeleted
}: {
	showHome: () => void
	showCompleted: () => void
	showDeleted: () => void
}) {
	const [activeView, setActiveView] = useState('pending')

	const handleClick = (view: string, action: () => void) => {
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
					transition: 'transform 0.2s ease-in-out',
				}}
				onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
				onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
					transition: 'transform 0.2s ease-in-out',
				}}
				onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
				onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
					transition: 'transform 0.2s ease-in-out',
				}}
				onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
				onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
			>
				<Trash color="#ffffff" size={48} weight="bold" />
			</button>

		</nav>
	)
}

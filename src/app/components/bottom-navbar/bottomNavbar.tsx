import { useState } from 'react'
import styles from './bottomNavbar.module.scss'

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
		<nav>
			<button onClick={() => handleClick('pending', showHome)} disabled={activeView === 'pending'}>
				Home
			</button>
			<button onClick={() => handleClick('completed', showCompleted)} disabled={activeView === 'completed'}>
				Completed
			</button>
			<button onClick={() => handleClick('deleted', showDeleted)} disabled={activeView === 'deleted'}>
				Trashbin
			</button>
		</nav>
	)
}

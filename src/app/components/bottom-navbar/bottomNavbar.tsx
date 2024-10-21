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
		<nav className="">
			<button className="" onClick={() => handleClick('pending', showHome)} disabled={activeView === 'pending'}>
				<ClipboardText color="#ffffff" size={48} weight="bold" />
				Home
			</button>
			<button onClick={() => handleClick('completed', showCompleted)} disabled={activeView === 'completed'}>
				<CheckSquareOffset color="#ffffff" size={48} weight="bold" />
				Completed
			</button>
			<button onClick={() => handleClick('deleted', showDeleted)} disabled={activeView === 'deleted'}>
				<Trash color="#ffffff" size={48} weight="bold" />
				Deleted
			</button>
		</nav>
	)
}

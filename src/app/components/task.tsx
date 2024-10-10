import { useState } from 'react'
import styles from '@styles/components/task.module.scss'

type TaskProps = {
	title: string
	description: string
	isCompleted: boolean
	isDeleted: boolean
	onUpdate: (title: string, description: string) => void
	onComplete: () => void
	onDelete: () => void
	onRestore: () => void
}

export default function Task(props: TaskProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [taskTitle, setTaskTitle] = useState(props.title)
	const [taskDescription, setTaskDescription] = useState(props.description)

	const updateTask = () => {
		props.onUpdate(taskTitle, taskDescription)
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			updateTask()
		} else if (e.key === 'Escape') {
			setIsEditing(false)
		}
	}

	const taskClassNames = `${props.isDeleted ? styles.deleted : ''} ${props.isCompleted ? styles.completed : ''}`.trim()

	return (
		<div className={styles.task}>
			{!props.isDeleted && <input type="checkbox" checked={props.isCompleted} onChange={props.onComplete} />}
			{isEditing ? (
				<>
					<input
						type="text"
						value={taskTitle}
						placeholder="Task name"
						onChange={(e) => setTaskTitle(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<input
						type="text"
						value={taskDescription}
						placeholder="Write your task details here:"
						onChange={(e) => setTaskDescription(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button onClick={updateTask}>Save</button>
				</>
			) : (
				<>
					<h3 onClick={() => setIsEditing(true)}>{taskTitle}</h3>
					<p onClick={() => setIsEditing(true)}>{taskDescription}</p>
				</>
			)}
			{props.isDeleted ? (
				<>
					<input type="button" value={'Delete'} onClick={props.onDelete} />
					<input type="button" value={'Restore'} onClick={props.onRestore} />
				</>
			) : (
				<input type="button" value={'Delete'} onClick={props.onDelete} />
			)}
		</div>
	)
}

export type TaskElement = {
	id: number
	title: string
	description: string
	isCompleted: boolean
	isDeleted: boolean
}

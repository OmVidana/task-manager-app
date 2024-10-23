import { useEffect, useState } from 'react'
import './task.scss'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import { Pencil, TrashSimple } from '@phosphor-icons/react'

type TaskProps = {
	title: string
	description: string
	isCompleted: boolean
	isDeleted: boolean
	priority: number
	completionDate: Date
	onUpdate: (title: string, description: string, priority: number, completionDate: Date) => void
	onComplete: () => void
	onDelete: () => void
	onRestore: () => void
}

export default function Task(props: TaskProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [taskTitle, setTaskTitle] = useState(props.title)
	const [taskPriority, setTaskPriority] = useState(props.priority)
	const [taskDescription, setTaskDescription] = useState(props.description)
	const [taskCompletionDate, setTaskCompletionDate] = useState(props.completionDate)

	useEffect(() => {
		if (isEditing) {
			setTaskTitle(props.title)
			setTaskDescription(props.description)
			setTaskPriority(props.priority)
			setTaskCompletionDate(props.completionDate)
		}
	}, [isEditing, props])

	const updateTask = () => {
		props.onUpdate(taskTitle, taskDescription, taskPriority, taskCompletionDate)
		setIsEditing(false)
	}

	const restoreTask = () => {
		setTaskTitle(props.title)
		setTaskDescription(props.description)
		setTaskPriority(props.priority)
		setTaskCompletionDate(props.completionDate)
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			updateTask()
		} else if (e.key === 'Escape') {
			setIsEditing(false)
		}
	}

	const priority = ['Low', 'Medium', 'High', 'Critical']
	// Si se requieren estilos de tearea al borrar y completar
	const taskClassNames = `${props.isDeleted ? 'taskDeleted' : ''} ${props.isCompleted ? 'taskCompleted' : ''}`.trim()

	return (
		<div className='task'>
			<div className='task2'>
				{!isEditing && (
					<button className='edit-button' onClick={() => setIsEditing(true)}>
						<Pencil size={18} weight="bold" />
					</button>
				)}
				<h3>{taskTitle}</h3>
				<input type="checkbox" className='custom-checkbox' checked={props.isCompleted} onChange={props.onComplete} />
			</div>
			{isEditing ? (
				<>
					<input
						type="text"
						value={taskTitle}
						placeholder="Title Here"
						onChange={(e) => setTaskTitle(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<div>
						<DatePicker
							selected={taskCompletionDate}
							onChange={(date) => setTaskCompletionDate(date!)}
							showTimeSelect
							timeFormat="HH:mm:ss"
							timeIntervals={5}
							timeCaption="time"
							dateFormat="MMMM d, yyyy h:mm:ss aa"
						/>
					</div>
					<div>
						<label>Priority:</label>
						<select value={taskPriority} onChange={(e) => setTaskPriority(Number(e.target.value))}>
							{priority.map((label, index) => (
								<option key={index} value={index}>
									{label}
								</option>
							))}
						</select>
					</div>
					<input
						type="text"
						value={taskDescription}
						placeholder="Write your task details here:"
						onChange={(e) => setTaskDescription(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button onClick={updateTask}>Save</button>
					<button onClick={restoreTask}>Cancel</button>
				</>
			) : (
				<>
					<div>
						<p>Due: {format(taskCompletionDate, 'MMMM d, yyyy h:mm:ss aa')}</p>
						<p>Priority: {priority[taskPriority]}</p>
					</div>
					<p>{taskDescription}</p>
					{props.isDeleted ? (
						<>
							<button onClick={props.onDelete}>Delete</button>
							<button onClick={props.onRestore}>Restore</button>
						</>
					) : (
						<div className='center-button'>
							<button className='edit-button2' onClick={props.onDelete}>
								<TrashSimple color="#ffffff" size={24} weight="bold" />
							</button>
						</div>
					)}
				</>
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
	priority: number
	completionDate: Date
}

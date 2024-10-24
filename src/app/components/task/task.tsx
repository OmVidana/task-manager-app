import { useEffect, useState } from 'react'
import './task.scss'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import { Pencil, TrashSimple } from '@phosphor-icons/react'

/**
 * Props for the Task component.
 */
type TaskProps = {
	tabIndex?: number
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

/**
 * Task Component - Creates a single task with the ability to edit, delete, complete, or restore it.
 *
 * @param {TaskProps} props - Component props.
 * @returns {JSX.Element} The rendered Task component.
 */
export default function Task(props: TaskProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [taskTitle, setTaskTitle] = useState(props.title)
	const [taskPriority, setTaskPriority] = useState(props.priority)
	const [taskDescription, setTaskDescription] = useState(props.description)
	const [taskCompletionDate, setTaskCompletionDate] = useState(props.completionDate)

	/**
	 * Sync of edition and changes
	 */
	useEffect(() => {
		if (isEditing) {
			setTaskTitle(props.title)
			setTaskDescription(props.description)
			setTaskPriority(props.priority)
			setTaskCompletionDate(props.completionDate)
		}
	}, [isEditing, props])

	/**
	 * Update the task with the current input values and close the editing mode.
	 */
	const updateTask = () => {
		props.onUpdate(taskTitle, taskDescription, taskPriority, taskCompletionDate)
		setIsEditing(false)
	}

	/**
	 * Restore the task to its original state.
	 */
	const restoreTask = () => {
		setTaskTitle(props.title)
		setTaskDescription(props.description)
		setTaskPriority(props.priority)
		setTaskCompletionDate(props.completionDate)
		setIsEditing(false)
	}

	//WIP
	/**
	 * Handle key events during editing to save or cancel on Enter or Escape.
	 *
	 * @param {React.KeyboardEvent<HTMLInputElement>} e - The key event.
	 */

	const priority = ['Low', 'Medium', 'High', 'Critical']
	// Si se requieren estilos de tearea al borrar y completar
	const taskClassNames = `${props.isDeleted ? 'taskDeleted' : ''} ${props.isCompleted ? 'taskCompleted' : ''}`.trim()

	/**
	 * Handles keyboard events for task actions.
	 *
	 * @param event - The keyboard event triggered by user interaction.
	 *
	 * If the task is in editing mode:
	 * - Pressing 'Enter' will update the task.
	 * - Pressing 'Escape' will restore the task to its previous state.
	 *
	 * If the task is not in editing mode:
	 * - Pressing 'E' will enable editing mode.
	 * - Pressing 'D' will delete the task.
	 * - Pressing 'C' will mark the task as complete.
	 */
	const handleKey = (event: React.KeyboardEvent) => {
		if (isEditing) {
			if (event.code === 'Enter') updateTask()
			if (event.code === 'Escape') restoreTask()
		} else {
			switch (event.code) {
				case 'KeyE':
					setIsEditing(true)
					break
				case 'KeyD':
					props.onDelete()
					break
				case 'KeyC':
					props.onComplete()
					break
			}
		}
	}

	/**
	 * Focus the root div when clicking on the task. Allows keyboard events to be triggered.
	 *
	 * @param event - The mouse event triggered by clicking the div element.
	 */
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		event.currentTarget.focus()
	}

	return (
		<div className="task selected" tabIndex={props.tabIndex} onClick={handleClick} onKeyDown={handleKey}>
			<div className="task2">
				{!isEditing && (
					<button className="edit-button" onClick={() => setIsEditing(true)} title="Press 'E' to edit">
						<Pencil size={18} weight="bold" />
					</button>
				)}
				<h3>{taskTitle}</h3>
				<input
					type="checkbox"
					className="custom-checkbox"
					checked={props.isCompleted}
					onChange={props.onComplete}
					title="Press 'C' to toggle complete"
				/>
			</div>
			{isEditing ? (
				<>
					<div className="input-container">
						<label className="title-editor">Edit the Title:</label>
						<input
							type="text"
							value={taskTitle}
							placeholder="Title Here"
							onChange={(e) => setTaskTitle(e.target.value)}
							className="input-field"
							onClick={(e) => e.stopPropagation()}
						/>
					</div>

					<div className="date-picker-container">
						<label className="title-editor">Edit the Date:</label>
						<DatePicker
							selected={taskCompletionDate}
							onChange={(date) => setTaskCompletionDate(date!)}
							showTimeSelect
							timeFormat="HH:mm:ss"
							timeIntervals={5}
							timeCaption="time"
							dateFormat="MMMM d, yyyy h:mm:ss aa"
							wrapperClassName="input-field"
						/>
					</div>

					<div className="select-container">
						<label className="title-editor">Edit Priority:</label>
						<select
							value={taskPriority}
							onChange={(e) => setTaskPriority(Number(e.target.value))}
							className="input-field"
							onClick={(e) => e.stopPropagation()}
						>
							{priority.map((label, index) => (
								<option key={index} value={index}>
									{label}
								</option>
							))}
						</select>
					</div>

					<div className="input-container">
						<label className="title-editor">Description:</label>
						<input
							type="text"
							value={taskDescription}
							placeholder="Write your task details here:"
							onChange={(e) => setTaskDescription(e.target.value)}
							className="input-field"
							onClick={(e) => e.stopPropagation()}
						/>
					</div>

					<br />
					<div className="button-container">
						<button className="action-button" onClick={updateTask} title="Press 'Enter' to save">
							Save
						</button>
						<button className="action-button" onClick={restoreTask} title="Press 'Escape' to cancel">
							Cancel
						</button>
					</div>
				</>
			) : (
				<>
					<div>
						<p>
							<strong>Due:</strong> {format(taskCompletionDate, 'MMMM d, yyyy h:mm:ss aa')}
						</p>
						<p>
							<strong>Priority:</strong> {priority[taskPriority]}
						</p>
					</div>
					<p>
						<strong>{taskDescription}</strong>
					</p>
					{props.isDeleted ? (
						<>
							<div className="button-container">
								<button className="action-button" onClick={props.onDelete}>
									Delete
								</button>
								<button className="action-button" onClick={props.onRestore}>
									Restore
								</button>
							</div>
						</>
					) : (
						<div className="center-button">
							<button className="edit-button2" onClick={props.onDelete} title="Press 'D' to delete">
								<TrashSimple size={24} weight="bold" />
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}

/**
 * TaskElement - Type for using Tasks.
 */
export type TaskElement = {
	id: number
	title: string
	description: string
	isCompleted: boolean
	isDeleted: boolean
	priority: number
	completionDate: Date
}

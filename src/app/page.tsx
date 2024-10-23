'use client'
import { useEffect, useState } from 'react'
import Task, { TaskElement } from '@/app/components/task/task'
import BottomNavbar from '@/app/components/bottom-navbar/bottomNavbar'
import './page.scss'
import { Moon, Plus, Sun } from '@phosphor-icons/react'

const SAVED_TASKS_KEY = 'saved-tasks'
const SAVED_THEME_KEY = 'referred-theme'

type TaskDictionary = {
	[id: number]: TaskElement
}

type SortMethods = 'priority' | 'date' | 'name'
type SortOrders = 0 | 1 // 0: Descending, 1: Ascending

export default function Home() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')
	const [currentView, setCurrentView] = useState('pending')
	const [pendingTasks, setPendingTasks] = useState<TaskDictionary>({})
	const [completedTasks, setCompletedTasks] = useState<TaskDictionary>({})
	const [deletedTasks, setDeletedTasks] = useState<TaskDictionary>({})
	const [taskId, setTaskId] = useState(1)
	const [sortMethod, setSortMethod] = useState<SortMethods>('name')
	const [sortOrder, setSortOrder] = useState<SortOrders>(0)

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		localStorage.setItem(SAVED_THEME_KEY, newTheme)
		document.documentElement.setAttribute('data-theme', newTheme)
	}

	const addTask = () => {
		const id = taskId
		const date = new Date()

		const newTask: TaskElement = {
			id: id,
			title: `Task #${id}`,
			description: 'Escribe una descripción',
			isCompleted: false,
			isDeleted: false,
			priority: 0,
			completionDate: date
		}
		setPendingTasks({ ...pendingTasks, [newTask.id]: newTask })
		console.log(pendingTasks)
		setTaskId(id + 1)
	}

	const updateTask = (id: number, title: string, description: string, priority: number, completionDate: Date) => {
		if (pendingTasks[id]) {
			setPendingTasks({
				...pendingTasks,
				[id]: { ...pendingTasks[id], title, description, priority, completionDate }
			})
		} else if (completedTasks[id]) {
			setCompletedTasks({
				...completedTasks,
				[id]: { ...completedTasks[id], title, description, priority, completionDate }
			})
		} else if (deletedTasks[id]) {
			setDeletedTasks({
				...deletedTasks,
				[id]: { ...deletedTasks[id], title, description, priority, completionDate }
			})
		}
	}

	const toggleCompleteTask = (id: number) => {
		if (pendingTasks[id] && !pendingTasks[id].isDeleted) {
			const updatedTask = { ...pendingTasks[id], isCompleted: true }
			const updatedPendingTasks = { ...pendingTasks }

			delete updatedPendingTasks[id]
			setPendingTasks(updatedPendingTasks)
			setCompletedTasks({
				...completedTasks,
				[id]: updatedTask
			})
		} else if (completedTasks[id] && !completedTasks[id].isDeleted) {
			const updatedTask = { ...completedTasks[id], isCompleted: false }
			const updatedCompletedTasks = { ...completedTasks }

			delete updatedCompletedTasks[id]
			setCompletedTasks(updatedCompletedTasks)
			setPendingTasks({
				...pendingTasks,
				[id]: updatedTask
			})
		}
	}

	const deleteTask = (id: number) => {
		const taskToDelete = pendingTasks[id] || completedTasks[id]
		if (taskToDelete) {
			if (taskToDelete.isCompleted) {
				const updatedCompletedTasks = { ...completedTasks }
				delete updatedCompletedTasks[id]
				setCompletedTasks(updatedCompletedTasks)
			} else {
				const updatedPendingTasks = { ...pendingTasks }
				delete updatedPendingTasks[id]
				setPendingTasks(updatedPendingTasks)
			}

			setDeletedTasks({
				...deletedTasks,
				[id]: { ...taskToDelete, isDeleted: true }
			})
		} else {
			const updatedDeletedTasks = { ...deletedTasks }
			delete updatedDeletedTasks[id]
			setDeletedTasks(updatedDeletedTasks)
		}
	}

	const restoreTask = (id: number) => {
		const taskToRestore = deletedTasks[id]
		if (taskToRestore) {
			const updatedDeletedTasks = { ...deletedTasks }
			delete updatedDeletedTasks[id]
			setDeletedTasks(updatedDeletedTasks)
			if (taskToRestore.isCompleted) {
				setCompletedTasks({
					...completedTasks,
					[id]: { ...taskToRestore, isDeleted: false }
				})
				return
			} else {
				setPendingTasks({
					...pendingTasks,
					[id]: { ...taskToRestore, isDeleted: false }
				})
			}
		}
	}

	const sortTasks = (tasks: TaskElement[]) => {
		return tasks.sort((a, b) => {
			switch (sortMethod) {
				case 'date':
					return sortOrder === 1
						? a.completionDate.getTime() - b.completionDate.getTime()
						: b.completionDate.getTime() - a.completionDate.getTime()
				case 'name':
					return sortOrder === 1 ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
				case 'priority':
					return sortOrder === 1 ? a.priority - b.priority : b.priority - a.priority
				default:
					return sortOrder === 1 ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
			}
		})
	}

	const showHome = () => setCurrentView('pending')
	const showCompleted = () => setCurrentView('completed')
	const showDeleted = () => setCurrentView('deleted')

	const displayTasks = () => {
		let tasks: TaskElement[] = []
		switch (currentView) {
			case 'completed':
				tasks = Object.values(completedTasks)
				break
			case 'deleted':
				tasks = Object.values(deletedTasks)
				break
			default:
				tasks = Object.values(pendingTasks)
				break
		}
		return sortTasks(tasks)
	}

	useEffect(() => {
		let savedTheme = localStorage.getItem(SAVED_THEME_KEY)
		const savedTasks = localStorage.getItem(SAVED_TASKS_KEY)

		if (!savedTheme) {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			savedTheme = prefersDark ? 'dark' : 'light'
		}

		if (savedTasks) {
			const { pending, completed, deleted, id } = JSON.parse(savedTasks)
			setPendingTasks(pending || {})
			setCompletedTasks(completed || {})
			setDeletedTasks(deleted || {})
			setTaskId(id || 1)
		}

		setTheme(savedTheme as 'light' | 'dark')
		document.documentElement.setAttribute('data-theme', savedTheme)
	}, [])

	useEffect(() => {
		const tasksToSave = {
			pending: pendingTasks,
			completed: completedTasks,
			deleted: deletedTasks,
			id: taskId
		}
		localStorage.setItem(SAVED_TASKS_KEY, JSON.stringify(tasksToSave))
	}, [pendingTasks, completedTasks, deletedTasks, taskId])

	return (
		<div className="page">
			<div className="Puzzle-root ">
				<button className='addTask' onClick={addTask} disabled={currentView !== 'pending'} style={{
					border: '2px solid #ffffff',
					borderRadius: '8px',
					padding: '10px',
					backgroundColor: 'transparent',
					transition: 'transform 0.2s ease-in-out',
				}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
					onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
					<Plus color="#ffffff" size={28} weight="bold" />
				</button>
				<h1>Task Manager</h1>
				<button onClick={toggleTheme} style={{
					border: '2px solid #ffffff',
					borderRadius: '8px',
					padding: '10px',
					backgroundColor: 'transparent',
					transition: 'transform 0.2s ease-in-out',
				}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
					onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
					{theme === 'light' ? (
						<Sun color="#ffffff" size={28} weight="bold" />
					) : (
						<Moon color="#ffffff" size={28} weight="bold" />
					)}
				</button>
			</div>
			<br />
			<div className="task-container">
				<div className="task-controls">
					<label>Sort by: </label>
					<select value={sortMethod} onChange={(e) => setSortMethod(e.target.value as SortMethods)}>
						<option value="date">Completion Date</option>
						<option value="name">Name</option>
						<option value="priority">Priority</option>
					</select>
					<label>Order: </label>
					<select value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value) as SortOrders)}>
						<option value={0}>Descending</option>
						<option value={1}>Ascending</option>
					</select>
				</div>
				<div className="task-list">
					{displayTasks().map((task) => (
						<Task
							key={task.id}
							{...task}
							onUpdate={(title, description, priority, completionDate) =>
								updateTask(task.id, title, description, priority, completionDate)
							}
							onComplete={() => toggleCompleteTask(task.id)}
							onDelete={() => deleteTask(task.id)}
							onRestore={() => restoreTask(task.id)}
						/>
					))}
				</div>
			</div>
			<br />
			<BottomNavbar showHome={showHome} showCompleted={showCompleted} showDeleted={showDeleted} />
		</div>
	)
}

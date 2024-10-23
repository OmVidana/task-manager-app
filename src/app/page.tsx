'use client'
//WIP Missing Key controls
import { useEffect, useState } from 'react'
import Task, { TaskElement } from '@/app/components/task/task'
import BottomNavbar, { View } from '@/app/components/bottom-navbar/bottomNavbar'
import './page.scss'
import { Moon, Plus, Sun } from '@phosphor-icons/react'

// Local Storage Keys
const NEXT_TASK_KEY = 'next-tasks'
const PENDING_TASKS_KEY = 'pending-tasks'
const COMPLETED_TASKS_KEY = 'completed-tasks'
const DELETED_TASKS_KEY = 'deleted-tasks'
const SAVED_THEME_KEY = 'referred-theme'

/** Dictionary to store tasks using their IDs as keys.*/
type TaskDictionary = {
	[id: number]: TaskElement
}

/**
 * Parses raw tasks from localStorage and converts them into a TaskDictionary.
 * @param {string | null} rawTasks - The raw stringified tasks from localStorage.
 * @returns {TaskDictionary} - A parsed task dictionary.
 */

function parseTasks(rawTasks: string | null): TaskDictionary {
	if (!rawTasks) return {}
	const parsed: TaskDictionary = JSON.parse(rawTasks)

	for (const key in parsed) {
		parsed[key].completionDate = new Date(parsed[key].completionDate)
	}
	return parsed
}
/** Theme options for the application.*/
type Theme = 'light' | 'dark'
/** Sorting methods for tasks.*/
type SortMethods = 'priority' | 'date' | 'name'
/**
 * Sorting orders for tasks.
 * 0 - Descending. 1 - Ascending.
 */
type SortOrders = 0 | 1

/**
 * Home Component - Home page of the application.
 * Handles theme switching, task manipulation and storage.
 *
 * @component
 * @returns {JSX.Element} - The rendered Home component.
 */
export default function Home() {
	const [theme, setTheme] = useState<Theme>('light')
	const [currentView, setCurrentView] = useState<View>('pending')
	const [pendingTasks, setPendingTasks] = useState<TaskDictionary>({})
	const [completedTasks, setCompletedTasks] = useState<TaskDictionary>({})
	const [deletedTasks, setDeletedTasks] = useState<TaskDictionary>({})
	const [taskId, setTaskId] = useState(1)
	const [sortMethod, setSortMethod] = useState<SortMethods>('name')
	const [sortOrder, setSortOrder] = useState<SortOrders>(0)

	/**
	 * Handles keyboard events to perform general actions.
	 *
	 * @param {React.KeyboardEvent} event - The keyboard event object.
	 *
	 * Key mappings:
	 * - 'KeyT': Adds a new task if the current view is 'pending'.
	 * - 'KeyS': Toggles the theme between light and dark.
	 * - 'Digit1': Sets the current view to 'pending'.
	 * - 'Digit2': Sets the current view to 'completed'.
	 * - 'Digit3': Sets the current view to 'deleted'.
	 */
	const handleKey = (event: React.KeyboardEvent) => {
		switch (event.code) {
			case 'KeyT':
				if (currentView === 'pending') addTask()
				break
			case 'KeyS':
				toggleTheme()
				break
			case 'Digit1':
				setCurrentView('pending')
				break
			case 'Digit2':
				setCurrentView('completed')
				break
			case 'Digit3':
				setCurrentView('deleted')
				break
		}
	}

	/**
	 * Toggles the current theme between light and dark.
	 */
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		localStorage.setItem(SAVED_THEME_KEY, newTheme)
		setTheme(newTheme)
	}

	/**
	 * Adds a new task to the pending tasks.
	 */
	const addTask = () => {
		const date = new Date()

		const newTask: TaskElement = {
			id: taskId,
			title: `Task #${taskId}`,
			description: 'Escribe una descripción',
			isCompleted: false,
			isDeleted: false,
			priority: 0,
			completionDate: date
		}
		setPendingTasks((prevPendingTasks) => {
			const updatedPendingTasks = { ...prevPendingTasks, [newTask.id]: newTask }
			localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updatedPendingTasks))
			return updatedPendingTasks
		})
		setTaskId((prevTaskId) => {
			const newTaskId = prevTaskId + 1
			localStorage.setItem(NEXT_TASK_KEY, newTaskId.toString())
			return newTaskId
		})
	}

	/**
	 * Updates a task with the provided values.
	 *
	 * @param {number} id - The ID of the task to update.
	 * @param {string} title - The new title of the task.
	 * @param {string} description - The new description of the task.
	 * @param {number} priority - The new priority of the task.
	 * @param {Date} completionDate - The new completion date of the task.
	 */
	const updateTask = (id: number, title: string, description: string, priority: number, completionDate: Date) => {
		if (pendingTasks[id]) {
			setPendingTasks((prevPendingTasks) => {
				const updatedPendingTasks = {
					...prevPendingTasks,
					[id]: { ...pendingTasks[id], title, description, priority, completionDate }
				}
				localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updatedPendingTasks))
				return updatedPendingTasks
			})
		} else if (completedTasks[id]) {
			setCompletedTasks((prevCompletedTasks) => {
				const updatedCompletedTasks = {
					...prevCompletedTasks,
					[id]: { ...completedTasks[id], title, description, priority, completionDate }
				}
				localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompletedTasks))
				return updatedCompletedTasks
			})
		} else if (deletedTasks[id]) {
			setDeletedTasks((prevDeletedTasks) => {
				const updatedDeletedTasks = {
					...prevDeletedTasks,
					[id]: { ...deletedTasks[id], title, description, priority, completionDate }
				}
				localStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(deletedTasks))
				return updatedDeletedTasks
			})
		}
	}
	/**
	 * Toggles the completion status of a task.
	 * If the task is pending, it will be marked as completed.
	 * If the task is completed, it will be marked as pending.
	 *
	 * @param {number} id - The ID of the task to toggle.
	 */
	const toggleCompleteTask = (id: number) => {
		if (pendingTasks[id] && !pendingTasks[id].isDeleted) {
			const updatedTask = { ...pendingTasks[id], isCompleted: true }

			setPendingTasks((prev) => {
				const updatedPending = { ...prev }
				delete updatedPending[id]
				localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updatedPending))
				return updatedPending
			})

			setCompletedTasks((prev) => {
				const updatedCompleted = { ...prev, [id]: updatedTask }
				localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompleted))
				return updatedCompleted
			})
		} else if (completedTasks[id] && !completedTasks[id].isDeleted) {
			const updatedTask = { ...completedTasks[id], isCompleted: false }

			setCompletedTasks((prev) => {
				const updatedCompleted = { ...prev }
				delete updatedCompleted[id]
				localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompleted))
				return updatedCompleted
			})

			setPendingTasks((prev) => {
				const updatedPending = { ...prev, [id]: updatedTask }
				localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updatedPending))
				return updatedPending
			})
		}
	}

	/**
	 * Deletes a task from the pending or completed tasks.
	 * If the task is pending, it will be moved to the deleted tasks.
	 * If the task is completed, it will be removed from the completed tasks.
	 * If the task is already deleted, it will be removed from the deleted tasks.
	 *
	 * @param {number} id - The ID of the task to delete.
	 */
	const deleteTask = (id: number) => {
		const taskToDelete = pendingTasks[id] || completedTasks[id]
		if (taskToDelete) {
			if (taskToDelete.isCompleted) {
				setCompletedTasks((prev) => {
					const updatedCompleted = { ...prev }
					delete updatedCompleted[id]
					localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompleted))
					return updatedCompleted
				})
			} else {
				setPendingTasks((prev) => {
					const updatedPending = { ...prev }
					delete updatedPending[id]
					localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updatedPending))
					return updatedPending
				})
			}

			setDeletedTasks((prev) => {
				const updatedDeleted = { ...prev, [id]: { ...taskToDelete, isDeleted: true } }
				localStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(updatedDeleted))
				return updatedDeleted
			})
		} else {
			setDeletedTasks((prev) => {
				const updatedDeleted = { ...prev }
				delete updatedDeleted[id]
				localStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(updatedDeleted))
				return updatedDeleted
			})
		}
	}

	/**
	 * Restores a task from the deleted tasks.
	 * If the task was completed, it will be moved to the completed tasks.
	 * If the task was pending, it will be moved to the pending tasks.
	 *
	 * @param {number} id - The ID of the task to restore.
	 */
	const restoreTask = (id: number) => {
		const taskToRestore = deletedTasks[id]
		if (taskToRestore) {
			setDeletedTasks((prev) => {
				const updatedDeleted = { ...prev }
				delete updatedDeleted[id]
				localStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(updatedDeleted))
				return updatedDeleted
			})

			if (taskToRestore.isCompleted) {
				setCompletedTasks((prev) => {
					const updatedCompleted = { ...prev, [id]: { ...taskToRestore, isDeleted: false } }
					localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompleted))
					return updatedCompleted
				})
			} else {
				setPendingTasks((prev) => {
					const updatedPending = { ...prev, [id]: { ...taskToRestore, isDeleted: false } }
					localStorage.setItem(PENDING_TASKS_KEY, JSON.stringify(updatedPending))
					return updatedPending
				})
			}
		}
	}

	/**
	 * Sorts tasks based on the current sort method and order.
	 *
	 * @param {TaskElement[]}
	 * @returns {TaskElement[]} - The sorted tasks.
	 */
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

	// Changes the current view to the pending, completed or deleted tasks.
	const showHome = () => setCurrentView('pending')
	const showCompleted = () => setCurrentView('completed')
	const showDeleted = () => setCurrentView('deleted')

	/**
	 * Displays the tasks based on the current view.
	 *
	 * @returns {TaskElement[]}
	 */
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

	// Load theme and tasks from local storage on first render.
	useEffect(() => {
		const savedTheme = localStorage.getItem(SAVED_THEME_KEY)
		if (savedTheme) {
			setTheme(savedTheme as Theme)
			document.documentElement.setAttribute('data-theme', savedTheme)
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			const systemTheme = prefersDark ? 'dark' : 'light'
			localStorage.setItem(SAVED_THEME_KEY, systemTheme)
			setTheme(systemTheme)
			document.documentElement.setAttribute('data-theme', systemTheme)
		}

		const savedPendingTasks = parseTasks(localStorage.getItem(PENDING_TASKS_KEY))
		const savedCompletedTasks = parseTasks(localStorage.getItem(COMPLETED_TASKS_KEY))
		const savedDeletedTasks = parseTasks(localStorage.getItem(DELETED_TASKS_KEY))
		const savedTaskId = parseInt(localStorage.getItem(NEXT_TASK_KEY)!, 10) || 1

		setPendingTasks(savedPendingTasks)
		setCompletedTasks(savedCompletedTasks)
		setDeletedTasks(savedDeletedTasks)
		setTaskId(savedTaskId)
	}, [])

	// Update the theme on change.
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	return (
		<div className="page" tabIndex={0} autoFocus onKeyDown={handleKey}>
			<div className="Puzzle-root ">
				<button
					className="bottom"
					onClick={addTask}
					disabled={currentView !== 'pending'}
					onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
					onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
				>
					<Plus size={28} weight="bold" />
				</button>
				<h1>Task Manager</h1>
				<button
					className="bottom"
					onClick={toggleTheme}
					onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
					onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
				>
					{theme === 'light' ? <Sun size={28} weight="bold" /> : <Moon size={28} weight="bold" />}
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
					{displayTasks().map((task, index) => (
						<Task
							key={task.id}
							tabIndex={index + 1}
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
			<br />
			<BottomNavbar showHome={showHome} showCompleted={showCompleted} showDeleted={showDeleted} />
		</div>
	)
}

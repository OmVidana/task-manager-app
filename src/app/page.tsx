'use client'
import { useState } from 'react'
import Task, { TaskElement } from '@/app/components/task/task'
import BottomNavbar from '@/app/components/bottom-navbar/bottomNavbar'
import styles from './page.module.scss'

type TaskDictionary = {
	[id: number]: TaskElement
}

export default function Home() {
	const [pendingTasks, setPendingTasks] = useState<TaskDictionary>({})
	const [completedTasks, setCompletedTasks] = useState<TaskDictionary>({})
	const [deletedTasks, setDeletedTasks] = useState<TaskDictionary>({})
	const [taskId, setTaskId] = useState(1)
	const [currentView, setCurrentView] = useState('pending')

	const addTask = () => {
		const id = taskId
		const newTask: TaskElement = {
			id: id,
			title: 'Task name',
			description: 'Write your task details here',
			isCompleted: false,
			isDeleted: false
		}
		setPendingTasks({ ...pendingTasks, [newTask.id]: newTask })
		setTaskId(id + 1)
	}

	const updateTask = (id: number, title: string, description: string) => {
		if (pendingTasks[id]) {
			setPendingTasks({
				...pendingTasks,
				[id]: { ...pendingTasks[id], title, description }
			})
		} else if (completedTasks[id]) {
			setCompletedTasks({
				...completedTasks,
				[id]: { ...completedTasks[id], title, description }
			})
		} else if (deletedTasks[id]) {
			setDeletedTasks({
				...deletedTasks,
				[id]: { ...deletedTasks[id], title, description }
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

	const showHome = () => setCurrentView('pending')
	const showCompleted = () => setCurrentView('completed')
	const showDeleted = () => setCurrentView('deleted')

	const displayTasks = () => {
		switch (currentView) {
			case 'completed':
				return Object.values(completedTasks)
			case 'deleted':
				return Object.values(deletedTasks)
			default:
				return Object.values(pendingTasks)
		}
	}

	return (
		<div className={styles.homeRoot}>
			<div className={styles.homeTitle}>
				<h1>To do App</h1>
			</div>
			<div className={styles.homeContent}>
				{currentView === 'pending' && <button onClick={addTask}>Add Task</button>}
				<div>
					{displayTasks().map((task) => (
						<Task
							key={task.id}
							title={task.title}
							description={task.description}
							isCompleted={task.isCompleted}
							isDeleted={task.isDeleted}
							onUpdate={(title, description) => updateTask(task.id, title, description)}
							onComplete={() => toggleCompleteTask(task.id)}
							onDelete={() => deleteTask(task.id)}
							onRestore={() => restoreTask(task.id)}
						/>
					))}
				</div>
			</div>
			<BottomNavbar showHome={showHome} showCompleted={showCompleted} showDeleted={showDeleted} />
		</div>
	)
}

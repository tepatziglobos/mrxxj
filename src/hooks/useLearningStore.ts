import { useState, useEffect } from 'react';
import { Subject, Task, UserStats } from '../types';
import { DEFAULT_SUBJECTS, LEVEL_TITLES } from '../constants';
import { format } from 'date-fns';

export function useLearningStore() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('learning_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('learning_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalPoints, setTotalPoints] = useState<number>(() => {
    const saved = localStorage.getItem('learning_points');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('learning_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('learning_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('learning_points', totalPoints.toString());
  }, [totalPoints]);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: Math.random().toString(36).substr(2, 9) };
    setSubjects([...subjects, newSubject]);
  };

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'timeSpent'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      timeSpent: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          setTotalPoints(p => p + t.points);
        } else {
          setTotalPoints(p => p - t.points);
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.completed) {
      setTotalPoints(p => p - task.points);
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTaskTime = (taskId: string, seconds: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, timeSpent: t.timeSpent + seconds } : t));
  };

  const getStats = (): UserStats => {
    const levelInfo = [...LEVEL_TITLES].reverse().find(l => totalPoints >= l.minPoints) || LEVEL_TITLES[0];
    return {
      totalPoints,
      level: LEVEL_TITLES.indexOf(levelInfo) + 1,
      title: levelInfo.title + ' ' + levelInfo.icon,
    };
  };

  return {
    subjects,
    tasks,
    totalPoints,
    addSubject,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskTime,
    getStats,
  };
}

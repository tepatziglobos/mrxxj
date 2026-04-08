import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Calendar as CalendarIcon, BookOpen, Settings, Plus, Timer, CheckCircle2, Trash2, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useLearningStore } from './hooks/useLearningStore';
import { ViewType, Task, Subject } from './types';
import { QUICK_TASKS, ICONS, COLORS } from './constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function App() {
  const { subjects, tasks, totalPoints, addSubject, addTask, toggleTask, deleteTask, updateTaskTime, getStats } = useLearningStore();
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [activeTimerTask, setActiveTimerTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stats = getStats();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-brand-bg relative pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="p-6 pb-2 flex items-center justify-between sticky top-0 bg-brand-bg/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
            <Star className="text-white fill-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-brand-purple">每日学习机</h1>
        </div>
        <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-brand-purple/10 flex items-center gap-2">
          <Star className="text-yellow-400 fill-yellow-400" size={18} />
          <span className="font-bold text-slate-700">{totalPoints}</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="px-6 py-4 flex gap-3">
        <TabButton 
          active={currentView === 'today'} 
          onClick={() => setCurrentView('today')}
          icon={<BookOpen size={18} />}
          label="今日任务"
        />
        <TabButton 
          active={currentView === 'calendar'} 
          onClick={() => setCurrentView('calendar')}
          icon={<CalendarIcon size={18} />}
          label="学习日历"
        />
        <TabButton 
          active={currentView === 'subjects'} 
          onClick={() => setCurrentView('subjects')}
          icon={<Settings size={18} />}
          label="管理科目"
        />
      </nav>

      {/* Main Content */}
      <main className="px-6">
        <AnimatePresence mode="wait">
          {currentView === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Level Card */}
              <div className="bg-gradient-to-br from-brand-purple to-brand-pink p-6 rounded-2xl text-white shadow-xl shadow-brand-purple/20 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm opacity-80">当前称号</p>
                  <h2 className="text-2xl font-bold mt-1">{stats.title}</h2>
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>再得 {50 - (totalPoints % 50)} 分升级</span>
                      <span className="font-bold">总积分 {totalPoints}</span>
                    </div>
                    <Progress value={(totalPoints % 50) * 2} className="h-2 bg-white/20" />
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                  <Star size={120} fill="white" />
                </div>
              </div>

              {/* Today Progress */}
              <div className="glass-card p-6 soft-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">今日进度</h3>
                    <p className="text-sm text-slate-500">{format(new Date(), 'M月d日 EEEE', { locale: zhCN })}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-brand-purple">{completedToday}</span>
                    <span className="text-slate-400 font-medium">/{todayTasks.length}</span>
                    <p className="text-xs text-slate-400">完成任务</p>
                  </div>
                </div>
                <Progress value={progress} className="h-3 bg-slate-100" />
              </div>

              {/* Task List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-purple rounded-full"></span>
                    待完成 ({todayTasks.filter(t => !t.completed).length})
                  </h3>
                  <Button 
                    onClick={() => setIsAddTaskOpen(true)}
                    className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full h-9 px-4 text-sm"
                  >
                    <Plus size={16} className="mr-1" /> 添加任务
                  </Button>
                </div>

                {todayTasks.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                      <BookOpen size={40} />
                    </div>
                    <p>今天还没有任务，快去添加吧！</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayTasks.filter(t => !t.completed).map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        subject={subjects.find(s => s.id === task.subjectId)}
                        onToggle={() => toggleTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                        onTimer={() => setActiveTimerTask(task)}
                      />
                    ))}
                    
                    {todayTasks.some(t => t.completed) && (
                      <>
                        <h3 className="font-bold flex items-center gap-2 pt-4">
                          <span className="w-1.5 h-6 bg-green-400 rounded-full"></span>
                          已完成 ({todayTasks.filter(t => t.completed).length})
                        </h3>
                        {todayTasks.filter(t => t.completed).map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            subject={subjects.find(s => s.id === task.subjectId)}
                            onToggle={() => toggleTask(task.id)}
                            onDelete={() => deleteTask(task.id)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <CalendarView 
                tasks={tasks} 
                selectedDate={selectedDate} 
                onDateChange={setSelectedDate} 
              />
              
              <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<CheckCircle2 className="text-green-500" />} value={tasks.filter(t => t.completed && t.date.startsWith(format(selectedDate, 'yyyy-MM'))).length} label="本月完成" />
                <StatCard icon={<Star className="text-yellow-400 fill-yellow-400" />} value={tasks.filter(t => t.completed && t.date.startsWith(format(selectedDate, 'yyyy-MM'))).reduce((acc, t) => acc + t.points, 0)} label="本月积分" />
                <StatCard icon={<CalendarIcon className="text-brand-purple" />} value={new Set(tasks.filter(t => t.completed).map(t => t.date)).size} label="学习天数" />
              </div>
            </motion.div>
          )}

          {currentView === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">我的科目</h3>
                <Button 
                  onClick={() => setIsAddSubjectOpen(true)}
                  className="bg-brand-purple text-white rounded-full h-9 px-4"
                >
                  <Plus size={16} className="mr-1" /> 添加科目
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {subjects.map(subject => (
                  <div key={subject.id} className="glass-card p-4 flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ backgroundColor: subject.color + '20' }}
                    >
                      {subject.icon}
                    </div>
                    <span className="font-bold text-slate-700">{subject.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Ad/Info */}
      <div className="fixed bottom-24 left-0 right-0 px-6 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-brand-purple/10 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Settings size={20} />
            </div>
            <div className="text-sm">
              <p className="text-slate-500">想要加入 <span className="text-brand-purple font-bold">西西AI高效育儿群</span></p>
              <p className="text-slate-500">加微信 <span className="text-brand-pink font-bold">LMXD56</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)} 
        subjects={subjects}
        onAdd={addTask}
      />
      
      <AddSubjectModal 
        isOpen={isAddSubjectOpen} 
        onClose={() => setIsAddSubjectOpen(false)} 
        onAdd={addSubject}
      />

      {/* Timer Overlay */}
      {activeTimerTask && (
        <TimerOverlay 
          task={activeTimerTask} 
          subject={subjects.find(s => s.id === activeTimerTask.subjectId)}
          onClose={() => setActiveTimerTask(null)}
          onUpdateProgress={updateTaskTime}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
        active ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "bg-white text-slate-500 shadow-sm"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

const TaskItem: React.FC<{ 
  task: Task; 
  subject?: Subject; 
  onToggle: () => void; 
  onDelete: () => void; 
  onTimer?: () => void; 
}> = ({ task, subject, onToggle, onDelete, onTimer }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "glass-card p-4 flex items-center gap-4 transition-all",
        task.completed ? "opacity-60 grayscale bg-slate-50" : "soft-shadow"
      )}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: (subject?.color || '#eee') + '20' }}
      >
        {subject?.icon || '📝'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 truncate">{task.name}</h4>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          {subject?.name} • <Star size={10} className="text-yellow-400 fill-yellow-400" /> +{task.points}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {!task.completed && onTimer && (
          <button onClick={onTimer} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <Timer size={20} />
          </button>
        )}
        <button 
          onClick={onToggle} 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            task.completed ? "bg-green-500 text-white" : "bg-slate-100 text-slate-300 hover:bg-green-100 hover:text-green-500"
          )}
        >
          <CheckCircle2 size={24} />
        </button>
        <button onClick={onDelete} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors">
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: number | string, label: string }) {
  return (
    <div className="glass-card p-4 flex flex-col items-center justify-center text-center gap-1">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-brand-purple">{value}</div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

function CalendarView({ tasks, selectedDate, onDateChange }: { tasks: Task[], selectedDate: Date, onDateChange: (d: Date) => void }) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => t.date === dateStr);
    if (dayTasks.length === 0) return null;
    const completed = dayTasks.filter(t => t.completed).length;
    if (completed === dayTasks.length) return 'all';
    if (completed > 0) return 'partial';
    return 'tasks';
  };

  return (
    <div className="glass-card p-6 soft-shadow">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => onDateChange(subMonths(selectedDate, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={20} className="text-brand-purple" />
        </button>
        <h3 className="text-xl font-bold text-slate-700">{format(selectedDate, 'yyyy年M月', { locale: zhCN })}</h3>
        <button onClick={() => onDateChange(addMonths(selectedDate, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronRight size={20} className="text-brand-purple" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {weekDays.map(d => (
          <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
        ))}
        {days.map(day => {
          const status = getDayStatus(day);
          const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={day.toString()} className="relative flex flex-col items-center">
              <button 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative z-10",
                  !isCurrentMonth ? "text-slate-200" : "text-slate-600",
                  isToday ? "bg-brand-pink/10 text-brand-pink font-bold" : ""
                )}
              >
                {format(day, 'd')}
              </button>
              {status && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1",
                  status === 'all' ? "bg-green-400" : status === 'partial' ? "bg-yellow-400" : "bg-orange-400"
                )} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-8 text-[10px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" /> 全部完成
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-400" /> 部分完成
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-400" /> 有任务
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({ isOpen, onClose, subjects, onAdd }: { isOpen: boolean, onClose: () => void, subjects: Subject[], onAdd: (t: any) => void }) {
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');

  const handleAdd = () => {
    if (!name || !subjectId) return;
    onAdd({
      name,
      subjectId,
      points: 10,
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="text-brand-purple" /> 添加新任务
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="font-bold text-slate-500">选择科目</Label>
            <div className="grid grid-cols-3 gap-3">
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id)}
                  className={cn(
                    "p-3 rounded-xl flex flex-col items-center gap-1 transition-all border-2",
                    subjectId === s.id ? "border-brand-purple bg-brand-purple/5" : "border-transparent bg-slate-50"
                  )}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-bold">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-slate-500">快速选择</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TASKS.map(t => (
                <button
                  key={t}
                  onClick={() => setName(t)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    name === t ? "bg-brand-purple text-white border-brand-purple" : "bg-white text-slate-500 border-slate-200"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-slate-500">自定义任务名</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="输入任务名称..." 
              className="rounded-xl h-12 border-slate-200"
            />
          </div>

          <Button onClick={handleAdd} className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-lg shadow-lg shadow-brand-purple/20">
            添加任务 ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddSubjectModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (s: any) => void }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const handleAdd = () => {
    if (!name) return;
    onAdd({ name, icon, color });
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="text-brand-purple" /> 添加科目
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="font-bold text-slate-500">科目名称</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="例如：体育、编程..." 
              className="rounded-xl h-12 border-slate-200"
            />
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-slate-500">选择图标</Label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all border-2",
                    icon === i ? "border-brand-purple bg-brand-purple/5" : "border-transparent bg-slate-50"
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-slate-500">选择颜色</Label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all border-2",
                    color === c ? "border-brand-purple scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: color + '20' }}>
              {icon}
            </div>
            <span className="font-bold text-slate-700">{name || '科目名称'}</span>
          </div>

          <Button onClick={handleAdd} className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-lg shadow-lg shadow-brand-purple/20">
            添加科目 ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TimerOverlay({ task, subject, onClose, onUpdateProgress }: { task: Task, subject?: Subject, onClose: () => void, onUpdateProgress: (id: string, s: number) => void }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    onUpdateProgress(task.id, seconds);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center p-8"
    >
      <button onClick={handleFinish} className="self-start flex items-center gap-1 text-brand-purple font-bold mb-12">
        <ChevronLeft size={24} /> 返回
      </button>

      <div className="flex flex-col items-center gap-4 mb-12">
        <div 
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-brand-purple/10"
          style={{ backgroundColor: (subject?.color || '#eee') + '40' }}
        >
          {subject?.icon || '📝'}
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">{task.name}</h2>
          <p className="text-slate-400 font-medium">{subject?.name} • <Star size={14} className="inline text-yellow-400 fill-yellow-400" /> +{task.points}</p>
        </div>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[12px] border-slate-50 shadow-inner" />
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="132"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 132}
            strokeDashoffset={2 * Math.PI * 132 * (1 - (seconds % 60) / 60)}
            className="text-brand-purple transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-6xl font-black text-brand-purple tracking-tighter">{formatTime(seconds)}</div>
          <div className="text-slate-400 font-bold mt-2">{Math.floor(seconds / 60)} 分钟</div>
        </div>
      </div>

      <div className="mt-auto flex gap-6 pb-12">
        <button 
          onClick={() => setSeconds(0)}
          className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={() => setIsActive(!isActive)}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink text-white flex items-center justify-center shadow-xl shadow-brand-purple/30 active:scale-90 transition-all"
        >
          {isActive ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" className="ml-2" />}
        </button>
        <button 
          onClick={handleFinish}
          className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all"
        >
          <CheckCircle2 size={24} />
        </button>
      </div>
    </motion.div>
  );
}


import { Subject } from './types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: '语文', icon: '📖', color: '#FF85A2' },
  { id: '2', name: '数学', icon: '🔢', color: '#7EB6FF' },
  { id: '3', name: '英语', icon: '🌍', color: '#6ED7D1' },
  { id: '4', name: '科学', icon: '🔬', color: '#A5D6A7' },
  { id: '5', name: '音乐', icon: '🎵', color: '#CE93D8' },
  { id: '6', name: '美术', icon: '🎨', color: '#FFCC80' },
];

export const QUICK_TASKS = [
  '背课文', '写日记', '词语听写', '阅读理解', '作文练习', '课后习题', '口算练习'
];

export const ICONS = [
  '📖', '🔢', '🌍', '🔬', '🎵', '🎨', '🏃', '💻', '🎭', '📐', '🌎', '📝', '🧪', '🎸', '⚽', '🏊'
];

export const COLORS = [
  '#FF85A2', '#FFAB91', '#FFE0B2', '#DCEDC8', '#B2DFDB', '#C5CAE9', '#D1C4E9', '#F8BBD0', '#FFE082', '#E1BEE7'
];

export const LEVEL_TITLES = [
  { minPoints: 0, title: '小萌芽', icon: '🌱' },
  { minPoints: 50, title: '小树苗', icon: '🌿' },
  { minPoints: 150, title: '小树', icon: '🌳' },
  { minPoints: 300, title: '常青树', icon: '🌲' },
  { minPoints: 500, title: '智慧之星', icon: '🌟' },
];

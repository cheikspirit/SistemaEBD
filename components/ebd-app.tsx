'use client';

import * as React from 'react';
import { 
  Home, 
  Users, 
  CheckCircle, 
  Settings, 
  Pencil,
  Plus, 
  BookOpen, 
  UserCircle,
  BarChart3,
  ChevronRight,
  Bell,
  Search,
  UserPlus,
  ArrowLeft,
  Book,
  Calendar,
  Loader2,
  LogOut,
  Trophy,
  Star,
  Medal,
  FileText,
  TrendingUp,
  PieChart,
  Cake,
  Archive,
  ArchiveRestore,
  ShieldCheck,
  UserCog,
  Mail,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { LoginForm } from './login-form';
import { cn, parseLocalDate } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// --- Types ---

type View = 'dashboard' | 'classes' | 'students' | 'attendance' | 'settings' | 'add-student' | 'edit-student' | 'add-class' | 'edit-class' | 'categories' | 'add-category' | 'notifications' | 'gamification' | 'add-points' | 'reports' | 'teachers' | 'add-teacher' | 'edit-teacher' | 'user-management';

type UserRole = 'ADMIN' | 'TEACHER';

interface Profile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Student {
  id: string;
  name: string;
  class_id: string;
  status: 'active' | 'inactive';
  avatar_url?: string;
  points?: number;
  birth_date?: string;
  type?: 'REGULAR' | 'VISITOR';
}

interface Teacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

interface Class {
  id: string;
  name: string;
  teacher: string;
  category_id: string;
  student_count: number;
  image_url: string;
  status: 'active' | 'archived';
}

interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  present: boolean;
  has_bible: boolean;
}

// --- Mock Data Fallback ---

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Bíblica (Adultos)', color: '#10b981' },
  { id: '2', name: 'Jovens', color: '#3b82f6' },
  { id: '3', name: 'Adolescentes', color: '#8b5cf6' },
  { id: '4', name: 'Crianças', color: '#f59e0b' },
  { id: '5', name: 'Discipulado', color: '#ef4444' },
];

const MOCK_CLASSES: Class[] = [
  {
    id: '1',
    name: 'Adultos - Classe Bereana (Demo)',
    teacher: 'Prof. João Silva',
    category_id: '1',
    student_count: 45,
    image_url: 'https://picsum.photos/seed/ebd1/800/400',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jovens - Radicais Livres (Demo)',
    teacher: 'Profa. Maria Oliveira',
    category_id: '2',
    student_count: 32,
    image_url: 'https://picsum.photos/seed/ebd2/800/400',
    status: 'active'
  },
  {
    id: '3',
    name: 'Primários - Cordeirinhos (Demo)',
    teacher: 'Ana Paula Costa',
    category_id: '4',
    student_count: 18,
    image_url: 'https://picsum.photos/seed/ebd3/800/400',
    status: 'active'
  },
  {
    id: '4',
    name: 'Adolescentes - Atalaias (Demo)',
    teacher: 'Ricardo Mendes',
    category_id: '3',
    student_count: 25,
    image_url: 'https://picsum.photos/seed/ebd4/800/400',
    status: 'active'
  },
];

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Ana Beatriz Oliveira', class_id: '3', status: 'active', avatar_url: 'https://picsum.photos/seed/p1/100/100', points: 150, birth_date: '2015-03-05', created_at: '2026-02-05T10:00:00Z' } as any,
  { id: '2', name: 'Lucas Mendes', class_id: '3', status: 'active', avatar_url: 'https://picsum.photos/seed/p2/100/100', points: 120, birth_date: '2015-03-10', created_at: '2026-01-10T10:00:00Z' } as any,
  { id: '3', name: 'Mariana Costa', class_id: '4', status: 'inactive', avatar_url: 'https://picsum.photos/seed/p3/100/100', points: 45, birth_date: '2018-06-20', created_at: '2025-12-15T10:00:00Z' } as any,
  { id: '4', name: 'Gabriel Souza', class_id: '1', status: 'active', avatar_url: 'https://picsum.photos/seed/p4/100/100', points: 210, birth_date: '1990-03-02', created_at: '2025-11-20T10:00:00Z' } as any,
  { id: '5', name: 'Carla Peixoto', class_id: '1', status: 'active', avatar_url: 'https://picsum.photos/seed/p5/100/100', points: 180, birth_date: '1992-11-15', created_at: '2025-10-25T10:00:00Z' } as any,
  { id: '6', name: 'Ricardo Silva', class_id: '1', status: 'active', avatar_url: 'https://picsum.photos/seed/p6/100/100', points: 95, birth_date: '1988-08-25', created_at: '2026-03-30T10:00:00Z' } as any,
];

const MOCK_TEACHERS: Teacher[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@email.com' },
  { id: '3', name: 'Ricardo Mendes', email: 'ricardo@email.com' },
];

// --- Components ---

const Dashboard = ({ 
  onNavigate, 
  classes, 
  students, 
  birthdayAlertsEnabled,
  userRole,
  recentAttendance = [],
  onLogout
}: { 
  onNavigate: (view: View) => void;
  classes: Class[];
  students: Student[];
  birthdayAlertsEnabled: boolean;
  userRole: UserRole;
  recentAttendance?: any[];
  onLogout: () => void;
}) => {
  const birthdaysThisWeek = React.useMemo(() => {
    if (!birthdayAlertsEnabled) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start and end of current week (Sunday to Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return students.filter(student => {
      if (!student.birth_date) return false;
      
      // Parse YYYY-MM-DD
      const parts = student.birth_date.split('-');
      if (parts.length !== 3) return false;
      
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      // Check this year, last year, and next year to handle week overlaps at year end
      const years = [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1];
      
      return years.some(year => {
        const bday = new Date(year, month, day);
        return bday >= startOfWeek && bday <= endOfWeek;
      });
    });
  }, [students, birthdayAlertsEnabled]);

  const attendanceStats = React.useMemo(() => {
    if (!recentAttendance || recentAttendance.length === 0) {
      return { percentage: 0, present: 0, total: 0, trend: 0, date: null };
    }

    // Find the most recent date
    const dates = [...new Set(recentAttendance.map(a => a.date))].sort((a, b) => b.localeCompare(a));
    const lastSunday = dates[0];
    
    if (!lastSunday) return { percentage: 0, present: 0, total: 0, trend: 0, date: null };

    const lastSundayRecords = recentAttendance.filter(a => a.date === lastSunday);
    const lastTheme = lastSundayRecords[0]?.lesson_theme;

    // Calculate totals including the teacher of each session
    const sessions = Array.from(lastSundayRecords.reduce((map, record) => {
      const classId = record.class_id;
      if (!map.has(classId)) map.set(classId, record.teacher_name);
      return map;
    }, new Map<string, string | null>())) as [string, string | null][];

    const studentsPresent = lastSundayRecords.filter(a => a.present).length;
    const teachersPresent = sessions.filter(s => !!s[1]).length;
    const totalPresent = studentsPresent + teachersPresent;
    
    const studentsTotal = lastSundayRecords.length;
    const teachersTotal = sessions.length;
    const grandTotal = studentsTotal + teachersTotal;
    
    const percentage = grandTotal > 0 ? Math.round((totalPresent / grandTotal) * 100) : 0;

    // Calculate trend (compare with previous Sunday)
    let trend = 0;
    if (dates.length > 1) {
      const prevSunday = dates[1];
      const prevSundayRecords = recentAttendance.filter(a => a.date === prevSunday);
      
      const prevSessions = Array.from(prevSundayRecords.reduce((map, record) => {
        const classId = record.class_id;
        if (!map.has(classId)) map.set(classId, record.teacher_name);
        return map;
      }, new Map<string, string | null>())) as [string, string | null][];

      const prevStudentsPresent = prevSundayRecords.filter(a => a.present).length;
      const prevTeachersPresent = prevSessions.filter(s => !!s[1]).length;
      const prevTotalPresent = prevStudentsPresent + prevTeachersPresent;
      
      const prevStudentsTotal = prevSundayRecords.length;
      const prevTeachersTotal = prevSessions.length;
      const prevGrandTotal = prevStudentsTotal + prevTeachersTotal;
      
      const prevPercentage = prevGrandTotal > 0 ? Math.round((prevTotalPresent / prevGrandTotal) * 100) : 0;
      trend = percentage - prevPercentage;
    }

    return { percentage, present: totalPresent, total: grandTotal, trend, date: lastSunday, theme: lastTheme };
  }, [recentAttendance]);

  const chartData = React.useMemo(() => {
    if (!recentAttendance || recentAttendance.length === 0) {
      return [0, 0, 0, 0];
    }

    const dates = [...new Set(recentAttendance.map(a => a.date))].sort((a, b) => b.localeCompare(a)).slice(0, 4).reverse();
    return dates.map(date => {
      const records = recentAttendance.filter(a => a.date === date);
      const sessions = new Set(records.map(r => r.class_id)).size;
      const studentsPresent = records.filter(a => a.present).length;
      const teachersPresent = (Array.from(records.reduce((map, r) => {
        if (!map.has(r.class_id)) map.set(r.class_id, r.teacher_name);
        return map;
      }, new Map<string, string | null>())) as [string, string | null][]).filter(s => !!s[1]).length;
      
      const totalPresent = studentsPresent + teachersPresent;
      const totalExpected = records.length + sessions;
      
      return totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;
    });
  }, [recentAttendance]);

  return (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 pb-24"
  >
    {/* Hero */}
    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
      <h2 className="text-xl font-bold mb-1">Pronto para a aula?</h2>
      <p className="text-white/80 text-sm mb-4">Registre a presença dos alunos de hoje de forma rápida.</p>
      <button 
        onClick={() => onNavigate('attendance')}
        className="w-full bg-white text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <CheckCircle className="size-5" />
        Fazer Chamada Agora
      </button>
    </div>

    {/* Birthdays Alert */}
    {birthdaysThisWeek.length > 0 && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-4 rounded-2xl flex items-center gap-4"
      >
        <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 shrink-0">
          <Cake className="size-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Aniversariantes da Semana!</p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {birthdaysThisWeek.length === 1 
              ? `${birthdaysThisWeek[0].name} faz aniversário esta semana.`
              : `${birthdaysThisWeek.length} alunos fazem aniversário esta semana.`}
          </p>
        </div>
      </motion.div>
    )}

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-primary/5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <Users className="size-5 text-primary" />
          <span className="text-[10px] font-bold text-primary-dark bg-primary/5 px-1.5 py-0.5 rounded">
            {students.filter(s => s.type === 'VISITOR').length} visitantes
          </span>
        </div>
        <p className="text-slate-500 text-xs font-medium">Alunos Regulares</p>
        <p className="text-2xl font-bold">{students.filter(s => s.type !== 'VISITOR').length}</p>
      </div>
      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-primary/5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <BookOpen className="size-5 text-primary" />
        </div>
        <p className="text-slate-500 text-xs font-medium">Turmas Ativas</p>
        <p className="text-2xl font-bold">{classes.length}</p>
      </div>
      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-primary/5 shadow-sm col-span-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-500 text-xs font-medium">Média Frequência (Dom. Passado)</p>
          {attendanceStats.trend !== 0 && (
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded",
              attendanceStats.trend > 0 ? "text-primary-dark bg-primary/10" : "text-red-600 bg-red-50"
            )}>
              {attendanceStats.trend > 0 ? '+' : ''}{attendanceStats.trend}%
            </span>
          )}
        </div>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{attendanceStats.percentage}%</p>
          <div className="flex flex-col mb-1">
            <p className="text-slate-400 text-[9px] leading-tight">
              {attendanceStats.present} presentes (incl. professores)
            </p>
            {attendanceStats.theme && (
              <p className="text-primary text-[9px] leading-tight font-bold truncate max-w-[150px]">
                Tema: {attendanceStats.theme}
              </p>
            )}
            <p className="text-slate-400 text-[9px] leading-tight">
              {attendanceStats.date && `em ${parseLocalDate(attendanceStats.date)?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Chart Placeholder */}
    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-primary/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Frequência Mensal</h3>
        <span className="text-xs text-slate-400">Últimos {chartData.length} Domingos</span>
      </div>
      <div className="flex items-end justify-between h-32 gap-4 px-2">
        {chartData.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full bg-primary/10 rounded-t-lg relative flex items-end justify-center" style={{ height: '100%' }}>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                className={cn(
                  "w-full rounded-t-lg transition-all",
                  i === chartData.length - 1 ? "bg-primary" : "bg-primary/40"
                )}
              />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase",
              i === chartData.length - 1 ? "text-primary" : "text-slate-500"
            )}>
              {recentAttendance.length > 0 ? (
                [...new Set(recentAttendance.map(a => a.date))].sort((a, b) => b.localeCompare(a)).slice(0, 4).reverse()[i]?.split('-')[2]
              ) : `0${i + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Activity */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Chamadas Recentes</h3>
        <button onClick={() => onNavigate('reports')} className="text-xs text-primary font-semibold">Ver relatórios</button>
      </div>
      <div className="space-y-3">
        {recentAttendance.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            Nenhuma chamada registrada recentemente.
          </div>
        ) : (
          // Deduplicate by class and date for the dashboard view
          Array.from(
            recentAttendance.reduce((map: Map<string, any>, a) => {
              const key = `${a.class_id}-${a.date}`;
              if (!map.has(key)) map.set(key, a);
              return map;
            }, new Map<string, any>()).values()
          )
            .slice(0, 3)
            .map((record, idx) => (
              <div key={record.id} className="flex items-center gap-3 bg-white dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className={cn(
                  "size-10 rounded-lg flex items-center justify-center",
                  idx % 2 === 0 ? "bg-primary/10 text-primary" : "bg-primary-dark/10 text-primary-dark"
                )}>
                  <CheckCircle className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{record.classes?.name || 'Turma'}</p>
                  <p className="text-[10px] text-slate-400">
                    {parseLocalDate(record.date)?.toLocaleDateString('pt-BR')} • Por {record.teacher_name || 'Professor'}
                  </p>
                </div>
                <ChevronRight className="size-4 text-slate-300" />
              </div>
            ))
        )}
      </div>
    </div>

    {/* Logout Button for Teachers */}
    {userRole === 'TEACHER' && (
      <div className="pt-6 pb-20">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-2xl font-bold transition-all active:scale-95 border border-slate-100 dark:border-slate-800"
        >
          <LogOut className="size-5" />
          Sair do Sistema
        </button>
      </div>
    )}
  </motion.div>
  );
};

const ClassesList = ({ 
  classes, 
  categories, 
  students,
  onNavigate,
  onEdit,
  onDelete,
  onToggleArchive,
  userRole
}: { 
  classes: Class[], 
  categories: Category[], 
  students: Student[],
  onNavigate: (view: View) => void,
  onEdit: (cls: Class) => void,
  onDelete: (id: string) => void,
  onToggleArchive: (id: string) => void,
  userRole: UserRole
}) => {
  const [activeTab, setActiveTab] = React.useState<'active' | 'archived'>('active');

  const filteredClasses = classes.filter(cls => cls.status === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-24"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="size-5 text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Turmas EBD</h1>
        </div>
        <div className="flex gap-2">
          {userRole === 'ADMIN' && (
            <button 
              onClick={() => onNavigate('categories')}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2 rounded-full"
              title="Gerenciar Categorias"
            >
              <Settings className="size-5" />
            </button>
          )}
          {userRole === 'ADMIN' && (
            <button 
              onClick={() => onNavigate('add-class')}
              className="bg-primary/10 text-primary p-2 rounded-full"
            >
              <Plus className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-primary/10 mb-4">
        <button 
          onClick={() => setActiveTab('active')}
          className={cn(
            "flex-1 py-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'active' ? "border-primary text-primary" : "border-transparent text-slate-500"
          )}
        >
          Ativas
        </button>
        <button 
          onClick={() => setActiveTab('archived')}
          className={cn(
            "flex-1 py-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'archived' ? "border-primary text-primary" : "border-transparent text-slate-500"
          )}
        >
          Arquivadas
        </button>
      </div>

      <div className="grid gap-4">
        {filteredClasses.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            Nenhuma turma {activeTab === 'active' ? 'ativa' : 'arquivada'} encontrada.
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5 transition-all">
              <div 
                className="h-32 w-full bg-primary/20 bg-cover bg-center relative" 
                style={{ backgroundImage: `url(${cls.image_url})` }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{cls.name}</h3>
                    {categories.find(cat => cat.id === cls.category_id) && (
                      <span 
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider"
                        style={{ 
                          backgroundColor: `${categories.find(cat => cat.id === cls.category_id)?.color}20`,
                          color: categories.find(cat => cat.id === cls.category_id)?.color 
                        }}
                      >
                        {categories.find(cat => cat.id === cls.category_id)?.name}
                      </span>
                    )}
                  </div>
                  {userRole === 'ADMIN' && (
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button 
                        onClick={() => onEdit(cls)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                        title="Editar Turma"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button 
                        onClick={() => onToggleArchive(cls.id)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                        title={cls.status === 'active' ? "Arquivar Turma" : "Restaurar Turma"}
                      >
                        {cls.status === 'active' ? <Archive className="size-4" /> : <ArchiveRestore className="size-4" />}
                      </button>
                      <button 
                        onClick={() => onDelete(cls.id)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Excluir Turma"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <UserCircle className="size-4" />
                    <p className="text-sm">{cls.teacher}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Users className="size-4" />
                    <p className="text-sm font-medium">
                      {students.filter(s => s.class_id === cls.id).length} alunos vinculados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const StudentsList = ({ 
  students, 
  classes, 
  onNavigate,
  onEdit,
  onDelete,
  userRole
}: { 
  students: Student[], 
  classes: Class[], 
  onNavigate: (view: View) => void,
  onEdit: (student: Student) => void,
  onDelete: (id: string) => void,
  userRole: UserRole
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('Todos');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classes.find(c => c.id === student.class_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'Todos' || 
      (activeFilter === 'Ativos' && student.status === 'active') ||
      (activeFilter === 'Inativos' && student.status === 'inactive') ||
      (activeFilter === 'Visitantes' && student.type === 'VISITOR') ||
      (activeFilter === 'Turmas' && student.class_id); // This is a bit redundant but matches UI tabs

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-24"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="size-5 text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Gestão de Alunos</h1>
        </div>
        {userRole === 'ADMIN' && (
          <button 
            onClick={() => onNavigate('add-student')}
            className="bg-primary/10 text-primary p-2 rounded-full"
          >
            <UserPlus className="size-5" />
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input 
          className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all" 
          placeholder="Buscar por nome ou turma..." 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['Todos', 'Turmas', 'Ativos', 'Inativos', 'Visitantes'].map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              activeFilter === filter ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
            )}
          >
            {filter}
            {filter === 'Ativos' && <CheckCircle className="size-3 text-primary" />}
            {filter === 'Visitantes' && <UserCircle className="size-3 text-primary" />}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            Nenhum aluno encontrado.
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div 
              key={student.id} 
              onClick={() => onEdit(student)}
              className="group flex items-center justify-between rounded-2xl p-3 active:bg-slate-50 dark:active:bg-slate-900 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-900/50"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image 
                    src={student.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                    alt={student.name}
                    width={56}
                    height={56}
                    className={cn(
                      "h-14 w-14 rounded-full object-cover",
                      student.status === 'inactive' && "grayscale opacity-60"
                    )}
                  />
                  <span className={cn(
                    "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-950",
                    student.status === 'active' ? "bg-primary" : "bg-slate-400"
                  )} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-semibold text-slate-900 dark:text-slate-100",
                      student.status === 'inactive' && "text-slate-400 line-through"
                    )}>{student.name}</span>
                    {student.type === 'VISITOR' && (
                      <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        Visitante
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Turma: {classes.find(c => c.id === student.class_id)?.name.split(' - ')[0]}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      student.status === 'active' ? "text-primary" : "text-slate-400"
                    )}>{student.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(student);
                  }}
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                  title="Editar Aluno"
                >
                  <Pencil className="size-4" />
                </button>
                {userRole === 'ADMIN' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(student.id);
                    }}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Plus className="size-5 rotate-45" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const AttendanceRollCall = ({ 
  onNavigate, 
  students, 
  classes,
  isDemoMode,
  onStartTimer,
  onSuccess
}: { 
  onNavigate: (view: View) => void;
  students: Student[];
  classes: Class[];
  isDemoMode: boolean;
  onStartTimer: () => void;
  onSuccess?: () => void;
}) => {
  const [selectedClassId, setSelectedClassId] = React.useState<string>(classes[0]?.id || '');
  const [selectedTeacher, setSelectedTeacher] = React.useState('');
  const [lessonTheme, setLessonTheme] = React.useState('');
  const [biblicalReference, setBiblicalReference] = React.useState('');
  const [attendance, setAttendance] = React.useState<Record<string, { present: boolean; bible: boolean }>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [alreadyDoneToday, setAlreadyDoneToday] = React.useState(false);
  const [showVisitorSelector, setShowVisitorSelector] = React.useState(false);

  const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const dayOfWeek = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });

  const selectedClass = classes.find(c => c.id === selectedClassId);

  // Check if attendance was already done today for this class
  React.useEffect(() => {
    const checkAttendance = async () => {
      if (!selectedClassId || isDemoMode) return;
      
      const today = new Date().toLocaleDateString('sv-SE');
      const { data, error } = await supabase
        .from('attendance')
        .select('id')
        .eq('class_id', selectedClassId)
        .eq('date', today)
        .limit(1);
      
      if (!error && data && data.length > 0) {
        setAlreadyDoneToday(true);
      } else {
        setAlreadyDoneToday(false);
      }
    };

    checkAttendance();
  }, [selectedClassId, isDemoMode]);
  const classTeachers = React.useMemo(() => {
    if (!selectedClass?.teacher) return [];
    return selectedClass.teacher.split(',').map(t => t.trim());
  }, [selectedClass]);

  React.useEffect(() => {
    if (classTeachers.length > 0 && !selectedTeacher) {
      setSelectedTeacher(classTeachers[0]);
    }
  }, [classTeachers, selectedTeacher]);

  React.useEffect(() => {
    // Initialize attendance state for the selected class
    // Only regular students are initialized as present by default
    const classRegularStudents = students.filter(s => s.class_id === selectedClassId && (s.type === 'REGULAR' || !s.type));
    const initialAttendance = classRegularStudents.reduce((acc, s) => ({
      ...acc,
      [s.id]: { present: true, bible: true }
    }), {});
    setAttendance(initialAttendance);
  }, [selectedClassId, students]);

  const addVisitorToAttendance = (visitorId: string) => {
    setAttendance(prev => ({
      ...prev,
      [visitorId]: { present: true, bible: true }
    }));
    setShowVisitorSelector(false);
  };

  const toggle = (id: string, field: 'present' | 'bible') => {
    setAttendance(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: !prev[id][field] }
    }));
  };

  const handleSave = async () => {
    if (!selectedTeacher) {
      alert('Por favor, selecione o professor responsável pela aula de hoje.');
      return;
    }

    if (!lessonTheme.trim()) {
      alert('Por favor, informe o tema da aula.');
      return;
    }

    // Filter attendance to only save present visitors and all regular students
    const recordsToSave = Object.entries(attendance).filter(([studentId, data]) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return false;
      
      // If it's a regular student, always save (present or absent)
      if (student.type === 'REGULAR' || !student.type) return true;
      
      // If it's a visitor, only save if present
      return data.present;
    });

    const studentsPresent = recordsToSave.filter(([_, data]) => data.present).length;
    const totalPresent = studentsPresent + (selectedTeacher ? 1 : 0);

    if (isDemoMode) {
      alert(`Chamada de ${todayStr} finalizada com sucesso!\nTema: ${lessonTheme}\nProfessor: ${selectedTeacher}\nTotal de Frequência: ${totalPresent} (${studentsPresent} alunos + 1 professor)\n\nNota: No modo real, salvar novamente a mesma turma no mesmo dia irá atualizar os registros existentes.`);
      onStartTimer();
      onNavigate('dashboard');
      return;
    }

    setIsSaving(true);
    try {
      const today = new Date().toLocaleDateString('sv-SE');
      const records = recordsToSave.map(([studentId, data]) => ({
        student_id: studentId,
        class_id: selectedClassId,
        date: today,
        present: data.present,
        has_bible: data.bible,
        teacher_name: selectedTeacher,
        lesson_theme: lessonTheme.trim(),
        biblical_reference: biblicalReference.trim() || null
      }));

      const { error } = await supabase.from('attendance').upsert(records);
      
      if (error) throw error;

      alert(`Chamada de ${todayStr} finalizada com sucesso! Os dados foram registrados.`);
      onStartTimer();
      if (onSuccess) onSuccess();
      onNavigate('dashboard');
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      alert('Erro ao salvar chamada: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const regularStudents = students.filter(s => s.class_id === selectedClassId && (s.type === 'REGULAR' || !s.type));
  const availableVisitors = students.filter(s => s.class_id === selectedClassId && s.type === 'VISITOR' && !attendance[s.id]);
  const activeVisitors = students.filter(s => s.class_id === selectedClassId && s.type === 'VISITOR' && attendance[s.id]);

  const studentsPresentCount = Object.values(attendance).filter(a => a.present).length;
  const totalFrequencyCount = studentsPresentCount + (selectedTeacher ? 1 : 0);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 pb-32"
    >
      <div className="flex items-center justify-between">
        <button onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="size-6 text-slate-900 dark:text-slate-100" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold leading-tight">Chamada Digital</h1>
          <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{dayOfWeek}, {todayStr}</span>
        </div>
        <Calendar className="size-6 text-slate-900 dark:text-slate-100" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase">Selecione a Turma</label>
            {alreadyDoneToday && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                Chamada já realizada hoje
              </span>
            )}
          </div>
          <select 
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedTeacher('');
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-primary focus:border-primary"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Professor do Dia</label>
          <select 
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-primary focus:border-primary"
          >
            <option value="">Selecione o professor...</option>
            {classTeachers.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 px-1 italic">
            * Cadastre múltiplos professores na edição da turma separando por vírgula.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Tema da Aula <span className="text-red-500">*</span></label>
            <input 
              value={lessonTheme}
              onChange={(e) => setLessonTheme(e.target.value)}
              placeholder="Ex: A Parábola do Semeador"
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Referência Bíblica (Opcional)</label>
            <input 
              value={biblicalReference}
              onChange={(e) => setBiblicalReference(e.target.value)}
              placeholder="Ex: Mateus 13:1-23"
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-50 dark:divide-slate-900">
        <div className="py-2 px-1">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Alunos Regulares</h3>
        </div>
        {regularStudents.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-sm">
            Nenhum aluno regular cadastrado.
          </div>
        )}
        {regularStudents.map((student) => (
          <div key={student.id} className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <UserCircle className="size-8 text-slate-300" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">{student.name}</p>
                  <p className="text-slate-500 text-xs">{attendance[student.id]?.present ? 'Presente hoje' : 'Ausente'}</p>
                </div>
              </div>
              <button 
                onClick={() => toggle(student.id, 'present')}
                className={cn(
                  "relative h-8 w-14 rounded-full transition-colors",
                  attendance[student.id]?.present ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 size-6 bg-white rounded-full shadow-md transition-transform",
                  attendance[student.id]?.present && "translate-x-6"
                )} />
              </button>
            </div>
            
            <AnimatePresence>
              {attendance[student.id]?.present && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 ml-[60px]"
                >
                  <button 
                    onClick={() => toggle(student.id, 'bible')}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors",
                      attendance[student.id]?.bible 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-slate-200 text-slate-400"
                    )}
                  >
                    <Book className="size-3" /> Bíblia
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Visitantes Section */}
        <div className="pt-8 pb-2 px-1 flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visitantes Hoje</h3>
          <button 
            onClick={() => setShowVisitorSelector(true)}
            className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold uppercase flex items-center gap-1"
          >
            <Plus className="size-3" /> Adicionar
          </button>
        </div>

        {activeVisitors.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-sm italic">
            Nenhum visitante registrado hoje.
          </div>
        )}

        {activeVisitors.map((student) => (
          <div key={student.id} className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                  <UserPlus className="size-6 text-primary/40" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold">{student.name}</p>
                    <span className="text-[8px] bg-primary/20 text-primary px-1 rounded font-black uppercase">VISITANTE</span>
                  </div>
                  <p className="text-slate-500 text-xs">Presente hoje</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  // Remove visitor from current attendance
                  setAttendance(prev => {
                    const next = { ...prev };
                    delete next[student.id];
                    return next;
                  });
                }}
                className="p-2 text-red-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
            
            <div className="flex gap-2 ml-[60px]">
              <button 
                onClick={() => toggle(student.id, 'bible')}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors",
                  attendance[student.id]?.bible 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-slate-200 text-slate-400"
                )}
              >
                <Book className="size-3" /> Bíblia
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Visitor Selector Modal */}
      <AnimatePresence>
        {showVisitorSelector && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Adicionar Visitante</h3>
                <button onClick={() => setShowVisitorSelector(false)} className="p-2">
                  <Trash2 className="size-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {availableVisitors.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-slate-500 text-sm">Nenhum visitante cadastrado para esta turma.</p>
                    <button 
                      onClick={() => onNavigate('add-student')}
                      className="text-primary font-bold text-sm underline"
                    >
                      Cadastrar Novo Visitante
                    </button>
                  </div>
                ) : (
                  availableVisitors.map(visitor => (
                    <button 
                      key={visitor.id}
                      onClick={() => addVisitorToAttendance(visitor.id)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center">
                          <UserCircle className="size-6 text-slate-300" />
                        </div>
                        <p className="font-bold text-sm">{visitor.name}</p>
                      </div>
                      <Plus className="size-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                )}
              </div>

              <button 
                onClick={() => setShowVisitorSelector(false)}
                className="w-full py-4 text-slate-500 font-bold text-sm uppercase tracking-widest"
              >
                Cancelar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 left-0 right-0 p-4 max-w-md mx-auto space-y-2">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-primary/20 flex justify-between items-center shadow-lg">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Resumo da Chamada</p>
          <p className="text-xs font-black text-primary">
            {totalFrequencyCount} Presentes Total
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || (regularStudents.length === 0 && activeVisitors.length === 0)}
          className="w-full bg-primary text-slate-950 font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle className="size-5" />}
          Finalizar Chamada
        </button>
      </div>
    </motion.div>
  );
};

const StudentForm = ({ 
  classes, 
  initialData,
  onSuccess, 
  onCancel,
  isDemoMode 
}: { 
  classes: Class[]; 
  initialData?: Student | null;
  onSuccess: (data: Student) => void; 
  onCancel: () => void;
  isDemoMode: boolean;
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [classId, setClassId] = React.useState(initialData?.class_id || classes[0]?.id || '');
  const [birthDate, setBirthDate] = React.useState(initialData?.birth_date || '');
  const [status, setStatus] = React.useState<'active' | 'inactive'>(initialData?.status || 'active');
  const [type, setType] = React.useState<'REGULAR' | 'VISITOR'>(initialData?.type || 'REGULAR');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!classId && classes.length > 0) {
      setClassId(classes[0].id);
    }
  }, [classes, classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, informe o nome do aluno.');
      return;
    }

    if (!classId) {
      alert('Por favor, selecione uma turma.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        name: name.trim(),
        class_id: classId,
        birth_date: birthDate || null,
        status,
        type
      };

      const studentData: Student = {
        id: initialData?.id || (isDemoMode ? Math.random().toString(36).substr(2, 9) : ''),
        ...payload,
        points: initialData?.points || 0,
        avatar_url: initialData?.avatar_url || undefined
      };

      if (isDemoMode) {
        setIsSaving(false);
        alert(`Modo Demo: ${type === 'REGULAR' ? 'Aluno' : 'Visitante'} ${initialData ? 'atualizado' : 'cadastrado'} com sucesso!`);
        onSuccess(studentData);
        return;
      }

      if (initialData) {
        const { error } = await supabase
          .from('students')
          .update(payload)
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('students').insert(payload).select().single();
        
        if (error) {
          console.error('Supabase insert error:', error);
          throw new Error(error.message || 'Erro desconhecido ao inserir aluno');
        } else if (data) {
          studentData.id = data.id;
          studentData.points = data.points || 0;
        }
      }
      onSuccess(studentData);
    } catch (error: any) {
      console.error('Detailed error saving student:', error);
      alert('Erro ao salvar aluno: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">{initialData ? 'Editar Aluno' : 'Novo Aluno'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {initialData && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={cn(
                  "flex-1 py-3 rounded-xl border font-bold transition-all",
                  status === 'active' ? "bg-primary/10 border-primary text-primary" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
                )}
              >
                Ativo
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={cn(
                  "flex-1 py-3 rounded-xl border font-bold transition-all",
                  status === 'inactive' ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
                )}
              >
                Inativo
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Cadastro</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('REGULAR')}
              className={cn(
                "flex-1 py-3 rounded-xl border font-bold transition-all flex items-center justify-center gap-2",
                type === 'REGULAR' ? "bg-primary/10 border-primary text-primary" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
              )}
            >
              <Users className="size-4" />
              Aluno Regular
            </button>
            <button
              type="button"
              onClick={() => setType('VISITOR')}
              className={cn(
                "flex-1 py-3 rounded-xl border font-bold transition-all flex items-center justify-center gap-2",
                type === 'VISITOR' ? "bg-primary/10 border-primary text-primary" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
              )}
            >
              <UserPlus className="size-4" />
              Visitante
            </button>
          </div>
          <p className="text-[10px] text-slate-400 px-1 italic">
            * Visitantes não contam como falta quando não comparecem.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
          <input 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Nome do aluno"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Turma</label>
          {classes.length === 0 ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-sm">
              Nenhuma turma cadastrada. Cadastre uma turma primeiro.
            </div>
          ) : (
            <select 
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Data de Nascimento (Opcional)</label>
          <input 
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-slate-950 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : (initialData ? <CheckCircle className="size-5" /> : <Plus className="size-5" />)}
          {initialData ? 'Salvar Alterações' : 'Cadastrar Aluno'}
        </button>
      </form>
    </motion.div>
  );
};

const ClassForm = ({ 
  categories,
  teachers,
  initialData,
  onSuccess, 
  onCancel,
  isDemoMode 
}: { 
  categories: Category[];
  teachers: Teacher[];
  initialData?: Class | null;
  onSuccess: (data: Class) => void; 
  onCancel: () => void;
  isDemoMode: boolean;
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [teacher, setTeacher] = React.useState(initialData?.teacher || '');
  const [categoryId, setCategoryId] = React.useState(initialData?.category_id || categories[0]?.id || '');
  const [imageUrl, setImageUrl] = React.useState(initialData?.image_url || '');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleTeacherToggle = (teacherName: string) => {
    const currentTeachers = teacher.split(',').map(t => t.trim()).filter(t => t !== '');
    if (currentTeachers.includes(teacherName)) {
      setTeacher(currentTeachers.filter(t => t !== teacherName).join(', '));
    } else {
      setTeacher([...currentTeachers, teacherName].join(', '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categories.length === 0) {
      alert('Você precisa criar pelo menos uma categoria antes de criar uma turma.');
      return;
    }

    const classData: Class = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name,
      teacher,
      category_id: categoryId,
      student_count: initialData?.student_count || 0,
      image_url: imageUrl || `https://picsum.photos/seed/${Math.random()}/800/400`,
      status: initialData?.status || 'active'
    };

    if (isDemoMode) {
      alert(`Modo Demo: Turma ${initialData ? 'atualizada' : 'criada'} com sucesso!`);
      onSuccess(classData);
      return;
    }

    setIsSaving(true);
    try {
      if (initialData) {
        const { error } = await supabase
          .from('classes')
          .update({
            name,
            teacher,
            category_id: categoryId,
            image_url: classData.image_url,
            status: classData.status
          })
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('classes').insert({
          name,
          teacher,
          category_id: categoryId,
          image_url: classData.image_url,
          status: 'active'
        });
        if (error) throw error;
      }
      onSuccess(classData);
    } catch (error: any) {
      alert('Erro ao salvar turma: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">{initialData ? 'Editar Turma' : 'Nova Turma'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Nome da Turma</label>
          <input 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ex: Classe Bereana"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem da Turma</label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm focus:ring-primary focus:border-primary"
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setImageUrl(`https://picsum.photos/seed/${Math.random()}/800/400`)}
              className="px-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Aleatória
            </button>
          </div>
          {imageUrl && (
            <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Professor(a)</label>
          {teachers.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-2 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900">
              {teachers.map(t => {
                const isSelected = teacher.split(',').map(name => name.trim()).includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTeacherToggle(t.name)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                      isSelected 
                        ? "bg-primary text-slate-950 shadow-sm" 
                        : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700"
                    )}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <input 
              required
              value={teacher}
              onChange={e => setTeacher(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: João Silva, Maria Oliveira"
            />
          )}
          <p className="text-[10px] text-slate-400 px-1">
            {teachers.length > 0 
              ? "Selecione os professores que fazem parte desta turma." 
              : "Dica: Separe os nomes por vírgula para selecionar na chamada."}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
          <select 
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-slate-950 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : (initialData ? <CheckCircle className="size-5" /> : <Plus className="size-5" />)}
          {initialData ? 'Salvar Alterações' : 'Criar Turma'}
        </button>
      </form>
    </motion.div>
  );
};

const CategoriesList = ({ 
  categories, 
  onNavigate,
  onDelete,
  isDemoMode,
  onRefresh
}: { 
  categories: Category[], 
  onNavigate: (view: View) => void,
  onDelete: (id: string) => void,
  isDemoMode: boolean,
  onRefresh: () => void
}) => {
  const handleDelete = async (id: string) => {
    onDelete(id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('classes')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="size-6" />
          </button>
          <h2 className="text-xl font-bold">Categorias</h2>
        </div>
        <button 
          onClick={() => onNavigate('add-category')}
          className="bg-primary/10 text-primary p-2 rounded-full"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-4 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="font-semibold">{cat.name}</span>
            </div>
            <button 
              onClick={() => handleDelete(cat.id)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <Plus className="size-5 rotate-45" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const CategoryForm = ({ 
  onSuccess, 
  onCancel,
  isDemoMode 
}: { 
  onSuccess: (data: Category) => void; 
  onCancel: () => void;
  isDemoMode: boolean;
}) => {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('#10b981');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color
    };

    if (isDemoMode) {
      alert('Modo Demo: Categoria criada com sucesso!');
      onSuccess(categoryData as Category);
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('categories').insert({ name, color });
      if (error) throw error;
      onSuccess(categoryData as Category);
    } catch (error: any) {
      alert('Erro ao salvar categoria: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">Nova Categoria</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Nome da Categoria</label>
          <input 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ex: Visitantes"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Cor de Identificação</label>
          <div className="flex gap-3 flex-wrap">
            {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#64748b'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "size-10 rounded-full border-2 transition-all",
                  color === c ? "border-slate-900 dark:border-white scale-110 shadow-lg" : "border-transparent opacity-60"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-slate-950 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
          Criar Categoria
        </button>
      </form>
    </motion.div>
  );
};

const GamificationView = ({ 
  students, 
  classes, 
  onNavigate 
}: { 
  students: Student[], 
  classes: Class[], 
  onNavigate: (view: View) => void 
}) => {
  const [selectedClassId, setSelectedClassId] = React.useState<string>(classes[0]?.id || 'all');
  
  const ranking = React.useMemo(() => {
    let filtered = [...students];
    if (selectedClassId !== 'all') {
      filtered = filtered.filter(s => s.class_id === selectedClassId);
    }
    return filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
  }, [students, selectedClassId]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gamificação</h2>
        <button 
          onClick={() => onNavigate('add-points')}
          className="bg-primary text-slate-950 p-2 rounded-full shadow-lg"
        >
          <Plus className="size-6" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-3xl border border-primary/10 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Destaque da Semana</p>
          <h3 className="text-2xl font-black">{ranking[0]?.name || '---'}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Líder do Ranking com {ranking[0]?.points || 0} pontos</p>
        </div>
        <Trophy className="absolute -right-4 -bottom-4 size-32 text-primary/10 rotate-12" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Ranking de Alunos</h3>
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-xs font-bold py-2 px-3 outline-none"
          >
            <option value="all">Todas as Turmas</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name.split(' - ')[0]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {ranking.map((student, index) => (
            <div 
              key={student.id} 
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                index === 0 ? "bg-primary/5 border-primary/20 scale-[1.02]" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-primary text-slate-950" : 
                    index === 1 ? "bg-slate-200 text-slate-600" :
                    index === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {index + 1}
                  </div>
                  {index < 3 && <Medal className="absolute -top-2 -right-2 size-4 text-primary" />}
                </div>
                <div>
                  <p className="font-bold">{student.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    {classes.find(c => c.id === student.class_id)?.name.split(' - ')[0]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Star className="size-4 fill-primary" />
                <span className="font-black text-lg">{student.points || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const AddPointsForm = ({ 
  students, 
  classes, 
  onSuccess, 
  onCancel,
  isDemoMode,
  setStudents
}: { 
  students: Student[], 
  classes: Class[], 
  onSuccess: () => void, 
  onCancel: () => void,
  isDemoMode: boolean,
  setStudents?: React.Dispatch<React.SetStateAction<Student[]>>
}) => {
  const [selectedClassId, setSelectedClassId] = React.useState(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = React.useState('');
  const [points, setPoints] = React.useState('10');
  const [reason, setReason] = React.useState('Presença');
  const [isSaving, setIsSaving] = React.useState(false);

  const classStudents = students.filter(s => s.class_id === selectedClassId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Selecione um aluno');
      return;
    }

    if (isDemoMode) {
      if (setStudents) {
        setStudents(prev => prev.map(s => 
          s.id === selectedStudentId ? { ...s, points: (s.points || 0) + parseInt(points) } : s
        ));
      }
      alert(`Sucesso! ${points} pontos atribuídos a ${students.find(s => s.id === selectedStudentId)?.name}`);
      onSuccess();
      return;
    }

    setIsSaving(true);
    try {
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('points')
        .eq('id', selectedStudentId)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar aluno:', fetchError);
        throw new Error('Não foi possível encontrar o aluno ou a coluna "points" no banco de dados.');
      }

      const currentPoints = student?.points || 0;
      const newPoints = currentPoints + parseInt(points);
      
      const { error: updateError } = await supabase
        .from('students')
        .update({ points: newPoints })
        .eq('id', selectedStudentId);
      
      if (updateError) {
        console.error('Erro ao atualizar pontos:', updateError);
        throw updateError;
      }
      
      alert('Pontos atribuídos com sucesso!');
      onSuccess();
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      const msg = error.message || error.details || 'Erro desconhecido';
      alert('Erro ao atribuir pontos: ' + msg + '\n\nCertifique-se de ter executado o script SQL no Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">Atribuir Pontos</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Turma</label>
          <select 
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedStudentId('');
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Aluno</label>
          <select 
            required
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Selecione o aluno...</option>
            {classStudents.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Pontos</label>
            <input 
              type="number"
              required
              value={points}
              onChange={e => setPoints(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Motivo</label>
            <select 
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Presença">Presença</option>
              <option value="Atividade">Atividade</option>
              <option value="Bônus">Bônus</option>
              <option value="Comportamento">Comportamento</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-slate-950 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Star className="size-5 fill-slate-950" />}
          Confirmar Pontuação
        </button>
      </form>
    </motion.div>
  );
};

const TeachersList = ({ 
  teachers, 
  onNavigate,
  onEdit,
  onDelete,
  userRole
}: { 
  teachers: Teacher[], 
  onNavigate: (view: View) => void,
  onEdit: (teacher: Teacher) => void,
  onDelete: (id: string) => void,
  userRole: UserRole
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('settings')}>
            <ArrowLeft className="size-5 text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Gestão de Professores</h1>
        </div>
        {userRole === 'ADMIN' && (
          <button 
            onClick={() => onNavigate('add-teacher')}
            className="bg-primary/10 text-primary p-2 rounded-full"
          >
            <UserPlus className="size-5" />
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input 
          className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all" 
          placeholder="Buscar professor..." 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredTeachers.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            Nenhum professor encontrado.
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4">
                <Image 
                  src={teacher.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`} 
                  alt={teacher.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{teacher.name}</p>
                  <p className="text-xs text-slate-500">{teacher.email || 'Sem e-mail'}</p>
                </div>
              </div>
              {userRole === 'ADMIN' && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onEdit(teacher)}
                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(teacher.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Plus className="size-5 rotate-45" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const TeacherForm = ({ 
  onSuccess, 
  onCancel,
  initialData,
  isDemoMode 
}: { 
  onSuccess: (data: Teacher) => void; 
  onCancel: () => void;
  initialData?: Teacher | null;
  isDemoMode: boolean;
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [email, setEmail] = React.useState(initialData?.email || '');
  const [phone, setPhone] = React.useState(initialData?.phone || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const teacherData: Teacher = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      avatar_url: initialData?.avatar_url
    };

    if (isDemoMode) {
      alert(`Modo Demo: Professor ${initialData ? 'atualizado' : 'cadastrado'} com sucesso!`);
      onSuccess(teacherData);
      return;
    }

    setIsSaving(true);
    try {
      if (initialData) {
        const { error } = await supabase
          .from('teachers')
          .update({ name, email, phone })
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('teachers').insert({ name, email, phone });
        if (error) throw error;
      }
      onSuccess(teacherData);
    } catch (error: any) {
      alert('Erro ao salvar professor: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">{initialData ? 'Editar Professor' : 'Novo Professor'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
          <input 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ex: João da Silva"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
          <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="joao@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Telefone / WhatsApp</label>
          <input 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="(00) 00000-0000"
          />
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-slate-950 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : (initialData ? <Edit2 className="size-5" /> : <Plus className="size-5" />)}
          {initialData ? 'Salvar Alterações' : 'Cadastrar Professor'}
        </button>
      </form>
    </motion.div>
  );
};

const ReportsView = ({ 
  classes, 
  students, 
  categories,
  onNavigate,
  isDemoMode
}: { 
  classes: Class[], 
  students: Student[], 
  categories: Category[],
  onNavigate: (view: View) => void,
  isDemoMode: boolean
}) => {
  const [isExporting, setIsExporting] = React.useState<string | null>(null);

  // Calculate real data for charts
  const growthData = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        month: months[d.getMonth()],
        year: d.getFullYear(),
        count: 0,
        monthIdx: d.getMonth(),
      };
    });

    students.forEach(student => {
      // Use created_at if available, otherwise assume it's older
      const createdAt = (student as any).created_at ? new Date((student as any).created_at) : null;
      if (createdAt) {
        const m = createdAt.getMonth();
        const y = createdAt.getFullYear();
        const monthData = last6Months.find(d => d.monthIdx === m && d.year === y);
        if (monthData) {
          monthData.count++;
        }
      }
    });

    // Normalize heights (max 100%)
    const maxCount = Math.max(...last6Months.map(d => d.count), 1);
    return last6Months.map(d => ({
      label: d.month,
      height: Math.max((d.count / maxCount) * 100, 5), // Min 5% for visibility
      count: d.count
    }));
  }, [students]);

  const distributionData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    students.forEach(student => {
      const cls = classes.find(c => c.id === student.class_id);
      const category = categories.find(cat => cat.id === cls?.category_id);
      const label = category?.name || 'Outros';
      counts[label] = (counts[label] || 0) + 1;
      total++;
    });

    const colors = ['bg-primary', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];
    
    return Object.entries(counts)
      .map(([label, count], i) => ({
        label,
        value: total > 0 ? Math.round((count / total) * 100) : 0,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }, [students, classes, categories]);

  const downloadCSV = (data: any[], filename: string) => {
    try {
      if (!data || data.length === 0) {
        alert('Não há dados para exportar.');
        return;
      }
      // Add BOM for Excel UTF-8 support
      const BOM = '\uFEFF';
      const headers = Object.keys(data[0]).join(';');
      const rows = data.map(row => 
        Object.values(row).map(val => {
          const s = String(val === null || val === undefined ? '' : val).replace(/"/g, '""');
          return `"${s}"`;
        }).join(';')
      );
      const csvContent = BOM + [headers, ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date().toLocaleDateString('sv-SE');
      link.setAttribute('download', `${filename}_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Erro ao gerar arquivo: ' + err.message);
    }
  };

  const exportAttendance = async () => {
    setIsExporting('attendance');
    try {
      let data;
      if (isDemoMode) {
        // Mock attendance data
        data = students.map(s => ({
          Data: new Date().toLocaleDateString('pt-BR'),
          Aluno: s.name,
          Tipo: s.type === 'VISITOR' ? 'Visitante' : 'Regular',
          Turma: classes.find(c => c.id === s.class_id)?.name || 'N/A',
          Presenca: Math.random() > 0.2 ? 'Presente' : 'Faltou',
          Biblia: Math.random() > 0.3 ? 'Sim' : 'Não',
          Tema: 'Tema Exemplo',
          Referencia: 'Referência Exemplo'
        }));
      } else {
        const { data: attendanceData, error } = await supabase
          .from('attendance')
          .select(`
            date,
            student_id,
            present,
            has_bible,
            teacher_name,
            lesson_theme,
            biblical_reference,
            students (name, type),
            classes (name)
          `)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Deduplicate: keep only the first record per student per day
        // Since we order by date desc, we get the most recent days first.
        // If there are multiple for the same day, we take the first one found.
        const uniqueMap = new Map();
        attendanceData?.forEach((record: any) => {
          const key = `${record.student_id}-${record.date}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, record);
          }
        });

        data = Array.from(uniqueMap.values()).map((record: any) => ({
          Data: record.date ? parseLocalDate(record.date)?.toLocaleDateString('pt-BR') : 'N/A',
          Aluno: record.students?.name || record.student_id || 'N/A',
          Tipo: record.students?.type === 'VISITOR' ? 'Visitante' : 'Regular',
          Turma: record.classes?.name || record.class_id || 'N/A',
          Presenca: record.present ? 'Presente' : 'Faltou',
          Biblia: record.has_bible ? 'Sim' : 'Não',
          Professor: record.teacher_name || 'N/A',
          Tema: record.lesson_theme || 'N/A',
          Referencia: record.biblical_reference || 'N/A'
        }));
      }
      downloadCSV(data, 'lista_presenca');
    } catch (error: any) {
      alert('Erro ao exportar: ' + error.message);
    } finally {
      setIsExporting(null);
    }
  };

  const exportStudents = () => {
    const data = students.map(s => ({
      Nome: s.name,
      Tipo: s.type === 'VISITOR' ? 'Visitante' : 'Regular',
      Turma: classes.find(c => c.id === s.class_id)?.name || 'N/A',
      Status: s.status === 'active' ? 'Ativo' : 'Inativo',
      Pontos: s.points || 0,
      Aniversario: s.birth_date ? parseLocalDate(s.birth_date)?.toLocaleDateString('pt-BR') : 'N/A'
    }));
    downloadCSV(data, 'ficha_alunos');
  };

  const exportRanking = () => {
    const data = [...students]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .map((s, i) => ({
        Posicao: i + 1,
        Nome: s.name,
        Turma: classes.find(c => c.id === s.class_id)?.name || 'N/A',
        Pontos: s.points || 0
      }));
    downloadCSV(data, 'ranking_gamificacao');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">Relatórios e Estatísticas</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* ... (charts remain the same) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary-dark flex items-center justify-center">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="font-bold">Crescimento de Alunos</p>
              <p className="text-xs text-slate-500">Novas matrículas por mês</p>
            </div>
          </div>
          <div className="h-40 flex items-end gap-2 px-2">
            {growthData.map((data, i) => (
              <div key={i} className="flex-1 bg-primary/10 dark:bg-primary/20 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" 
                  style={{ height: `${data.height}%` }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                  {data.count} alunos
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-slate-400">{growthData[0]?.label}</span>
            <span className="text-[10px] text-slate-400">{growthData[growthData.length - 1]?.label}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <PieChart className="size-5" />
            </div>
            <div>
              <p className="font-bold">Distribuição por Categoria</p>
              <p className="text-xs text-slate-500">Alunos por faixa etária</p>
            </div>
          </div>
          <div className="space-y-3">
            {distributionData.length > 0 ? distributionData.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 text-xs py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="font-bold">Relatórios Exportáveis</p>
              <p className="text-xs text-slate-500">Formato CSV (Excel)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={exportAttendance}
              disabled={isExporting !== null}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExporting === 'attendance' ? <Loader2 className="size-3 animate-spin" /> : null}
              Lista de Presença
            </button>
            <button 
              onClick={exportStudents}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold hover:bg-primary/10 transition-colors"
            >
              Ficha de Alunos
            </button>
            <button 
              onClick={exportRanking}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold hover:bg-primary/10 transition-colors"
            >
              Ranking Gami
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationsView = ({ 
  onNavigate,
  birthdayAlertsEnabled,
  setBirthdayAlertsEnabled
}: { 
  onNavigate: (view: View) => void,
  birthdayAlertsEnabled: boolean,
  setBirthdayAlertsEnabled: (val: boolean) => void
}) => {
  const [reminders, setReminders] = React.useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = React.useState(true);
  const [newStudents, setNewStudents] = React.useState(false);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('settings')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-xl font-bold">Notificações</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Lembretes de Chamada</p>
            <p className="text-xs text-slate-500">Notificar aos domingos às 09:00</p>
          </div>
          <button 
            onClick={() => handleToggle(setReminders)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              reminders ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 left-1 size-4 bg-white rounded-full shadow-md transition-transform",
              reminders && "translate-x-5"
            )} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Alertas de Frequência Baixa</p>
            <p className="text-xs text-slate-500">Avisar quando um aluno faltar 3 domingos</p>
          </div>
          <button 
            onClick={() => handleToggle(setAttendanceAlerts)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              attendanceAlerts ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 left-1 size-4 bg-white rounded-full shadow-md transition-transform",
              attendanceAlerts && "translate-x-5"
            )} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Novos Alunos</p>
            <p className="text-xs text-slate-500">Notificar quando um novo aluno for cadastrado</p>
          </div>
          <button 
            onClick={() => handleToggle(setNewStudents)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              newStudents ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 left-1 size-4 bg-white rounded-full shadow-md transition-transform",
              newStudents && "translate-x-5"
            )} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Aniversariantes da Semana</p>
            <p className="text-xs text-slate-500">Alertar sobre alunos que fazem aniversário nos próximos 7 dias</p>
          </div>
          <button 
            onClick={() => setBirthdayAlertsEnabled(!birthdayAlertsEnabled)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              birthdayAlertsEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 left-1 size-4 bg-white rounded-full shadow-md transition-transform",
              birthdayAlertsEnabled && "translate-x-5"
            )} />
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
        <div className="flex gap-3">
          <Bell className="size-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            As notificações ajudam você a manter a EBD organizada e não esquecer de registrar a presença dos alunos.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const UserManagementView = ({ onNavigate, isDemoMode }: { onNavigate: (view: View) => void, isDemoMode: boolean }) => {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  const fetchProfiles = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        // Mock profiles for demo mode
        setProfiles([
          { id: 'demo-1', name: 'Admin Demo', email: 'admin@demo.com', role: 'ADMIN' },
          { id: 'demo-2', name: 'Professor Demo', email: 'professor@demo.com', role: 'TEACHER' },
        ]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      alert('Erro ao carregar perfis: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  React.useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleUpdateRole = async (profileId: string, newRole: UserRole) => {
    setIsUpdating(profileId);
    try {
      if (isDemoMode) {
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, role: newRole } : p));
        setIsUpdating(null);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);
      
      if (error) throw error;
      
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, role: newRole } : p));
    } catch (err: any) {
      alert('Erro ao atualizar cargo: ' + err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('settings')}
          className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 shadow-sm transition-all active:scale-90"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h2>
        <button 
          onClick={fetchProfiles}
          disabled={isLoading}
          className="ml-auto size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 shadow-sm transition-all active:scale-90 disabled:opacity-50"
          title="Recarregar"
        >
          <ArchiveRestore className={cn("size-5", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuários Cadastrados</p>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Carregando perfis...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-slate-300" />
            </div>
            <p className="font-bold text-slate-400">Nenhum usuário encontrado</p>
            {!isDemoMode && (
              <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-2">
                Dica: Verifique se a tabela &apos;profiles&apos; foi criada no Supabase e se as políticas de RLS permitem a leitura.
              </p>
            )}
            <button 
              onClick={fetchProfiles}
              className="text-xs font-bold text-primary uppercase tracking-widest mt-4 hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {profiles.map((profile) => (
              <div key={profile.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <UserCog className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{profile.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Mail className="size-3" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={profile.role}
                    disabled={isUpdating === profile.id}
                    onChange={(e) => handleUpdateRole(profile.id, e.target.value as UserRole)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest p-2 rounded-lg border outline-none transition-all",
                      profile.role === 'ADMIN' 
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-indigo-100 dark:border-indigo-800" 
                        : "bg-orange-50 dark:bg-orange-900/30 text-orange-600 border-orange-100 dark:border-orange-800"
                    )}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="TEACHER">PROFESSOR</option>
                  </select>
                  {isUpdating === profile.id && <Loader2 className="size-3 animate-spin text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
        <div className="flex gap-3">
          <ShieldCheck className="size-5 text-blue-500 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Dica de Segurança</p>
            <p className="text-xs text-blue-600 dark:text-blue-500/80 leading-relaxed">
              Usuários com cargo <b>ADMIN</b> têm acesso total ao sistema, incluindo configurações e exclusão de dados. Atribua este cargo apenas a pessoas de confiança.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsView = ({ 
  onNavigate,
  churchName,
  setChurchName,
  churchLogo,
  setChurchLogo,
  userRole,
  onLogout
}: { 
  onNavigate: (view: View) => void,
  churchName: string,
  setChurchName: (name: string) => void,
  churchLogo: string,
  setChurchLogo: (logo: string) => void,
  userRole: UserRole,
  onLogout: () => void
}) => {
  const [newPassword, setNewPassword] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    
    setIsUpdating(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ text: 'Senha atualizada com sucesso!', type: 'success' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Erro ao atualizar senha.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informações da Conta</p>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center",
              userRole === 'ADMIN' ? "bg-indigo-100 text-indigo-600" : "bg-orange-100 text-orange-600"
            )}>
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">{userRole === 'ADMIN' ? 'Administrador' : 'Professor'}</p>
              <p className="text-[10px] text-slate-500">Seu nível de acesso no sistema</p>
            </div>
          </div>
          {userRole === 'ADMIN' && (
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Acesso Total</span>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personalização do App</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome da Igreja / Admin</label>
            <input 
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: Igreja Batista Central"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">URL da Logo (Link da Imagem)</label>
            <input 
              value={churchLogo}
              onChange={(e) => setChurchLogo(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://link-da-imagem.com/logo.png"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Segurança da Conta</p>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Nova Senha</label>
            <div className="flex gap-2">
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Digite a nova senha"
              />
              <button 
                type="submit"
                disabled={isUpdating || !newPassword}
                className="bg-primary text-slate-950 px-4 py-2 rounded-xl font-bold text-xs disabled:opacity-50 transition-all active:scale-95"
              >
                {isUpdating ? <Loader2 className="size-4 animate-spin" /> : 'Alterar'}
              </button>
            </div>
          </div>
          {message && (
            <p className={cn(
              "text-[10px] font-bold text-center uppercase tracking-widest",
              message.type === 'success' ? "text-primary" : "text-red-500"
            )}>
              {message.text}
            </p>
          )}
        </form>
      </div>
      
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase px-1">Gestão</p>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
        <button 
          onClick={() => onNavigate('categories')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Settings className="size-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Categorias de Turmas</p>
              <p className="text-xs text-slate-500">Gerenciar nomes e cores</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-300" />
        </button>

        <button 
          onClick={() => onNavigate('teachers')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="size-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Professores</p>
              <p className="text-xs text-slate-500">Gerenciar equipe docente</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-300" />
        </button>

        {userRole === 'ADMIN' && (
          <button 
            onClick={() => onNavigate('user-management')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Gestão de Usuários</p>
                <p className="text-xs text-slate-500">Gerenciar permissões e perfis</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-slate-300" />
          </button>
        )}

        <button 
          onClick={() => onNavigate('reports')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary-dark flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Relatórios Detalhados</p>
              <p className="text-xs text-slate-500">Estatísticas e exportação</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-300" />
        </button>
        
        <button 
          onClick={() => onNavigate('notifications')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bell className="size-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Notificações</p>
              <p className="text-xs text-slate-500">Lembretes de chamada</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-300" />
        </button>

        <button 
          onClick={() => {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => alert('O navegador bloqueou o som. Clique na tela e tente novamente.'));
          }}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bell className="size-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Testar Alarme</p>
              <p className="text-xs text-slate-500">Verificar se o som está funcionando</p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase">Testar</div>
        </button>
      </div>
    </div>

    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-500 uppercase px-1">Conta</p>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="p-4 flex items-center gap-3">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            <UserCircle className="size-8 text-slate-300" />
          </div>
          <div>
            <p className="font-bold">Administrador</p>
            <p className="text-xs text-slate-500">admin@ebddigital.com</p>
          </div>
        </div>
      </div>
    </div>

    <div className="pt-6">
      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
      >
        <LogOut className="size-5" />
        Sair do Sistema
      </button>
    </div>
  </motion.div>
  );
};

const ClassTimer = ({ startTime, onComplete }: { startTime: number, onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = React.useState(3000); // 50 min
  const [alarmPlayed, setAlarmPlayed] = React.useState(false);

  React.useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = 3000 - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        onComplete();
      } else {
        setTimeLeft(remaining);
        // Alarm at 40 minutes (10 minutes remaining)
        if (remaining <= 600 && !alarmPlayed) {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log('Audio play blocked', e));
          setAlarmPlayed(true);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime, alarmPlayed, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-24 right-4 z-[60] bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in fade-in slide-in-from-right-4">
      <div className="size-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Aula em curso</span>
        <span className="text-xl font-mono font-bold leading-none tabular-nums">{formatTime(timeLeft)}</span>
      </div>
      {timeLeft <= 600 && (
        <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shadow-lg animate-bounce">
          <Bell className="size-4" />
        </div>
      )}
      <button 
        onClick={onComplete}
        className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Plus className="size-4 rotate-45 opacity-50" />
      </button>
    </div>
  );
};

// --- Main App ---

function EBDAppContent() {
  const [session, setSession] = React.useState<any>(null);

  const [userRole, setUserRole] = React.useState<UserRole>('ADMIN');
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<View>('dashboard');
  const [classes, setClasses] = React.useState<Class[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [churchName, setChurchName] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ebd_church_name') || 'Admin EBD';
    }
    return 'Admin EBD';
  });
  const [churchLogo, setChurchLogo] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ebd_church_logo') || '/logo.png';
    }
    return '/logo.png';
  });
  const [logoError, setLogoError] = React.useState(false);

  // Reset logo error when logo URL changes
  React.useEffect(() => {
    setLogoError(false);
  }, [churchLogo]);
  const [recentAttendance, setRecentAttendance] = React.useState<any[]>([]);
  const [sessionStartTime, setSessionStartTime] = React.useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<Class | null>(null);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = React.useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isDemoMode, setIsDemoMode] = React.useState(false);
  const isDemoModeRef = React.useRef(isDemoMode);
  React.useEffect(() => {
    isDemoModeRef.current = isDemoMode;
  }, [isDemoMode]);

  const [birthdayAlertsEnabled, setBirthdayAlertsEnabled] = React.useState(true);
  const [confirmDelete, setConfirmDelete] = React.useState<{ id: string, type: 'class' | 'student' | 'teacher' | 'category', name: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<'connected' | 'error' | 'demo' | 'checking'>('checking');

  const hasKeys = React.useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && 
           !url.includes('placeholder') && 
           !url.includes('your-project-id') &&
           url !== 'https://.supabase.co');
  }, []);

  // Defensive timeout to prevent infinite loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthLoading) {
        console.warn('Auth loading timeout reached. Forcing auth loading to false.');
        setIsAuthLoading(false);
      }
      if (isLoading && (session || isDemoMode)) {
        console.warn('Data loading timeout reached. Forcing loading to false.');
        setIsLoading(false);
      }
    }, 8000); // 8 seconds timeout
    return () => clearTimeout(timer);
  }, [isAuthLoading, isLoading, session, isDemoMode]);

  React.useEffect(() => {
    const savedStartTime = localStorage.getItem('ebd_session_start_time');
    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      if (elapsed < 3000) { // 50 minutes
        setSessionStartTime(startTime);
        setIsTimerActive(true);
      } else {
        localStorage.removeItem('ebd_session_start_time');
      }
    }
  }, []);

  React.useEffect(() => {
    const checkConnection = async () => {
      console.log('Checking connection status...', { hasKeys, isDemoMode });
      if (!hasKeys) {
        setConnectionStatus('demo');
        return;
      }

      try {
        const { error } = await supabase.from('categories').select('id').limit(1);
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
        } else {
          console.log('Supabase connected successfully');
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error('Supabase connection exception:', err);
        setConnectionStatus('error');
      }
    };

    checkConnection();
  }, [hasKeys, isDemoMode]);

  React.useEffect(() => {
    localStorage.setItem('ebd_church_name', churchName);
  }, [churchName]);

  React.useEffect(() => {
    localStorage.setItem('ebd_church_logo', churchLogo);
  }, [churchLogo]);

  const startClassTimer = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsTimerActive(true);
    localStorage.setItem('ebd_session_start_time', now.toString());
  };

  const stopClassTimer = () => {
    setSessionStartTime(null);
    setIsTimerActive(false);
    localStorage.removeItem('ebd_session_start_time');
  };

  const handleDeleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (!cls) return;
    
    // Check if there are students in this class
    const studentsInClass = students.filter(s => s.class_id === id);
    if (studentsInClass.length > 0) {
      alert(`Não é possível excluir esta turma pois ela possui ${studentsInClass.length} aluno(s) vinculado(s). Por favor, mova ou exclua os alunos primeiro.`);
      return;
    }

    setConfirmDelete({ id, type: 'class', name: cls.name });
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    setIsDeleting(true);

    try {
      if (type === 'class') {
        if (isDemoMode) {
          setClasses(prev => prev.filter(c => c.id !== id));
        } else {
          // Check for attendance records as well (database constraint)
          const { count: attendanceCount, error: attError } = await supabase
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', id);
          
          if (!attError && attendanceCount && attendanceCount > 0) {
            alert(`Não é possível excluir esta turma pois existem ${attendanceCount} registros de chamada vinculados a ela. Tente arquivar a turma em vez de excluir.`);
            setIsDeleting(false);
            setConfirmDelete(null);
            return;
          }

          const { error } = await supabase.from('classes').delete().eq('id', id);
          if (error) {
            if (error.code === '23503') {
              throw new Error('Esta turma possui registros vinculados e não pode ser excluída. Tente arquivar.');
            }
            throw error;
          }
          await fetchData();
        }
      } else if (type === 'student') {
        if (isDemoMode) {
          setStudents(prev => prev.filter(s => s.id !== id));
        } else {
          const { error } = await supabase.from('students').delete().eq('id', id);
          if (error) throw error;
          await fetchData();
        }
      } else if (type === 'teacher') {
        if (isDemoMode) {
          setTeachers(prev => prev.filter(t => t.id !== id));
        } else {
          const { error } = await supabase.from('teachers').delete().eq('id', id);
          if (error) throw error;
          await fetchData();
        }
      } else if (type === 'category') {
        if (isDemoMode) {
          setCategories(prev => prev.filter(c => c.id !== id));
        } else {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
          await fetchData();
        }
      }
      setConfirmDelete(null);
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleArchiveClass = async (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (!cls) return;

    const newStatus = cls.status === 'active' ? 'archived' : 'active';
    const actionLabel = newStatus === 'active' ? 'restaurar' : 'arquivar';

    if (!confirm(`Deseja realmente ${actionLabel} esta turma?`)) return;

    if (isDemoMode) {
      setClasses(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      return;
    }

    try {
      const { error } = await supabase.from('classes').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert(`Erro ao ${actionLabel} turma: ` + error.message);
    }
  };

  const handleDeleteTeacher = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    setConfirmDelete({ id, type: 'teacher', name: teacher.name });
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    setConfirmDelete({ id, type: 'student', name: student.name });
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    setConfirmDelete({ id, type: 'category', name: category.name });
  };

  const fetchProfile = React.useCallback(async (user: any) => {
    if (!user) return;
    
    if (!hasKeys) {
      setUserRole('ADMIN');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      // Hardcoded admin check for the owner
      const isOwnerEmail = user.email === 'allopes@gmail.com';

      if (error) {
        if (error.code === 'PGRST116') {
          // Check if this is the first user
          const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const isFirstUser = count === 0;

          const newProfile: Profile = {
            id: user.id,
            email: user.email || '',
            role: (isFirstUser || isOwnerEmail) ? 'ADMIN' : 'TEACHER',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
          };
          
          await supabase.from('profiles').insert(newProfile);
          setUserProfile(newProfile);
          setUserRole(newProfile.role);
        }
      } else if (data) {
        // Force admin if email matches
        if (isOwnerEmail && data.role !== 'ADMIN') {
          await supabase.from('profiles').update({ role: 'ADMIN' }).eq('id', user.id);
          data.role = 'ADMIN';
        }
        setUserProfile(data);
        setUserRole(data.role);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUserRole('ADMIN');
    }
  }, [hasKeys]);

  React.useEffect(() => {
    if (!hasKeys) {
      setIsAuthLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user);
      }
      setIsAuthLoading(false);
    }).catch(err => {
      console.error('Error getting session:', err);
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user);
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentView('settings');
        alert('Você foi redirecionado para alterar sua senha. Por favor, digite a nova senha abaixo.');
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, hasKeys]);

  const fetchData = React.useCallback(async () => {
    // If not logged in and not in demo mode, don't fetch
    if (!session && !isDemoMode) return;

    if (!hasKeys || isDemoMode) {
      console.log('Using mock data: Supabase keys not configured or in demo mode.');
      setClasses(MOCK_CLASSES);
      setStudents(MOCK_STUDENTS);
      setTeachers(MOCK_TEACHERS);
      setCategories(MOCK_CATEGORIES);
      setIsDemoMode(true);
      setConnectionStatus('demo');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsDemoMode(false);
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) throw categoriesError;

      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      
      if (classesError) throw classesError;

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (studentsError) throw studentsError;

      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .order('name');
      
      if (teachersError) throw teachersError;

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*, classes(name)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (attendanceError) {
        console.warn('Attendance table might not exist yet or error:', attendanceError);
      } else {
        setRecentAttendance(attendanceData || []);
      }

      setCategories(categoriesData || []);
      setClasses(classesData || []);
      setStudents(studentsData || []);
      setTeachers(teachersData || []);
      setConnectionStatus('connected');
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setConnectionStatus('error');
      // Supabase errors sometimes have 'message', sometimes 'details', sometimes 'hint'
      const errorMessage = err.message || err.details || err.hint || JSON.stringify(err);
      setError(errorMessage === '{}' ? 'Erro de conexão com o Supabase. Verifique se as tabelas foram criadas.' : errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, hasKeys, isDemoMode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, isDemoMode]);

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      // Clear local state immediately for better UX
      setIsDemoMode(false);
      setSession(null);
      setUserProfile(null);
      setConnectionStatus('checking');
      setCurrentView('dashboard');
      
      // Attempt to sign out from Supabase if not in demo mode
      if (!isDemoMode) {
        await supabase.auth.signOut();
      }
      console.log('Logout successful');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f8f7] dark:bg-[#102219] gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="size-24 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center overflow-hidden border-2 border-primary/20">
            {churchLogo && !logoError ? (
              <Image 
                src={churchLogo} 
                alt="Logo" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <BookOpen className="size-12 text-primary" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        </motion.div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{churchName}</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Iniciando sistema...</p>
        </div>
      </div>
    );
  }

  if (!session && !isDemoMode) {
    return <LoginForm 
      onLoginSuccess={(session) => {
        setSession(session);
        setConnectionStatus('checking');
      }} 
      onDemoMode={() => {
        setIsDemoMode(true);
        setConnectionStatus('demo');
      }}
    />;
  }

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="size-20 rounded-xl bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center overflow-hidden border border-primary/10"
          >
            {churchLogo && !logoError ? (
              <Image 
                src={churchLogo} 
                alt="Logo" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <BookOpen className="size-10 text-primary" />
            )}
          </motion.div>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Carregando dados...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">
            <Plus className="size-8 rotate-45" />
          </div>
          <h3 className="font-bold text-lg">Ops! Algo deu errado</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{error}</p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button 
              onClick={fetchData}
              className="bg-primary text-slate-950 px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={() => {
                setIsDemoMode(true);
                setError(null);
              }}
              className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform"
            >
              Usar Modo de Demonstração
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            Dica: Verifique se você executou as migrations no SQL Editor do Supabase.
          </p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard': return (
        <Dashboard 
          onNavigate={setCurrentView} 
          classes={classes} 
          students={students} 
          birthdayAlertsEnabled={birthdayAlertsEnabled}
          userRole={userRole}
          recentAttendance={recentAttendance}
          onLogout={handleLogout}
        />
      );
      case 'classes': return (
        <ClassesList 
          classes={classes} 
          categories={categories} 
          students={students}
          onNavigate={setCurrentView} 
          onEdit={(cls) => {
            setEditingClass(cls);
            setCurrentView('edit-class');
          }}
          onDelete={handleDeleteClass}
          onToggleArchive={handleToggleArchiveClass}
          userRole={userRole}
        />
      );
      case 'students': return (
        <StudentsList 
          students={students} 
          classes={classes} 
          onNavigate={setCurrentView} 
          onEdit={(student) => {
            setEditingStudent(student);
            setCurrentView('edit-student');
          }}
          onDelete={handleDeleteStudent}
          userRole={userRole}
        />
      );
      case 'attendance': return (
        <AttendanceRollCall 
          onNavigate={setCurrentView} 
          students={students} 
          classes={classes} 
          isDemoMode={isDemoMode}
          onStartTimer={startClassTimer}
          onSuccess={fetchData}
        />
      );
      case 'add-student': return (
        <StudentForm 
          classes={classes} 
          isDemoMode={isDemoMode}
          onSuccess={async (newStudent) => { 
            setStudents(prev => {
              const exists = prev.find(s => s.id === newStudent.id);
              if (exists) return prev.map(s => s.id === newStudent.id ? newStudent : s);
              return [...prev, newStudent];
            });
            setCurrentView('students'); 
            await fetchData(); 
          }} 
          onCancel={() => setCurrentView('students')} 
        />
      );
      case 'edit-student': return (
        <StudentForm 
          classes={classes} 
          initialData={editingStudent}
          isDemoMode={isDemoMode}
          onSuccess={async (updatedStudent) => { 
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            setEditingStudent(null);
            setCurrentView('students'); 
            await fetchData(); 
          }} 
          onCancel={() => {
            setEditingStudent(null);
            setCurrentView('students');
          }} 
        />
      );
      case 'add-class': return (
        <ClassForm 
          categories={categories}
          teachers={teachers}
          isDemoMode={isDemoMode}
          onSuccess={async (newClass) => { 
            setClasses(prev => {
              const exists = prev.find(c => c.id === newClass.id);
              if (exists) return prev.map(c => c.id === newClass.id ? newClass : c);
              return [...prev, newClass];
            });
            setCurrentView('classes'); 
            await fetchData(); 
          }} 
          onCancel={() => setCurrentView('classes')} 
        />
      );
      case 'edit-class': return (
        <ClassForm 
          categories={categories}
          teachers={teachers}
          initialData={editingClass}
          isDemoMode={isDemoMode}
          onSuccess={async (updatedClass) => { 
            setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
            setEditingClass(null);
            setCurrentView('classes'); 
            await fetchData(); 
          }} 
          onCancel={() => {
            setEditingClass(null);
            setCurrentView('classes');
          }} 
        />
      );
      case 'categories': return (
        <CategoriesList 
          categories={categories} 
          onNavigate={setCurrentView} 
          onDelete={handleDeleteCategory}
          isDemoMode={isDemoMode}
          onRefresh={fetchData}
        />
      );
      case 'add-category': return (
        <CategoryForm 
          isDemoMode={isDemoMode}
          onSuccess={(newCat) => { 
            if (isDemoMode) {
              setCategories(prev => [...prev, newCat]);
            }
            fetchData(); 
            setCurrentView('categories'); 
          }} 
          onCancel={() => setCurrentView('categories')} 
        />
      );
      case 'notifications': return (
        <NotificationsView 
          onNavigate={setCurrentView} 
          birthdayAlertsEnabled={birthdayAlertsEnabled}
          setBirthdayAlertsEnabled={setBirthdayAlertsEnabled}
        />
      );
      case 'reports': return <ReportsView classes={classes} students={students} categories={categories} onNavigate={setCurrentView} isDemoMode={isDemoMode} />;
      case 'teachers': return (
        <TeachersList 
          teachers={teachers} 
          onNavigate={setCurrentView} 
          onEdit={(teacher) => {
            setEditingTeacher(teacher);
            setCurrentView('edit-teacher');
          }}
          onDelete={handleDeleteTeacher}
          userRole={userRole}
        />
      );
      case 'add-teacher': return (
        <TeacherForm 
          isDemoMode={isDemoMode}
          onSuccess={(newTeacher) => { 
            setTeachers(prev => {
              const exists = prev.find(t => t.id === newTeacher.id);
              if (exists) return prev.map(t => t.id === newTeacher.id ? newTeacher : t);
              return [...prev, newTeacher];
            });
            fetchData(); 
            setCurrentView('teachers'); 
          }} 
          onCancel={() => setCurrentView('teachers')} 
        />
      );
      case 'edit-teacher': return (
        <TeacherForm 
          isDemoMode={isDemoMode}
          initialData={editingTeacher}
          onSuccess={(updatedTeacher) => { 
            setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
            setEditingTeacher(null);
            fetchData(); 
            setCurrentView('teachers'); 
          }} 
          onCancel={() => {
            setEditingTeacher(null);
            setCurrentView('teachers');
          }} 
        />
      );
      case 'gamification': return <GamificationView students={students} classes={classes} onNavigate={setCurrentView} />;
      case 'add-points': return (
        <AddPointsForm 
          students={students} 
          classes={classes} 
          isDemoMode={isDemoMode}
          setStudents={setStudents}
          onSuccess={() => { fetchData(); setCurrentView('gamification'); }} 
          onCancel={() => setCurrentView('gamification')} 
        />
      );
      case 'settings': return (
        <SettingsView 
          onNavigate={setCurrentView} 
          churchName={churchName}
          setChurchName={setChurchName}
          churchLogo={churchLogo}
          setChurchLogo={setChurchLogo}
          userRole={userRole}
          onLogout={handleLogout}
        />
      );
      case 'user-management': return <UserManagementView onNavigate={setCurrentView} isDemoMode={isDemoMode} />;
      default: return <Dashboard onNavigate={setCurrentView} classes={classes} students={students} birthdayAlertsEnabled={birthdayAlertsEnabled} userRole={userRole} recentAttendance={recentAttendance} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-950 shadow-2xl relative overflow-x-hidden">
      {/* Demo Banner */}
      {isDemoMode && (
        <div className="bg-amber-500 text-white text-[10px] font-bold py-1 px-4 text-center uppercase tracking-widest">
          Modo de Demonstração (Sem Supabase)
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-primary/10 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-primary/10 shadow-sm relative">
              {churchLogo && !logoError ? (
                <Image 
                  src={churchLogo} 
                  alt="Logo" 
                  fill
                  className="object-contain p-1" 
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <BookOpen className="size-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                Bem-vindo,
                {userRole === 'ADMIN' && (
                  <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">ADMIN</span>
                )}
                <span className="text-[8px] text-slate-400 font-medium">v1.0.7</span>
                <span 
                  className={cn(
                    "w-2.5 h-2.5 rounded-full inline-block border border-white/20 shadow-sm",
                    connectionStatus === 'connected' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                    connectionStatus === 'error' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                    connectionStatus === 'demo' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                    "bg-slate-400 animate-pulse"
                  )}
                  title={
                    connectionStatus === 'connected' ? "Conectado ao Supabase" :
                    connectionStatus === 'error' ? "Erro de conexão" :
                    connectionStatus === 'demo' ? "Modo de Demonstração" :
                    "Verificando conexão..."
                  }
                />
              </p>
              <h1 className="text-lg font-bold leading-tight">{churchName}</h1>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            title="Sair do Sistema"
          >
            <LogOut className="size-5" />
            <span className="text-sm font-bold hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {renderView()}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setConfirmDelete(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                <Trash2 className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Tem certeza que deseja excluir <b>{confirmDelete.name}</b>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="size-4 animate-spin" /> : 'Excluir'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {['dashboard', 'classes', 'students'].includes(currentView) && !isLoading && !error && userRole === 'ADMIN' && (
        <button 
          onClick={() => {
            if (currentView === 'classes') setCurrentView('add-class');
            else setCurrentView('add-student');
          }}
          className="fixed bottom-24 right-6 size-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-transform z-40"
        >
          <Plus className="size-8" />
        </button>
      )}

      {/* Bottom Nav */}
      {isTimerActive && sessionStartTime && (
        <ClassTimer 
          startTime={sessionStartTime} 
          onComplete={stopClassTimer} 
        />
      )}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-primary/10 flex justify-around items-center py-3 px-4 z-50">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === 'dashboard' ? "text-primary" : "text-slate-400"
          )}
        >
          <Home className={cn("size-6", currentView === 'dashboard' && "fill-primary/20")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Início</span>
        </button>
        <button 
          onClick={() => setCurrentView('attendance')}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === 'attendance' ? "text-primary" : "text-slate-400"
          )}
        >
          <BarChart3 className={cn("size-6", currentView === 'attendance' && "fill-primary/20")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Chamada</span>
        </button>
        <button 
          onClick={() => setCurrentView('students')}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === 'students' ? "text-primary" : "text-slate-400"
          )}
        >
          <UserCircle className={cn("size-6", currentView === 'students' && "fill-primary/20")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Alunos</span>
        </button>
        <button 
          onClick={() => setCurrentView('gamification')}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === 'gamification' ? "text-primary" : "text-slate-400"
          )}
        >
          <Trophy className={cn("size-6", currentView === 'gamification' && "fill-primary/20")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Gami</span>
        </button>
        <button 
          onClick={() => setCurrentView('classes')}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            currentView === 'classes' ? "text-primary" : "text-slate-400"
          )}
        >
          <Users className={cn("size-6", currentView === 'classes' && "fill-primary/20")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Turmas</span>
        </button>
        {userRole === 'ADMIN' && (
          <button 
            onClick={() => setCurrentView('settings')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              currentView === 'settings' ? "text-primary" : "text-slate-400"
            )}
          >
            <Settings className={cn("size-6", currentView === 'settings' && "fill-primary/20")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Config</span>
          </button>
        )}
      </nav>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950 text-center">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full">
            <div className="size-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="size-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ops! Algo deu errado</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Ocorreu um erro inesperado no aplicativo. Por favor, tente recarregar a página.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 text-left overflow-auto max-h-40">
              <code className="text-xs text-red-500 dark:text-red-400">
                {this.state.error?.message || (typeof this.state.error === 'object' ? "Erro de carregamento ou rede" : String(this.state.error))}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function EBDApp() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-slate-950" />;
  }

  return (
    <ErrorBoundary>
      <EBDAppContent />
    </ErrorBoundary>
  );
}

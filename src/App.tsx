import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Plus, 
  AlertTriangle, 
  Wind, 
  ShieldAlert, 
  Activity,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  Edit2,
  Info,
  RotateCcw,
  Save,
  Download,
  UserPlus,
  LogOut,
  Key,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ICCConfig, PatientRecord, UnitStats, User } from './types';
import { DEFAULT_ICC_CONFIG, UNITS } from './constants';

// --- Components ---

const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-blue-200">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">ICC Rehab</h1>
          <p className="text-slate-500 mt-2">Gestión de Complejidad de Cuidados</p>
        </div>
        
        <Card className="shadow-xl border-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Usuario</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-rose-500 text-sm font-medium text-center">{error}</p>}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>
        </Card>
        <p className="text-center text-slate-400 text-xs mt-8 uppercase tracking-widest">© - ehernandez 2026</p>
      </motion.div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    yellow: "bg-amber-50 text-amber-600 border-amber-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const KPI = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <Card className="flex items-center space-x-4">
    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </Card>
);

// --- Pages ---

const PasswordChangeForm = ({ username, onSubmit, onCancel }: { username: string, onSubmit: (pass: string) => void, onCancel: () => void }) => {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.length < 4) return setError('La contraseña debe tener al menos 4 caracteres');
    if (pass !== confirmPass) return setError('Las contraseñas no coinciden');
    onSubmit(pass);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500 mb-4">Cambiando contraseña para: <span className="font-bold text-slate-700">{username}</span></p>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nueva Contraseña</label>
        <input 
          type="password" 
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmar Contraseña</label>
        <input 
          type="password" 
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={confirmPass}
          onChange={e => setConfirmPass(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">Actualizar</button>
      </div>
    </form>
  );
};

const Dashboard = ({ records, config }: { records: PatientRecord[], config: ICCConfig }) => {
  const statsByUnit = UNITS.map(unit => {
    const unitRecords = records.filter(r => r.unit === unit);
    const avgScore = unitRecords.length > 0 
      ? unitRecords.reduce((acc, r) => acc + (r.totalScore as number), 0) / unitRecords.length 
      : 0;
    
    const categories: Record<string, number> = { Baja: 0, Media: 0, Alta: 0, "Muy Alta": 0 };
    const alerts = { 
      vm: unitRecords.filter(r => r.alerts.vm).map(r => r.patientId),
      fuga: unitRecords.filter(r => r.alerts.fuga).map(r => r.patientId),
      aislamiento: unitRecords.filter(r => r.alerts.aislamiento).map(r => r.patientId),
      lpp: unitRecords.filter(r => r.alerts.lpp).map(r => r.patientId)
    };

    unitRecords.forEach(r => {
      categories[r.category]++;
    });

    const getUnitColor = (score: number) => {
      const threshold = config.thresholds.find(t => score >= t.min && score <= t.max);
      return threshold?.color || "#3b82f6";
    };

    return {
      unit,
      patientCount: unitRecords.length,
      avgScore: parseFloat(avgScore.toFixed(1)),
      categories,
      alerts,
      color: getUnitColor(avgScore)
    };
  });

  const totalPatients = records.length;
  const avgComplexity = totalPatients > 0 
    ? (records.reduce((acc, r) => acc + (r.totalScore as number), 0) / totalPatients).toFixed(1)
    : 0;
  const veryHighPct = totalPatients > 0 
    ? ((records.filter(r => r.category === "Muy Alta").length / totalPatients) * 100).toFixed(1)
    : 0;
  const vmPct = totalPatients > 0 
    ? ((records.filter(r => r.alerts.vm).length / totalPatients) * 100).toFixed(1)
    : 0;
  const lppPct = totalPatients > 0 
    ? ((records.filter(r => r.alerts.lpp).length / totalPatients) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPI label="Total Pacientes" value={totalPatients} icon={Users} color="blue" />
        <KPI label="Complejidad Media" value={avgComplexity} icon={Activity} color="orange" />
        <KPI label="% Muy Alta" value={`${veryHighPct}%`} icon={AlertTriangle} color="red" />
        <KPI label="% VM 24h" value={`${vmPct}%`} icon={Wind} color="indigo" />
        <KPI label="% LPP III-IV" value={`${lppPct}%`} icon={ShieldAlert} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Complejidad por Unidad de Hospitalización</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsByUnit}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="unit" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="avgScore" radius={[4, 4, 0, 0]} barSize={60}>
                  {statsByUnit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribución por Unidad</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-medium">Unidad</th>
                  <th className="pb-3 font-medium text-center">Pac.</th>
                  <th className="pb-3 font-medium text-center">ICC</th>
                  <th className="pb-3 font-medium text-right">Cat.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statsByUnit.map((u) => (
                  <tr key={u.unit} className="group">
                    <td className="py-3 font-semibold text-slate-700">{u.unit}</td>
                    <td className="py-3 text-center text-slate-600">{u.patientCount}</td>
                    <td className="py-3 text-center font-mono text-slate-600">{u.avgScore}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end space-x-1">
                        {Object.entries(u.categories).map(([cat, count]) => (
                          count > 0 && (
                            <div key={cat} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{backgroundColor: config.thresholds.find(t => t.label === cat)?.color}}>
                              {count}
                            </div>
                          )
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6">Alertas Críticas por Unidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsByUnit.map((u) => (
            <Card key={u.unit} className="relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-black text-slate-900">{u.unit}</h4>
                <Badge color="blue">{u.patientCount} pac.</Badge>
              </div>
              <div className="space-y-3">
                <AlertItem label="VM 24h" count={u.alerts.vm.length} patients={u.alerts.vm} icon={Wind} color="indigo" />
                <AlertItem label="LPP Cat. III-IV" count={u.alerts.lpp.length} patients={u.alerts.lpp} icon={ShieldAlert} color="rose" />
                <AlertItem label="Riesgo Fuga" count={u.alerts.fuga.length} patients={u.alerts.fuga} icon={AlertTriangle} color="amber" />
                <AlertItem label="Aislamiento" count={u.alerts.aislamiento.length} patients={u.alerts.aislamiento} icon={ShieldAlert} color="slate" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatientForm = ({ onSave, onCancel, initialData, config, onShowNotification }: { 
  onSave: (data: any) => void, 
  onCancel: () => void, 
  initialData?: PatientRecord, 
  config: ICCConfig,
  onShowNotification: (message: string, type?: 'success' | 'error') => void
}) => {
  const [formData, setFormData] = useState<{
    patientId: string;
    unit: string;
    bed: string;
    scores: Record<string, number>;
  }>({
    patientId: initialData?.patientId || '',
    unit: initialData?.unit || UNITS[0],
    bed: initialData?.bed || '',
    scores: initialData?.scores || {}
  });

  const calculateICC = () => {
    const scores = formData.scores;
    const total = Object.keys(scores).reduce((acc, key) => acc + (scores[key] || 0), 0);
    const category = config.thresholds.find(t => total >= t.min && total <= t.max)?.label || "Baja";
    
    // Alert logic based on specific scores
    const alerts = {
      vm: (scores['respiratorio'] || 0) >= 12,
      fuga: (scores['conducta'] || 0) === 5,
      aislamiento: (scores['aislamiento'] || 0) === 4,
      lpp: (scores['cutanea'] || 0) === 10
    };

    return { total, category, alerts };
  };

  const { total, category, alerts } = calculateICC();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.bed) return onShowNotification("Por favor complete ID y Cama", "error");
    
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...formData,
      date: new Date().toISOString(),
      totalScore: total,
      category,
      alerts
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">{initialData ? 'Editar Registro' : 'Nuevo Registro ICC'}</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold">ICC Calculado</p>
              <p className="text-3xl font-black text-blue-600">{total}</p>
            </div>
            <Badge color={total > 60 ? 'red' : total > 40 ? 'orange' : total > 20 ? 'yellow' : 'green'}>
              {category}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Leyenda Clínica */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
            <div className="flex items-center space-x-3">
              <Info size={20} className="text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800 font-medium">
                <span className="font-bold">Instrucción clínica:</span> En caso de coexistencia de varias situaciones o dispositivos dentro de un mismo dominio, se debe seleccionar siempre la opción con <span className="underline">mayor puntuación</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Paciente / Iniciales</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.patientId}
                onChange={e => setFormData({...formData, patientId: e.target.value})}
                placeholder="Ej: PAC-123"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Unidad</label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cama</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.bed}
                onChange={e => setFormData({...formData, bed: e.target.value})}
                placeholder="Ej: 101-A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {config.domains.map(domain => (
              <div key={domain.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-bold text-slate-800">{domain.name}</label>
                  <div className="group relative">
                    <div className="cursor-help text-slate-400 hover:text-blue-500 transition-colors">
                      <Info size={16} />
                    </div>
                    <div className="absolute bottom-full left-0 mb-2 w-72 p-4 bg-slate-900 text-white text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl border border-slate-700 backdrop-blur-sm">
                      <div className="font-bold mb-1 text-blue-400 uppercase tracking-wider text-[10px]">{domain.name}</div>
                      <p className="leading-relaxed opacity-90">{domain.description}</p>
                      <div className="absolute top-full left-4 -mt-1 border-8 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {domain.options.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        scores: { ...formData.scores, [domain.id]: opt.value }
                      })}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${
                        formData.scores[domain.id] === opt.value 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{opt.label}</span>
                        <span className="font-mono opacity-50">{opt.value}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

const AlertItem = ({ label, count, patients, icon: Icon, color }: { label: string, count: number, patients: string[], icon: any, color: string }) => (
  <div className={`group relative flex justify-between items-center p-2 rounded-lg bg-${color}-50/50`}>
    <div className={`flex items-center space-x-2 text-${color}-600`}>
      <Icon size={16} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className={`text-lg font-bold text-${color}-700`}>{count}</span>
    
    {count > 0 && (
      <div className="absolute left-0 bottom-full mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
        <p className="font-bold mb-1 border-b border-slate-700 pb-1">Pacientes:</p>
        <div className="space-y-1">
          {patients.map(p => <p key={p}>• {p}</p>)}
        </div>
      </div>
    )}
  </div>
);

const UserManagement = ({ onResetPassword, onConfirmAction, onShowNotification }: { 
  onResetPassword: (id: string, username: string) => void,
  onConfirmAction: (title: string, message: string, onConfirm: () => void) => void,
  onShowNotification: (message: string, type?: 'success' | 'error') => void
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
      });
      if (res.ok) {
        setNewUsername('');
        setNewPassword('');
        fetchUsers();
        onShowNotification("Usuario creado correctamente");
      } else {
        const data = await res.json();
        onShowNotification(data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    onConfirmAction(
      "Eliminar Usuario",
      "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      async () => {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        fetchUsers();
        onShowNotification("Usuario eliminado");
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <UserPlus size={20} className="text-blue-600" />
          <span>Crear Nuevo Usuario</span>
        </h3>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Usuario</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rol</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newRole}
              onChange={e => setNewRole(e.target.value as any)}
            >
              <option value="user">Usuario (Solo lectura/registro)</option>
              <option value="admin">Administrador (Control total)</option>
            </select>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            Crear Usuario
          </button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Usuario</th>
              <th className="px-6 py-4 font-bold">Rol</th>
              <th className="px-6 py-4 font-bold">Fecha Creación</th>
              <th className="px-6 py-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{user.username}</td>
                <td className="px-6 py-4">
                  <Badge color={user.role === 'admin' ? 'blue' : 'slate'}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => onResetPassword(user.id, user.username)}
                      className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                      title="Resetear Contraseña"
                    >
                      <Key size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Eliminar Usuario"
                      disabled={user.username === 'admin'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdminWeights = ({ config, records, onSave, onResetPassword, onConfirmAction, onShowNotification }: { 
  config: ICCConfig, 
  records: PatientRecord[], 
  onSave: (newConfig: ICCConfig) => void,
  onResetPassword: (id: string, username: string) => void,
  onConfirmAction: (title: string, message: string, onConfirm: () => void) => void,
  onShowNotification: (message: string, type?: 'success' | 'error') => void
}) => {
  const [localConfig, setLocalConfig] = useState<ICCConfig>(config);
  const [activeTab, setActiveTab] = useState<'weights' | 'users'>('weights');

  const downloadCSV = () => {
    if (records.length === 0) return onShowNotification("No hay datos para descargar", "error");

    const headers = ["ID Paciente", "Unidad", "Cama", "Fecha", "ICC Total", "Categoría", "VM", "LPP", "Fuga", "Aislamiento"];
    const rows = records.map(r => [
      r.patientId,
      r.unit,
      r.bed,
      new Date(r.date).toLocaleDateString(),
      r.totalScore,
      r.category,
      r.alerts.vm ? "Sí" : "No",
      r.alerts.lpp ? "Sí" : "No",
      r.alerts.fuga ? "Sí" : "No",
      r.alerts.aislamiento ? "Sí" : "No"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ICC_Resultados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWeightChange = (domainId: string, optIndex: number, newValue: number) => {
    const newConfig = { ...localConfig };
    newConfig.domains = newConfig.domains.map(d => {
      if (d.id === domainId) {
        const newOptions = [...d.options];
        newOptions[optIndex] = { ...newOptions[optIndex], value: newValue };
        return { ...d, options: newOptions };
      }
      return d;
    });
    setLocalConfig(newConfig);
  };

  const resetToDefault = () => {
    onConfirmAction(
      "Restaurar Valores",
      "¿Estás seguro de restaurar los valores por defecto? Se perderán los cambios no guardados.",
      () => setLocalConfig(DEFAULT_ICC_CONFIG)
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Administración</h2>
          <p className="text-slate-500">Gestiona los pesos del ICC y los usuarios del sistema.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('weights')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'weights' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Pesos ICC
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Usuarios
          </button>
        </div>
      </div>

      {activeTab === 'weights' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex space-x-3">
              <button 
                onClick={downloadCSV}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <Download size={18} />
                <span>Descargar CSV</span>
              </button>
              <button 
                onClick={resetToDefault}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
              >
                <RotateCcw size={18} />
                <span>Restaurar</span>
              </button>
            </div>
            <button 
              onClick={() => onSave(localConfig)}
              className="flex items-center space-x-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              <Save size={18} />
              <span>Guardar Pesos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localConfig.domains.map(domain => (
              <Card key={domain.id}>
                <h4 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>{domain.name}</span>
                </h4>
                <div className="space-y-3">
                  {domain.options.map((opt, idx) => (
                    <div key={opt.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <span className="text-sm text-slate-600">{opt.label}</span>
                      <input 
                        type="number"
                        className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center font-mono font-bold text-blue-600"
                        value={opt.value}
                        onChange={e => handleWeightChange(domain.id, idx, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <UserManagement 
          onResetPassword={onResetPassword} 
          onConfirmAction={onConfirmAction}
          onShowNotification={onShowNotification}
        />
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'patients' | 'admin' | 'form'>('dashboard');
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [config, setConfig] = useState<ICCConfig>(DEFAULT_ICC_CONFIG);
  const [editingRecord, setEditingRecord] = useState<PatientRecord | undefined>();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null });
  const [passwordModal, setPasswordModal] = useState<{ isOpen: boolean, userId: string | null, username: string }>({ isOpen: false, userId: null, username: '' });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: null }), 3000);
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('icc_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('icc_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('icc_user');
  };

  const handleUpdatePassword = (userId?: string, username?: string) => {
    const targetId = userId || currentUser?.id;
    const targetName = username || currentUser?.username;
    if (!targetId) return;
    setPasswordModal({ isOpen: true, userId: targetId, username: targetName || '' });
  };

  const executePasswordUpdate = async (newPass: string) => {
    if (!passwordModal.userId) return;
    
    try {
      const res = await fetch(`/api/users/${passwordModal.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
      });
      if (res.ok) {
        showNotification("Contraseña actualizada correctamente");
        setPasswordModal({ isOpen: false, userId: null, username: '' });
      } else {
        showNotification("Error al actualizar la contraseña", "error");
      }
    } catch (err) {
      showNotification("Error de conexión", "error");
    }
  };

  const fetchData = async () => {
    try {
      const [recRes, confRes] = await Promise.all([
        fetch('/api/records').catch(() => null),
        fetch('/api/config').catch(() => null)
      ]);
      
      let recs = recRes ? await recRes.json() : [];
      const conf = confRes ? await confRes.json() : DEFAULT_ICC_CONFIG;
      
      // Netlify Fallback: Load from localStorage
      const localRecords = JSON.parse(localStorage.getItem('icc_records') || '[]');
      const localConfig = JSON.parse(localStorage.getItem('icc_config') || 'null');

      // Merge records (prefer server if available, but keep local)
      const mergedRecords = [...recs, ...localRecords].reduce((acc: PatientRecord[], current: PatientRecord) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) return acc.concat([current]);
        return acc;
      }, []);

      setRecords(mergedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setConfig(localConfig || conf || DEFAULT_ICC_CONFIG);
    } catch (e) {
      console.error("Error fetching data, falling back to local storage", e);
      const localRecords = JSON.parse(localStorage.getItem('icc_records') || '[]');
      const localConfig = JSON.parse(localStorage.getItem('icc_config') || 'null');
      setRecords(localRecords);
      if (localConfig) setConfig(localConfig);
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async (data: PatientRecord) => {
    // Always save to localStorage for Netlify/Static compatibility
    const localRecords = JSON.parse(localStorage.getItem('icc_records') || '[]');
    const updatedLocal = [data, ...localRecords.filter((r: any) => r.id !== data.id)];
    localStorage.setItem('icc_records', JSON.stringify(updatedLocal));

    try {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.warn("Server storage unavailable, data saved to browser only");
    }
    
    await fetchData();
    setView('patients');
    setEditingRecord(undefined);
  };

  const deleteRecord = (id: string) => {
    confirmAction(
      "Eliminar Registro",
      "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
      async () => {
        // Remove from localStorage
        const localRecords = JSON.parse(localStorage.getItem('icc_records') || '[]');
        localStorage.setItem('icc_records', JSON.stringify(localRecords.filter((r: any) => r.id !== id)));

        try {
          await fetch(`/api/records/${id}`, { method: 'DELETE' });
        } catch (e) {
          console.warn("Server delete unavailable");
        }
        await fetchData();
        showNotification("Registro eliminado");
      }
    );
  };

  const downloadPatientsCSV = () => {
    if (records.length === 0) return showNotification("No hay datos para descargar", "error");

    const headers = ["Paciente", "Unidad/Cama", "ICC", "Categoria", "Alertas"];
    const rows = records.map(r => {
      const alerts = [];
      if (r.alerts.vm) alerts.push("VM");
      if (r.alerts.lpp) alerts.push("LPP");
      if (r.alerts.fuga) alerts.push("Fuga");
      if (r.alerts.aislamiento) alerts.push("Aislamiento");
      
      return [
        r.patientId,
        `${r.unit} / ${r.bed}`,
        r.totalScore,
        r.category,
        alerts.join(" | ")
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ICC_Pacientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveConfig = async (newConfig: ICCConfig) => {
    // Save to localStorage
    localStorage.setItem('icc_config', JSON.stringify(newConfig));

    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (e) {
      console.warn("Server config storage unavailable");
    }
    await fetchData();
    showNotification("Configuración guardada");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin text-blue-600">
        <RotateCcw size={48} />
      </div>
    </div>
  );

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:w-64 bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50">
        <div className="hidden md:flex flex-col p-6 h-full">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Activity size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">ICC Rehab</h1>
          </div>
          
          <div className="space-y-2 flex-grow">
            <button 
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setView('patients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === 'patients' || view === 'form' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Users size={20} />
              <span>Pacientes</span>
            </button>
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => setView('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${view === 'admin' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Settings size={20} />
                <span>Configuración</span>
              </button>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {currentUser?.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{currentUser?.username}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{currentUser?.role === 'admin' ? 'Administrador' : 'Enfermería'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handleUpdatePassword}
                  className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                  title="Cambiar Contraseña"
                >
                  <Key size={18} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                © - ehernandez 2026
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex justify-around p-4">
          <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}><LayoutDashboard /></button>
          <button onClick={() => setView('patients')} className={view === 'patients' ? 'text-blue-600' : 'text-slate-400'}><Users /></button>
          <button onClick={() => setView('admin')} className={view === 'admin' ? 'text-blue-600' : 'text-slate-400'}><Settings /></button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-10 pb-24 md:pb-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 capitalize">
              {view === 'dashboard' ? 'Panel de Control' : view === 'patients' ? 'Gestión de Pacientes' : view === 'admin' ? 'Administración' : 'Registro ICC'}
            </h2>
            <p className="text-slate-500">
              {view === 'dashboard' ? 'Análisis de complejidad asistencial en tiempo real.' : 'Listado de valoraciones y registros históricos.'}
            </p>
          </div>
          
          {(view === 'patients' || view === 'dashboard') && (
            <button 
              onClick={() => { setEditingRecord(undefined); setView('form'); }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo Registro</span>
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard records={records} config={config} />
            </motion.div>
          )}

          {view === 'patients' && (
            <motion.div key="patients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar por ID o Unidad..." 
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={downloadPatientsCSV}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                      title="Descargar Reporte"
                    >
                      <Download size={18} />
                      <span className="hidden sm:inline">Descargar</span>
                    </button>
                    <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-500"><Filter size={20} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-xs text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-bold">Paciente</th>
                        <th className="px-6 py-4 font-bold">Unidad / Cama</th>
                        <th className="px-6 py-4 font-bold text-center">ICC</th>
                        <th className="px-6 py-4 font-bold">Categoría</th>
                        <th className="px-6 py-4 font-bold">Alertas</th>
                        <th className="px-6 py-4 font-bold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{r.patientId}</p>
                            <p className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Badge color="slate">{r.unit}</Badge>
                              <span className="text-sm text-slate-600 font-medium">{r.bed}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-lg font-black text-slate-700">{r.totalScore}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge color={r.totalScore > 60 ? 'red' : r.totalScore > 40 ? 'orange' : r.totalScore > 20 ? 'yellow' : 'green'}>
                              {r.category}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-1">
                              {r.alerts.vm && <div className="p-1 rounded bg-indigo-100 text-indigo-600" title="VM"><Wind size={14} /></div>}
                              {r.alerts.lpp && <div className="p-1 rounded bg-rose-100 text-rose-600" title="LPP"><ShieldAlert size={14} /></div>}
                              {r.alerts.fuga && <div className="p-1 rounded bg-amber-100 text-amber-600" title="Fuga"><AlertTriangle size={14} /></div>}
                              {r.alerts.aislamiento && <div className="p-1 rounded bg-slate-200 text-slate-600" title="Aislamiento"><ShieldAlert size={14} /></div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => { setEditingRecord(r); setView('form'); }}
                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => deleteRecord(r.id)}
                                className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PatientForm 
                config={config}
                initialData={editingRecord}
                onSave={saveRecord}
                onCancel={() => { setView('patients'); setEditingRecord(undefined); }}
                onShowNotification={showNotification}
              />
            </motion.div>
          )}

          {view === 'admin' && currentUser?.role === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminWeights 
                config={config} 
                records={records} 
                onSave={saveConfig} 
                onResetPassword={handleUpdatePassword}
                onConfirmAction={confirmAction}
                onShowNotification={showNotification}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Modals & Notifications */}
        <AnimatePresence>
          {notification.message && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed bottom-24 md:bottom-10 right-4 md:right-10 px-6 py-3 rounded-2xl shadow-2xl z-[200] flex items-center space-x-3 border ${
                notification.type === 'error' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <Info size={18} />
              <span className="font-bold">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Modal 
          isOpen={passwordModal.isOpen} 
          onClose={() => setPasswordModal({ isOpen: false, userId: null, username: '' })}
          title="Cambiar Contraseña"
        >
          <PasswordChangeForm 
            username={passwordModal.username}
            onSubmit={executePasswordUpdate}
            onCancel={() => setPasswordModal({ isOpen: false, userId: null, username: '' })}
          />
        </Modal>

        <Modal 
          isOpen={confirmModal.isOpen} 
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          title={confirmModal.title}
        >
          <div className="space-y-6">
            <p className="text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

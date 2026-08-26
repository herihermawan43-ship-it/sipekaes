import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Sparkles, Shield, Users, UserCheck, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';

const demoAccounts = [
  { role: 'Super Admin', username: 'superadmin', icon: Shield, color: 'from-orange-500 to-orange-600' },
  { role: 'Admin Pusat', username: 'adminpusat', icon: Users, color: 'from-amber-500 to-orange-500' },
  { role: 'Admin Input', username: 'admininput', icon: UserCheck, color: 'from-orange-400 to-amber-500' },
  { role: 'Koordinator', username: 'koordinator', icon: MapPin, color: 'from-orange-500 to-red-500' },
  { role: 'Saksi TPS', username: 'saksi', icon: ShieldCheck, color: 'from-amber-400 to-orange-400' },
];

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        toast({ title: 'Login berhasil', description: 'Selamat datang di SiPekaeS' });
        navigate('/dashboard');
      } else {
        toast({ title: 'Login gagal', description: result.message, variant: 'destructive' });
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (uname) => {
    setUsername(uname);
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient relative overflow-hidden text-white p-12 flex-col justify-between">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight leading-none">SiPekaeS</h1>
              <p className="text-xs font-semibold tracking-[0.15em] mt-1 opacity-90">PUSAT KOORDINASI SUKABUMI</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Menangkan Setiap<br/>Suara. Kuasai Setiap<br/>Wilayah.
          </h2>
          <p className="text-lg opacity-90 font-medium max-w-md">
            Platform terintegrasi untuk memantau, mengelola, dan memenangkan pemilu di Kabupaten Sukabumi.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-md">
            {[
              { v: '47', l: 'Kecamatan' },
              { v: '381', l: 'Desa/Kel' },
              { v: '3.000+', l: 'RW' },
            ].map(s => (
              <div key={s.l} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-extrabold">{s.v}</p>
                <p className="text-xs font-semibold opacity-90 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs opacity-75 font-medium">© 2025 SiPekaeS. Sistem Pemenangan Terpadu.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl sidebar-gradient flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">SiPekaeS</h1>
              <p className="text-[10px] font-semibold tracking-[0.15em] opacity-70">PUSAT KOORDINASI SUKABUMI</p>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">Selamat Datang!</h2>
          <p className="text-gray-500 font-medium mt-2 mb-8">Masuk ke sistem pemenangan Anda</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="font-semibold text-gray-700 text-sm mb-2 block">Username</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="h-12 rounded-xl border-gray-200 font-medium"
                required
              />
            </div>
            <div>
              <Label className="font-semibold text-gray-700 text-sm mb-2 block">Password</Label>
              <div className="relative">
                <Input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="h-12 rounded-xl border-gray-200 font-medium pr-11"
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/30">
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs font-semibold text-gray-400 tracking-wider">LOGIN CEPAT DEMO</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.username}
                    onClick={() => quickLogin(acc.username)}
                    className={`p-3 rounded-xl bg-gradient-to-br ${acc.color} text-white text-left hover:opacity-90 transition-opacity`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <p className="text-xs font-bold">{acc.role}</p>
                    <p className="text-[10px] opacity-90 font-medium">{acc.username}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4 font-medium">Password semua demo: <span className="font-bold text-gray-600">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

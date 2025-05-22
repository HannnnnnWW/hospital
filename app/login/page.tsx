// pages/login.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);

    const router = useRouter();

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
    };

    const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (registerUsername === '' || registerPassword === '') {
            alert('注册时用户名和密码不能为空，请重新输入！');
            return;
        }
        //前端模拟登录，后续会替换为后端API
        setShowRegisterSuccess(true);//全部认为登录成功
        setTimeout(() => {
            setShowRegisterSuccess(false);
            setActiveTab('login');
        }, 1500);//延迟模拟网络请求
        //实际注册逻辑
        /*const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 增强前端验证
  if (!/^[a-zA-Z0-9_]{4,16}$/.test(registerUsername)) {
    alert('用户名需4-16位字母/数字/下划线');
    return;
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(registerPassword)) {
    alert('密码需至少8位且包含字母和数字');
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword
      })
    });

    const data = await res.json();
    
    if (res.status === 201) {
      setShowRegisterSuccess(true);
      setTimeout(() => {
        setActiveTab('login');
        setRegisterUsername('');
        setRegisterPassword('');
      }, 1500);
    } else {
      alert(`注册失败: ${data.message}`);
    }
  } catch (err) {
    alert('网络连接异常，请检查后重试');
  }
};*/
//实际登录逻辑
/*const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword
      }),
      credentials: 'include' // 允许携带Cookie
    });

    if (res.ok) {
      const data = await res.json();
      // 存储用户信息（示例）
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      router.push('/');
    } else {
      const errorData = await res.json();
      alert(`登录失败: ${errorData.message}`);
    }
  } catch (err) {
    alert('网络请求失败，请检查连接');
  }
};*/
/*
//全局认证状态功能
export const checkAuth = async () => {
  try {
    const res = await fetch('/api/auth/check', {
      credentials: 'include'
    });
    return res.ok;
  } catch (err) {
    return false;
  }
};

// 在页面跳转时验证
useEffect(() => {
  checkAuth().then(authenticated => {
    if (authenticated) router.push('/');
  });
}, []);*/
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loginUsername === '' || loginPassword === '') {
            alert('登录时用户名和密码不能为空，请重新输入！');
            return;
        }
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/');
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center min-h-screen flex-col">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <ul className="flex justify-around mb-6">
                    <li
                        className={`cursor-pointer text-lg font-semibold ${activeTab === 'login' ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleTabChange('login')}
                    >
                        登录
                    </li>
                    <li
                        className={`cursor-pointer text-lg font-semibold ${activeTab === 'register' ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => handleTabChange('register')}
                    >
                        注册
                    </li>
                </ul>

                {activeTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-4">
                            <label htmlFor="loginUsername" className="block text-gray-700 text-sm font-bold mb-2">
                                用户名
                            </label>
                            <input
                                type="text"
                                id="loginUsername"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="请输入用户名"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="loginPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                密码
                            </label>
                            <input
                                type="password"
                                id="loginPassword"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="请输入密码"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            登录
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="mb-4">
                            <label htmlFor="registerUsername" className="block text-gray-700 text-sm font-bold mb-2">
                                用户名
                            </label>
                            <input
                                type="text"
                                id="registerUsername"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="请输入用户名"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="registerPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                密码
                            </label>
                            <input
                                type="password"
                                id="registerPassword"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="请输入密码"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            注册
                        </button>
                    </form>
                )}

                {showRegisterSuccess && (
                    <div className="mt-4 text-center text-green-500">
                        注册成功！
                    </div>
                )}
            </div>
            <Link href="/" className="mt-6 text-blue-500 hover:underline">返回首页</Link>
        </div>
    );
};

export default LoginPage;
// pages/login.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 更新 API 基础 URL
const API_BASE = 'http://121.40.80.144:3001/api';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        setError('');
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 前端验证
        if (!registerUsername || !registerPassword) {
            setError('用户名和密码不能为空');
            setIsLoading(false);
            return;
        }

        if (registerUsername.length < 4 || registerUsername.length > 16) {
            setError('用户名长度需在4-16位之间');
            setIsLoading(false);
            return;
        }

        if (registerPassword.length < 8) {
            setError('密码长度至少为8位');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: registerUsername,
                    password: registerPassword
                }),
                signal: AbortSignal.timeout(10000) // 10秒超时
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
                setError(data.message || '注册失败');
            }
        } catch (err: any) {
            console.error('注册失败:', err);
            if (err.name === 'AbortError') {
                setError('注册请求超时，请检查网络连接');
            } else if (err.message.includes('Failed to fetch')) {
                setError('无法连接到服务器，请检查：\n1. 服务器是否正在运行\n2. 网络连接是否正常\n3. 服务器地址是否正确');
            } else {
                setError(err.message || '注册失败');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!loginUsername || !loginPassword) {
            setError('用户名和密码不能为空');
            setIsLoading(false);
            return;
        }

        try {
            // 检查是否是管理员登录
            const isAdminLogin = loginUsername === '00000000' && loginPassword === '00000000';
            
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword
                }),
                signal: AbortSignal.timeout(10000) // 10秒超时
            });

            const data = await res.json();

            if (res.ok && data.user && data.token) {
                // 存储用户信息和token
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                if (isAdminLogin) {
                    localStorage.setItem('isAdmin', 'true');
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(data.message || '登录失败');
            }
        } catch (err: any) {
            console.error('登录失败:', err);
            if (err.name === 'AbortError') {
                setError('登录请求超时，请检查网络连接');
            } else if (err.message.includes('Failed to fetch')) {
                setError('无法连接到服务器，请检查：\n1. 服务器是否正在运行\n2. 网络连接是否正常\n3. 服务器地址是否正确');
            } else {
                setError(err.message || '登录失败');
            }
        } finally {
            setIsLoading(false);
        }
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

                {error && (
                    <div className="mb-4 text-red-500 text-center">
                        {error}
                    </div>
                )}

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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '处理中...' : '登录'}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '处理中...' : '注册'}
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
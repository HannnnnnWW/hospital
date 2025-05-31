'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3001/api'; // 使用实际的 API 基础 URL

interface Registration {
    id: string; // 假设后端返回的挂号记录有 id
    orderNumber: string; // 订单号或其他唯一标识
    department: string; // 科室名称
    doctor: string; // 医生姓名
    status: '已预约' | '已取消' | '已完成'; // 挂号状态
    scheduleTime: string; // 挂号时间
    clinicLocation?: string; // 诊室位置 (可选)
}

export default function ProfilePage() {
    const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);// 使用实际的类型
    const [loading, setLoading] = useState(true); // 添加加载状态
    const [error, setError] = useState<string | null>(null); // 添加错误状态
    const router = useRouter();

    useEffect(() => {
        // 检查登录状态，未登录则重定向到登录页面
        const token = localStorage.getItem('token');
        if (!token) {
            alert('请先登录');
            router.push('/login');
            return;
        }

        const fetchRegistrations = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('正在请求用户挂号记录...');
                console.log('请求URL:', `${API_BASE}/user/appointments`);
                console.log('Token:', token);

                const res = await fetch(`${API_BASE}/user/appointments`, { // 替换为你的后端 API 地址
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(10000) // 10秒超时
                });

                console.log('服务器响应状态:', res.status);
                console.log('服务器响应头:', Object.fromEntries(res.headers.entries()));

                if (res.status === 401) {
                    // Token 过期或无效，清除本地存储并重定向到登录页
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('isAdmin');
                    alert('登录已过期，请重新登录');
                    router.push('/login');
                    return;
                }

                if (!res.ok) {
                     const errorText = await res.text();
                     console.error('服务器错误响应:', errorText);
                    throw new Error(`获取挂号记录失败: ${res.status} ${res.statusText}\n${errorText}`);
                }

                const data: Registration[] = await res.json();
                console.log('获取到的挂号记录:', data);
                setUserRegistrations(data);
            } catch (err: any) {
                 console.error('获取挂号记录失败:', err);
                if (err.name === 'AbortError') {
                    setError('请求超时，请检查网络连接');
                } else if (err.message.includes('Failed to fetch')) {
                     setError('无法连接到服务器，请检查：\n1. 服务器是否正在运行\n2. 网络连接是否正常\n3. 服务器地址是否正确');
                 } else {
                    setError(err.message || '获取挂号记录失败');
                 }
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();

    }, [router]); // 添加 router 依赖

    const handleLogout = () => {
        // 这里通常只清除前端认证状态
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isAdmin');

        // 如果后端有登出 API，可以在这里调用
        // fetch(`${API_BASE}/auth/logout`, { method: 'POST' }); // 示例

        // 返回首页
        router.push('/');
    };

    if (loading) {
        return <div className="loading">加载中...</div>; // 添加加载提示
    }

     if (error) {
         return <div className="error-message">错误：{error}</div>; // 添加错误提示
    }

    return (
        <div className="profile-container">
            <header>
                <h1>个人中心</h1>
                <Link href="/" className="return-btn">返回首页</Link>
            </header>
            <div className="user-registrations">
                <h3 className="section-title">我的挂号记录</h3>
                {userRegistrations.length > 0 ? (
                    <ul>
                        {userRegistrations.map((reg) => ( // 使用 reg.id 作为 key
                            <li key={reg.id}>
                                <div>订单号：{reg.orderNumber}</div>
                                <div>科室：{reg.department}</div>
                                <div>医生：{reg.doctor}</div>
                                <div>状态：{reg.status}</div>
                                <div>时间：{reg.scheduleTime}</div>
                                {reg.clinicLocation && <div>诊室：{reg.clinicLocation}</div>}
                            </li>
                        ))}
                    </ul>
                ) : ( // 在加载完成且没有记录时显示
                     !loading && <p>暂无挂号记录</p>
                )}
            </div>
            {/* 添加登出按钮 */}
            <div className="logout-section mt-8">
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={handleLogout}
                >
                    退出登录
                </button>
            </div>
        </div>
    );
}
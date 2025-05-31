'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import '../style.css';

/**
 * 医生信息类型定义
 */
type Doctor = {
    scheduleId: any;
    id: number;        // 医生ID
    name: string;      // 医生姓名
    title: '主任医师' | '副主任医师' | '主治医师';     // 职称
    specialty: string; // 专长
    price: number;     // 挂号价格
};

/**
 * 科室页面组件
 * 管理医生列表展示、挂号功能和用户交互
 */
const DepartmentPage = () => {
    // 状态管理
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([]); // 医生列表数据
    const [loading, setLoading] = useState(true);                 // 加载状态
    const [error, setError] = useState<string | null>(null);      // 错误信息
    const [isLoggedIn, setIsLoggedIn] = useState(false);         // 登录状态
    const [isAdmin, setIsAdmin] = useState(false);               // 管理员状态
    const [showModal, setShowModal] = useState(false);           // 挂号确认弹窗显示状态
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // 选中的医生
    const [showTooltip, setShowTooltip] = useState(false);       // 工具提示显示状态
    const [appointmentTime, setAppointmentTime] = useState('');  // 挂号时间

    const router = useRouter();
    const params = useSearchParams();

    /**
     * 显示工具提示
     */
    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    /**
     * 隐藏工具提示
     */
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    /**
     * 格式化日期时间为友好显示格式
     */
    const formatDateTime = (date: Date) => {
        const weekday = date.toLocaleString('zh-CN', { weekday: 'long' });
        const dateStr = date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        return `${dateStr} ${timeStr}（${weekday}）`;
    };

    /**
     * 默认医生数据
     * 当API请求失败时使用
     */
    const defaultDoctors: Doctor[] = [
        { id: 1, name: '医生 1', title: '主任医师', specialty: '科室', price: 10 },
        { id: 2, name: '医生 2', title: '副主任医师', specialty: '科室', price: 8 },
        { id: 3, name: '医生 3', title: '主治医师', specialty: '科室', price: 6 },
    ];

    // 从环境变量中获取 API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    useEffect(() => {
        /**
         * 检查用户登录状态
         * 从 localStorage 中获取 token 和用户信息
         */
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const userInfo = localStorage.getItem('userInfo');
            const adminStatus = localStorage.getItem('isAdmin');
            setIsLoggedIn(!!(token && userInfo));
            setIsAdmin(adminStatus === 'true');
        };

        checkLoginStatus();

        /**
         * 获取医生数据
         * 从API获取指定科室的医生列表
         */
        const fetchData = async () => {
            console.log('fetchData 函数被调用');
            setLoading(true);
            setError(null);

            try {
                const department = params.get('department');
                const res = await fetch(`${apiUrl}/doctors?department=${department}`);
                console.log('fetch 函数调用完成，返回结果:', res);

                if (!res.ok) {
                    throw new Error(`获取医生列表失败: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                if (data.length === 0) {
                    setDoctorsData(defaultDoctors);
                } else {
                    // 确保每个医生对象都包含 scheduleId 属性
                    const doctorsWithScheduleId = await Promise.all(data.map(async (doctor: { id: any; }) => {
                        const scheduleRes = await fetch(`${apiUrl}/doctorSchedules?doctorId=${doctor.id}`);
                        if (!scheduleRes.ok) {
                            console.error(`获取医生排班信息失败: ${scheduleRes.status} ${scheduleRes.statusText}`);
                            return {
                                ...doctor,
                                scheduleId: null // 如果获取排班信息失败，则设置 scheduleId 为 null
                            };
                        }
                        const schedules = await scheduleRes.json();
                        // 这里假设每个医生只有一个排班，如果一个医生有多个排班，你需要根据实际情况选择一个
                        const scheduleId = schedules.length > 0 ? schedules[0].id : null;
                        return {
                            ...doctor,
                            scheduleId: scheduleId
                        };
                    }));
                    setDoctorsData(doctorsWithScheduleId);
                }
            } catch (error: any) {
                setError(error.message);
                setDoctorsData(defaultDoctors);
                console.error('获取医生数据失败:', error);
            } finally {
                setLoading(false);
            }
            console.log('fetchData 函数调用完成');
        };
        fetchData();
    }, [apiUrl, params]);

    /**
     * 处理挂号按钮点击
     * 检查登录状态并显示挂号确认弹窗
     * @param doctor 选中的医生信息
     */
    const handleRegister = (doctor: Doctor) => {
        if (!isLoggedIn) {
            alert('请先登录后再进行挂号');
            router.push('/login');
            return;
        }
        setSelectedDoctor(doctor);
        setAppointmentTime(formatDateTime(new Date()));
        setShowModal(true);
    };

   // 前端代码

/**
 * 处理挂号确认
 * 发送挂号请求到服务器并跳转支付
 */
const handleConfirmRegister = async () => {
    try {
        if (!selectedDoctor) {
            throw new Error('未选择医生');
        }

        const token = localStorage.getItem('token');
        
        // 创建挂号订单
        const res = await fetch(`${apiUrl}appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                scheduleId: selectedDoctor.scheduleId // 假设 selectedDoctor 对象中包含 scheduleId
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`挂号失败: ${res.status} ${res.statusText} - ${errorData.message}`);
        }

        const responseData = await res.json();
        
        // 跳转到支付页面
        router.push(`/payment?orderId=${responseData.orderId}&amount=${selectedDoctor.price}`);

    } catch (err: any) {
        alert(`挂号失败: ${err.message}`);
    } finally {
        setShowModal(false);
    }
};

    // 渲染页面内容
    return (
        <div className="department-container">
            {/* 页面头部 */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                <h1 id="departmentTitle">医生列表</h1>
                <div className="header-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link href="/" className="return-btn">返回首页</Link>
                    {isLoggedIn ? (
                        <div className="header-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {isAdmin && (
                                <Link href="/admin" className="admin-btn">管理后台</Link>
                            )}
                            <Link href="/profile" className="login-btn">个人中心</Link>
                        </div>
                    ) : (
                        <Link href="/login" className="login-btn">用户登录</Link>
                    )}
                </div>
            </header>

            {/* 加载状态显示 */}
            {loading ? (
                <div className="loading">
                    加载中...
                </div>
            ) : error ? (
                <div className="error">
                    错误: {error}
                </div>
            ) : (
                /* 医生列表显示 */
                <div className="doctor-list">
                    {doctorsData.map((doctor, index) => (
                        <div key={doctor.id} className="doctor-card">
                            <h3>
                                序号：{index + 1} 医生：{doctor.name || '暂无数据'}
                            </h3>
                            <p className="doctor-info">职称: {doctor.title || '暂无数据'}</p>
                            <p className="doctor-info">专长: {doctor.specialty || '暂无数据'}</p>
                            <p className="doctor-info">挂号费用: {doctor.price || 0} 元</p>
                            <button
                                className="register-btn"
                                onClick={() => handleRegister(doctor)}
                            >
                                挂号
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 挂号确认弹窗 */}
            {showModal && selectedDoctor && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setShowModal(false)}>×</span>
                        <h2>确认挂号</h2>
                        <p>医生：{selectedDoctor.name}</p>
                        <p>职称：{selectedDoctor.title}</p>
                        <p>专长：{selectedDoctor.specialty}</p>
                        <p>挂号时间：{appointmentTime}</p>
                        <p className="text-red-500 font-bold text-lg">挂号费用：{selectedDoctor.price} 元</p>
                        <div className="modal-buttons">
                            <button 
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleConfirmRegister}
                            >
                                确认并支付
                            </button>
                            <button 
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentPage;
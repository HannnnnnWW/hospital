'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
// 包含全局的 style.css 文件
import '../style.css'; 

// 定义医生类型
type Doctor = {
    id: number;
    name: string;
    title: string;
    specialty: string;
};

const DepartmentPage = () => {
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    useEffect(() => {
        // 检查登录状态
        const checkLoginStatus = () => {
            const loginStatus = localStorage.getItem('isLoggedIn');
            setIsLoggedIn(loginStatus === 'true');
        };
        
        checkLoginStatus();

        // 模拟获取医生数据
        const mockData: Doctor[] = [
            { id: 1, name: '王强', title: '主任医师', specialty: '高血压门诊' },
            { id: 2, name: '李明', title: '副主任医师', specialty: '消化内科' },
            { id: 3, name: '张华', title: '主治医师', specialty: '呼吸内科' }
        ];
        setDoctorsData(mockData);
        setLoading(false);
    }, []);

    const handleRegister = (doctor: Doctor) => {
        if (!isLoggedIn) {
            alert('请先登录后再进行挂号');
            return;
        }
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleConfirmRegister = () => {
        if (selectedDoctor) {
            // 保存挂号信息，前端模拟
            const registrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
            //手动构造挂号记录
            registrations.push({
                department: new URLSearchParams(window.location.search).get('department'),
                doctorName: selectedDoctor.name,
                registrationTime: new Date().toLocaleString()
            });
            localStorage.setItem('userRegistrations', JSON.stringify(registrations));
            
            setShowModal(false);
            alert('挂号成功！');
            window.location.href = '/';//直接跳转前端，没有与服务器交互
        }
    };
    //后端API挂号
/*const handleConfirmRegister = async () => { // 改为异步
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        department: params.get('department'),
        time: new Date().toISOString() // 使用标准时间格式
      })
    });

    if (!res.ok) throw new Error('挂号失败');
    
    alert('挂号成功！');
    router.push('/');
  } catch (err) {
    alert('挂号失败: ' + err.message);
  } finally {
    setShowModal(false);
  }
};*/
    if (loading) {
        return (
            <div className="department-container">
                <header>
                    <h1 id="departmentTitle">医生列表</h1>
                    <div className="header-buttons">
                        <Link href="/" className="return-btn">返回首页</Link>
                    </div>
                </header>
                <div className="loading">加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="department-container">
                <header>
                    <h1 id="departmentTitle">医生列表</h1>
                    <div className="header-buttons">
                        <Link href="/" className="return-btn">返回首页</Link>
                    </div>
                </header>
                <div className="error">错误: {error}</div>
            </div>
        );
    }

    return (
        <div className="department-container">
            <header>
                <h1 id="departmentTitle">医生列表</h1>
                <div className="header-buttons">
                    <Link href="/" className="return-btn">返回首页</Link>
                </div>
            </header>
            <div className="doctor-list">
                {doctorsData.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                        <h3>{doctor.name}</h3>
                        <p className="doctor-info">职称: {doctor.title}</p>
                        <p className="doctor-info">专长: {doctor.specialty}</p>
                        <button 
                            className="register-btn"
                            onClick={() => handleRegister(doctor)}
                        >
                            挂号
                        </button>
                    </div>
                ))}
            </div>

            {/* 挂号确认弹窗 */}
            {showModal && selectedDoctor && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setShowModal(false)}>×</span>
                        <h2>确认挂号</h2>
                        <p>医生：{selectedDoctor.name}</p>
                        <p>职称：{selectedDoctor.title}</p>
                        <p>专长：{selectedDoctor.specialty}</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirmRegister}>确认挂号</button>
                            <button onClick={() => setShowModal(false)}>取消</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentPage;
// hospital/app/doctor/view/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../../style.css'; 

// 定义医生类型
type Doctor = {
    id: number;
    name: string;
    title: string;
    specialty: string;
};

const DoctorViewPage = () => {
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 模拟获取医生数据
        const mockData: Doctor[] = [
            { id: 1, name: '王强', title: '主任医师', specialty: '高血压门诊' },
            { id: 2, name: '李明', title: '副主任医师', specialty: '消化内科' },
            { id: 3, name: '张华', title: '主治医师', specialty: '呼吸内科' }
        ];
        setDoctorsData(mockData);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="department-container">
                <header>
                    <h1 id="departmentTitle">医生列表</h1>
                    <div className="header-buttons">
                        <Link href="/admin" className="return-btn">返回管理页</Link>
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
                        <Link href="/admin" className="return-btn">返回管理页</Link>
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
                    <Link href="/admin" className="return-btn">返回管理页</Link>
                </div>
            </header>
            <div className="doctor-list">
                {doctorsData.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                        <h3>{doctor.name}</h3>
                        <p className="doctor-info">职称: {doctor.title}</p>
                        <p className="doctor-info">专长: {doctor.specialty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorViewPage;
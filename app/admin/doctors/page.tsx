// hospital/app/doctor/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../style.css'; 

// 定义医生类型
type Doctor = {
    id: number;
    name: string;
    title: string;
    specialty: string;
};

const DoctorDeletePage = () => {
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
     const [newDoctor, setNewDoctor] = useState('');
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
    const handleDeleteDoctor = (doctorId: number) => {
        // 这里留出删除逻辑的接口，将来可以替换为实际的 API 调用
        console.log('Deleting doctor with ID:', doctorId);
        // 调用删除 API
        // fetch(`/api/doctors/${doctorId}`, {
        //     method: 'DELETE'
        // })
        // .then(response => {
        //     if (response.ok) {
        //         setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        //     } else {
        //         console.error('删除医生信息失败');
        //     }
        // })
        // .catch(error => {
        //     console.error('网络错误:', error);
        // });
    };

        const handleAddDepartment = () => {
        //添加逻辑接口
    };



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
                         <button 
                            className="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                        >
                            删除信息
                        </button>
                    </div>
                ))}
            </div>
            <div className="doctor-list">
                <div className="doctor-card">
                <h3>添加新医生</h3>
                <div>
                <input
                    type="text"
                    placeholder="请输入医生姓名"
                    className="input-field"
                />
                </div>
                <div>
                <input
                    type="text"
                    placeholder="请输入医生职称"
                    className="input-field"
                />
                </div>
                <div>
                <input
                    type="text"
                    placeholder="请输入医生专长"
                    className="input-field"
                />
                </div>
                <button onClick={handleAddDepartment} className="add-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    添加
                </button>
                </div>
            </div>


        </div>
    );

};

export default DoctorDeletePage;
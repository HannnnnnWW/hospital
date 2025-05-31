// hospital/app/doctor/page.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../style.css'; 

// 定义医生类型
type Doctor = {
    id: number;
    name: string;
    title: string;
    specialty: string;
    department?: string;
};

// 表单输入类型
type DoctorForm = {
    name: string;
    title: string;
    specialty: string;
};

const DoctorDeletePage = () => {
    const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
    const [formData, setFormData] = useState<DoctorForm>({
        name: '',
        title: '',
        specialty: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<Partial<DoctorForm>>({});
    const router = useRouter();
    const params = useSearchParams();

    // 定义默认医生数据
    const defaultDoctors: Doctor[] = [
        { id: 1, name: '医生 1', title: '主任医师', specialty: '内科' },
        { id: 2, name: '医生 2', title: '副主任医师', specialty: '外科' },
        { id: 3, name: '医生 3', title: '主治医师', specialty: '儿科' },
    ];

    // 从环境变量中获取 API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    // 获取当前科室参数
    const department = params.get('department') || '';

    useEffect(() => {
        // 获取医生数据
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`${apiUrl}/doctors?department=${department}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch doctors: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                if (data.length === 0) {
                    setDoctorsData(defaultDoctors);
                } else {
                    setDoctorsData(data);
                }
            } catch (error: any) {
                setError(error.message);
                setDoctorsData(defaultDoctors);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [department]);

    // 处理输入变更
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // 清除该字段的错误
        setFormError(prev => ({ ...prev, [name]: '' }));
    };

    // 表单验证
    const validateForm = (data: DoctorForm) => {
        const errors: Partial<DoctorForm> = {};
        let isValid = true;

        if (!data.name.trim()) {
            errors.name = '请输入医生姓名';
            isValid = false;
        }

        if (!data.title.trim()) {
            errors.title = '请输入医生职称';
            isValid = false;
        }

        if (!data.specialty.trim()) {
            errors.specialty = '请输入医生专长';
            isValid = false;
        }

        setFormError(errors);
        return isValid;
    };

    // 处理删除医生
    const handleDeleteDoctor = async (doctorId: number) => {
        if (!confirm('确定要删除该医生信息吗？')) {
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/doctors/${doctorId}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error(`Failed to delete doctor: ${res.status} ${res.statusText}`);
            }

            // 更新本地状态
            setDoctorsData(prev => prev.filter(doctor => doctor.id !== doctorId));
            alert('医生信息已成功删除');
        } catch (error: any) {
            alert('删除医生信息失败: ' + error.message);
        }
    };

    // 处理添加医生
    const handleAddDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 表单验证
        if (!validateForm(formData)) {
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/doctors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    department: department || undefined
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to add doctor: ${res.status} ${res.statusText} - ${errorData.message}`);
            }

            const newDoctor: Doctor = await res.json();
            setDoctorsData(prev => [...prev, newDoctor]);
            setFormData({ name: '', title: '', specialty: '' });
            alert('医生信息添加成功！');
        } catch (error: any) {
            alert('医生信息添加失败: ' + error.message);
        }
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
                <h1 id="departmentTitle">
                    {department ? `${department}科室医生列表` : '医生列表'}
                </h1>
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
                        {doctor.department && <p className="doctor-info">科室: {doctor.department}</p>}
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
                    <form onSubmit={handleAddDoctor}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="请输入医生姓名"
                                className={`input-field ${formError.name ? 'border-red-500' : ''}`}
                            />
                            {formError.name && <span className="text-red-500 text-sm">{formError.name}</span>}
                        </div>
                        
                        <div>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="请输入医生职称"
                                className={`input-field ${formError.title ? 'border-red-500' : ''}`}
                            />
                            {formError.title && <span className="text-red-500 text-sm">{formError.title}</span>}
                        </div>
                        
                        <div>
                            <input
                                type="text"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleInputChange}
                                placeholder="请输入医生专长"
                                className={`input-field ${formError.specialty ? 'border-red-500' : ''}`}
                            />
                            {formError.specialty && <span className="text-red-500 text-sm">{formError.specialty}</span>}
                        </div>
                        
                        <button 
                            type="submit" 
                            className="add-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            添加
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorDeletePage;
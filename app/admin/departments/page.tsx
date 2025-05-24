// hospital/app/admin/deleteDepartmentPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../style.css'; 

// 定义科室类型
type Department = {
    id: number;
    name: string;
};

const DeleteDepartmentPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        // 模拟获取科室数据
        const mockDepartments: Department[] = [
            { id: 1, name: '内科门诊' },
            { id: 2, name: '外科门诊' },
            { id: 3, name: '儿科门诊' },
            { id: 4, name: '妇产科门诊' },
            { id: 5, name: '急诊科' }
        ];
        setDepartments(mockDepartments);
    }, []);

    const handleDeleteDepartment = (department: Department) => {
        // 这里可以实现删除科室信息的逻辑
    };

    return (
        <div className="department-container">
             <header>
                <h1 id="departmentTitle">科室列表</h1>
                <div className="header-buttons">
                    <Link href="/admin" className="return-btn">返回管理页</Link>
                </div>
            </header>
            <div className="department-section">
                {departments.map((department) => (
                    <div key={department.id} className="doctor-card"> {/* 复用 doctor-card 样式 */}
                        <h3>{department.name}</h3>
                        <button 
                            className="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDeleteDepartment(department)}
                        >
                            删除信息
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeleteDepartmentPage;
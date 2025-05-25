'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import '../../style.css';

type Department = {
    id: number;
    name: string;
};

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [newDepartmentName, setNewDepartmentName] = useState('');

    useEffect(() => {
        // 模拟获取科室数据
        const mockDepartments = [
            { id: 1, name: '内科门诊' },
            { id: 2, name: '外科门诊' },
            { id: 3, name: '儿科门诊' },
            { id: 4, name: '妇产科门诊' },
            { id: 5, name: '急诊科' }
        ];
        setDepartments(mockDepartments);
    }, []);

    const handleDeleteDepartment = (id: number) => {
        // 这里将来会替换为实际的删除科室的 API 调用
        console.log(`Deleting department with id: ${id}`);
    };

    const handleAddDepartment = () => {
        if (newDepartmentName.trim() === '') {
            return;
        }
        // 这里将来替换为实际的添加科室的 API 调用
        const newDepartment: Department = {
            id: departments.length + 1,
            name: newDepartmentName
        };
        setDepartments([...departments, newDepartment]);
        setNewDepartmentName('');
    };

    return (
        <div className="departments-container">
            <header>
                <h1>科室信息管理</h1>
                <div className="header-buttons">
                    <Link href="/admin" className="return-btn">返回管理页</Link>
                </div>
            </header>
            <div className="doctor-list">
                    {departments.map((dept) => (

                    <div key={dept.id} className="doctor-card">
                        <h3>{dept.name}</h3>
                         <button 
                            className="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDeleteDepartment(dept.id)}
                        >
                            删除信息
                        </button>
                    </div>
                    ))}

            </div>
            <div className="doctor-list">
                <div className="doctor-card">
                <h3>添加新科室</h3>
                <input
                    type="text"
                    placeholder="请输入科室名称"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleAddDepartment} className="add-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    添加
                </button>
                </div>
            </div>
        </div>
    );
};

export default DepartmentsPage;
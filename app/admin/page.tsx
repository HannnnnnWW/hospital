// hospital/app/admin/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 定义医生类型
type Doctor = {
    id: number;
    name: string;
    title: string;
    specialty: string;
};

// 定义文章类型
type Article = {
    id: number;
    title: string;
    content: string;
};

const AdminPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [newArticleTitle, setNewArticleTitle] = useState('');
    const [newArticleContent, setNewArticleContent] = useState('');
    const router = useRouter();

    useEffect(() => {
        // 模拟获取医生数据
        const mockDoctors: Doctor[] = [
            { id: 1, name: '王强', title: '主任医师', specialty: '高血压门诊' },
            { id: 2, name: '李明', title: '副主任医师', specialty: '消化内科' },
            { id: 3, name: '张华', title: '主治医师', specialty: '呼吸内科' }
        ];
        setDoctors(mockDoctors);

        // 模拟获取公告数据
        const mockArticles: Article[] = [
            { id: 1, title: '【最新】五一假期门诊安排通知', content: '五一期间门诊正常开放...' },
            { id: 2, title: '新引进 CT 设备正式投入使用', content: '我院最新引进的256层螺旋CT...' }
        ];
        setArticles(mockArticles);
    }, []);

    const handleUpdateDoctor = (doctor: Doctor) => {
        // 这里可以实现更新医生信息的逻辑
        console.log('Updating doctor:', doctor);
    };

    const handleUpdateArticle = (article: Article) => {
        // 这里可以实现更新公告内容的逻辑
        console.log('Updating article:', article);
    };

    const handleAddArticle = () => {
        if (newArticleTitle && newArticleContent) {
            const newArticle: Article = {
                id: articles.length + 1,
                title: newArticleTitle,
                content: newArticleContent
            };
            setArticles([...articles, newArticle]);
            setNewArticleTitle('');
            setNewArticleContent('');
        }
    };

    const handleLogout = () => {
        // 清除认证状态
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        // 返回首页
        router.push('/');
    };

    return (
        <div className="admin-container">
            <header>
                <h1>管理员页面</h1>
                <div className="header-buttons">
                    <Link href="/" className="return-btn">返回首页</Link>
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLogout}
                    >
                        退出登录
                    </button>
                </div>
            </header>
            <div className="doctor-section">
                <h2>医生信息管理</h2>
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                        <h3>{doctor.name}</h3>
                        <p className="doctor-info">职称: {doctor.title}</p>
                        <p className="doctor-info">专长: {doctor.specialty}</p>
                        <button 
                            className="update-btn"
                            onClick={() => handleUpdateDoctor(doctor)}
                        >
                            修改信息
                        </button>
                    </div>
                ))}
            </div>
            <div className="article-section">
                <h2>公告内容管理</h2>
                {articles.map((article) => (
                    <div key={article.id} className="article-card">
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                        <button 
                            className="update-btn"
                            onClick={() => handleUpdateArticle(article)}
                        >
                            修改内容
                        </button>
                    </div>
                ))}
                <div className="add-article">
                    <h3>添加新公告</h3>
                    <input
                        type="text"
                        placeholder="公告标题"
                        value={newArticleTitle}
                        onChange={(e) => setNewArticleTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="公告内容"
                        value={newArticleContent}
                        onChange={(e) => setNewArticleContent(e.target.value)}
                    />
                    <button onClick={handleAddArticle}>添加</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
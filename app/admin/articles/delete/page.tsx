'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../../style.css';

// 定义文章（公告）类型
type Article = {
    id: number;
    title: string;
    content: string;
};

const DeleteArticle = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 从环境变量获取API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://121.40.80.144:3001/api';

    useEffect(() => {
        const fetchArticles = async () => {
            console.log('fetchArticles 函数被调用');
            try {
                const token = localStorage.getItem('token'); // 获取 token

                const res = await fetch(`${apiUrl}/articles`, { // 确保 API 路径正确
                    headers: {
                        'Authorization': `Bearer ${token}` // 添加认证头
                    },
                    signal: AbortSignal.timeout(10000) // 10秒超时
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`获取公告数据失败: ${res.status} ${res.statusText}\n${errorText}`);
                }

                const data = await res.json();
                console.log('从后端 API 获取到的文章数据:', data);
                setArticles(data.articles); // 只设置 articles 属性
                console.log('articles 状态被更新:', data.articles);
            } catch (error: any) {
                console.error('获取公告数据失败:', error);
                if (error.name === 'AbortError') {
                    setError('请求公告数据超时，请检查网络连接');
                } else if (error.message.includes('Failed to fetch')) {
                    setError('无法连接到服务器，请检查：\n1. 服务器是否正在运行\n2. 网络连接是否正常\n3. 服务器地址是否正确');
                } else {
                    setError(error.message);
                }
                // 使用模拟数据作为后备
                const mockArticles = [
                    { id: 1, title: '【最新】五一假期门诊安排通知', content: '五一期间门诊正常开放...' },
                    { id: 2, title: '新引进 CT 设备正式投入使用', content: '我院最新引进的256层螺旋CT...' }
                ];
                console.log('使用模拟数据作为后备:', mockArticles);
                setArticles(mockArticles);
                console.log('articles 状态被更新:', mockArticles);
            }
            console.log('fetchArticles 函数调用完成');
        };

        fetchArticles();
    }, [apiUrl]);

    const handleDeleteArticle = async (id: number) => {
    if (!confirm('确定要删除该公告吗？')) {
        return;
    }

    try {
        const token = localStorage.getItem('token'); // 获取token
        
        const res = await fetch(`${apiUrl}/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // 添加认证头
            },
            signal: AbortSignal.timeout(10000) // 添加超时设置
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`删除公告失败: ${res.status} ${res.statusText}\n${errorText}`);
        }

        setArticles(prev => prev.filter(article => article.id !== id));
        alert('公告删除成功');
    } catch (err: any) {
        console.error('删除公告失败:', err);
        alert(`删除公告失败: ${err.message}`);
    }
};

    return (
        <div className="admin-container">
            <header>
                <h1>删除公告</h1>
                <div className="header-buttons">
                    <Link href="/admin" className="return-btn">返回管理页</Link>
                </div>
            </header>
            {loading && <div className="loading"></div>}
            {error && <div className="error">{error}</div>}
            <div className="doctor-list">
                {articles.map((article) => (
                    <div key={article.id} className="doctor-card">
                        <h3>{article.title}</h3>
                        <button
                            className="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDeleteArticle(article.id)}
                        >
                            删除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeleteArticle;
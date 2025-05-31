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
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`${apiUrl}/articles`);
                if (!res.ok) {
                    throw new Error(`获取公告列表失败: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                setArticles(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [apiUrl]);

    const handleDeleteArticle = async (id: number) => {
        if (!confirm('确定要删除该公告吗？')) {
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/articles/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`删除公告失败: ${res.status} ${res.statusText}`);
            }

            setArticles(prev => prev.filter(article => article.id !== id));
            alert('公告删除成功');
        } catch (err: any) {
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
            {loading && <div className="loading">加载中...</div>}
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